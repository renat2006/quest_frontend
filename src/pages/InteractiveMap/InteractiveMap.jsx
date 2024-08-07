import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState, memo } from "react";
import JSZip from 'jszip';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {
    Modal,
    ModalContent,
    Input,
    Button,
    useDisclosure,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Autocomplete,
    AutocompleteItem, Avatar, ButtonGroup
} from "@nextui-org/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { languageList } from "../../data/types.js";
import ReactDOM, { createRoot } from "react-dom/client";
import {capitalizeFirstLetter, downloadBlob, handlePublishQuest, handleSubmit} from "../../methods/methods.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { createLocation, getUUID, updateLocation, fetchQuestLocations } from "../../api/api.js";
import { useAuth } from "../../providers/AuthProvider.jsx";
import { toast } from "react-hot-toast";
import { useQuest } from "../../providers/RouteProvider.jsx";
import { useNavigate } from "react-router-dom";
import routes from "../../routes/routes.js";
import { faEye, faSave } from "@fortawesome/free-regular-svg-icons";

// Function to handle fetching and parsing the ZIP file
const fetchAndProcessLocations = async (questId, token) => {
    try {
        const zipBlob = await fetchQuestLocations(questId, token, true);

        const zip = await JSZip.loadAsync(zipBlob);
        const locations = [];

        await Promise.all(
            Object.keys(zip.files).map(async (filePath) => {
                if (filePath.endsWith('data.json')) {
                    const fileData = await zip.file(filePath).async('string');
                    const dataJson = JSON.parse(fileData);

                    const folderPath = filePath.split('/').slice(0, -1).join('/');
                    const promoFilePath = `${folderPath}/promo_draft.webp`;

                    const promoFile = zip.file(promoFilePath);

                    let promoUrl = '';

                    if (promoFile) {
                        const promoBlob = await promoFile.async('blob');
                        promoUrl = URL.createObjectURL(promoBlob);
                        console.log("edededede", promoUrl)
                    }

                    locations.push({
                        id: dataJson.location_id,
                        name: dataJson.title_draft || "Untitled",
                        coordinates: dataJson.coords_draft.split(';').map(Number),
                        language: dataJson.lang_draft,
                        description: dataJson.description_draft || '',
                        promoUrl: promoUrl || 'https://via.placeholder.com/100',
                    });
                }
            })
        );

        return locations;
    } catch (error) {
        console.error('Error fetching or processing locations:', error);
        throw error;
    }
};
const PopupContent = ({ name, languageCode, promoUrl, onEdit }) => {
    const languageName = languageList.find(lang => lang.value === languageCode)?.label || languageCode;

    return (
        <div className="flex flex-col gap-1.5 p-2 ">
            <div className="popover-title text-base font-bold flex items-center w-full justify-between">
                <div className="line-clamp-1 max-w-[75px]"> {capitalizeFirstLetter(name)} </div>
                <Avatar isBordered color="primary" radius="sm" size="sm" name={name} src={promoUrl} />
            </div>
            <div className="popover-subtitle flex gap-1.5 items-center"><FontAwesomeIcon icon={faGlobe} /> {languageName}
            </div>
            <Button size="sm"
                    color="primary"
                    onClick={onEdit}
                    startContent={<FontAwesomeIcon icon={faEdit} />}
            >
                Редактировать
            </Button>
        </div>
    );
};

const validationSchema = Yup.object().shape({
    pointName: Yup.string()
        .required("Название не может быть пустым.")
        .max(30, "Название не должно превышать 30 символов.")
        .matches(/^[\p{L}\p{N}\s]+$/u, "Название может содержать только стандартные символы Unicode."),
    pointLanguage: Yup.string().required("Язык точки должен быть выбран."),
});

const PointFormModal = ({ isOpen, onClose, onSubmit, initialValues }) => {
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="auto">
            <ModalContent>
                {(onClose) => (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            onSubmit(values);
                            onClose();
                        }}
                    >
                        {({ setFieldValue, errors, touched }) => (
                            <Form>
                                <ModalHeader className="flex flex-col gap-1">Создать точку</ModalHeader>
                                <ModalBody>
                                    <Field name="pointName">
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                autoFocus
                                                isRequired
                                                isClearable
                                                label="Название"
                                                placeholder="Введите название точки"
                                                variant="bordered"
                                                errorMessage={touched.pointName && errors.pointName}
                                                isInvalid={touched.pointName && !!errors.pointName}
                                            />
                                        )}
                                    </Field>
                                    <Field name="pointLanguage">
                                        {({ field }) => (
                                            <Autocomplete
                                                {...field}
                                                isRequired
                                                label="Язык"
                                                variant="bordered"
                                                defaultItems={languageList}
                                                placeholder="Выберите язык точки"
                                                selectedKey={field.value}
                                                onSelectionChange={(key) => setFieldValue("pointLanguage", key)}
                                                errorMessage={touched.pointLanguage && errors.pointLanguage}
                                                isInvalid={touched.pointLanguage && !!errors.pointLanguage}
                                            >
                                                {(item) => <AutocompleteItem
                                                    key={item.value}>{item.label}</AutocompleteItem>}
                                            </Autocomplete>
                                        )}
                                    </Field>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onClose}>
                                        Отмена
                                    </Button>
                                    <Button color="primary" type="submit">
                                        Создать
                                    </Button>
                                </ModalFooter>
                            </Form>
                        )}
                    </Formik>
                )}
            </ModalContent>
        </Modal>
    );
};

const InteractiveMap = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const initialPositionSet = useRef(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [newPoint, setNewPoint] = useState(null);
    const [points, setPoints] = useState([]);
    const drawRef = useRef(null);
    const { accessToken } = useAuth();
    const { questData, setQuestData } = useQuest();
    const navigate = useNavigate();  // Initialize the useNavigate hook
    const { questId } = questData;

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        if (!mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: import.meta.env.VITE_MAP_STYLE,
                center: [49.106414, 55.796127],
                zoom: 15,
            });

            mapRef.current.on('load', () => {
                mapRef.current.loadImage(
                    'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                    (error, image) => {
                        if (error) throw error;
                        if (!mapRef.current.hasImage('custom-marker')) {
                            mapRef.current.addImage('custom-marker', image);
                        }

                        const Draw = new MapboxDraw({
                            displayControlsDefault: false,
                            controls: {
                                point: true,
                                line_string: true,
                                trash: true,
                            },
                            styles: [
                                {
                                    'id': 'highlight-active-points',
                                    'type': 'symbol',
                                    'filter': ['all',
                                        ['==', '$type', 'Point'],
                                        ['==', 'meta', 'feature'],
                                        ['==', 'active', 'true']],
                                    'layout': {
                                        'icon-image': 'custom-marker',
                                        'icon-size': 0.8,
                                        'icon-allow-overlap': true
                                    }
                                },
                                {
                                    'id': 'points-are-blue',
                                    'type': 'symbol',
                                    'filter': ['all',
                                        ['==', '$type', 'Point'],
                                        ['==', 'meta', 'feature'],
                                        ['==', 'active', 'false']],
                                    'layout': {
                                        'icon-image': 'custom-marker',
                                        'icon-size': 0.6,
                                        'icon-allow-overlap': true
                                    }
                                },
                                {
                                    'id': 'lines',
                                    'type': 'line',
                                    'filter': ['all', ['==', '$type', 'LineString']],
                                    'layout': {
                                        'line-cap': 'round',
                                        'line-join': 'round'
                                    },
                                    'paint': {
                                        'line-color': '#438EE4',
                                        'line-width': 4
                                    }
                                }
                            ]
                        });

                        mapRef.current.addControl(Draw);
                        drawRef.current = Draw; // Correctly assign the instance

                        mapRef.current.on('draw.create', handleDrawCreate);
                        mapRef.current.on('draw.delete', handleDrawDelete);
                        mapRef.current.on('draw.update', handleDrawUpdate);

                        mapRef.current.on('draw.selectionchange', handleSelectionChange);

                        const geolocate = new mapboxgl.GeolocateControl({
                            positionOptions: {
                                enableHighAccuracy: true,
                            },
                            trackUserLocation: true,
                            showUserHeading: true,
                            showAccuracyCircle: false,
                        });

                        mapRef.current.addControl(geolocate);
                        mapRef.current.on('load', () => {
                            geolocate.on('geolocate', (e) => {
                                const coords = [e.coords.longitude, e.coords.latitude];

                                if (!initialPositionSet.current) {
                                    mapRef.current.setCenter(coords);
                                    initialPositionSet.current = true;
                                }
                            });
                            geolocate.trigger();
                        });

                        mapRef.current.on('zoom', () => {
                            const zoomLevel = mapRef.current.getZoom();
                            adjustMarkersBasedOnZoom(zoomLevel);
                        });

                        // Load locations only after the map is fully loaded
                        loadLocations();
                    }
                );
            });
        }

        const loadLocations = async () => {
            try {
                const locations = await fetchAndProcessLocations(questId, accessToken);
                console.log("Loaded locations", locations);
                setPoints(locations);

                // Ensure drawRef.current is set before adding locations
                if (drawRef.current) {
                    locations.forEach(location => {
                        console.log("Adding location to map", location);
                        drawRef.current.add({
                            type: 'Feature',
                            properties: { name: location.name, language: location.language, location_id: location.id, promoUrl: location.promoUrl },
                            geometry: {
                                type: 'Point',
                                coordinates: location.coordinates
                            }
                        });
                    });
                } else {
                    console.warn('Draw control not initialized yet');
                }
            } catch (error) {
                console.error('Error loading locations', error);
                toast.error('Error loading locations');
            }
        };
    }, [accessToken, questId]);

    const handleDrawCreate = (e) => {
        const createdFeature = e.features[0];
        if (createdFeature.geometry.type === 'Point') {
            setNewPoint({
                id: createdFeature.id,
                coordinates: createdFeature.geometry.coordinates
            });
            onOpen();
            drawRef.current.delete([createdFeature.id]);
        }
    };

    const handleDrawDelete = () => { };

    const handleDrawUpdate = () => { };

    const handleSelectionChange = (e) => {
        const selectedFeatures = e.features;
        if (selectedFeatures.length > 0) {
            const feature = selectedFeatures[0];
            if (feature.geometry.type === 'Point') {
                const coordinates = feature.geometry.coordinates.slice();
                const name = feature.properties.name;
                const languageCode = feature.properties.language;
                const locationId = feature.properties.location_id;
                const PromoUrl = feature.properties.promoUrl
                console.log(PromoUrl)

                const popupNode = document.createElement('div');

                const onEdit = () => {
                    // Navigate using location_id
                    navigate(routes.admin.locationAdminInfo.url, { state: locationId });
                };

                const root = createRoot(popupNode);
                root.render(
                    <PopupContent
                        name={name}
                        languageCode={languageCode}
                        promoUrl={PromoUrl}
                        onEdit={onEdit}
                    />
                );

                const popup = new mapboxgl.Popup({ offset: 25 })
                    .setLngLat(coordinates)
                    .setDOMContent(popupNode)
                    .addTo(mapRef.current);
            }
        }
    };

    const handleFormSubmit = async (values) => {
        const toastId = toast.loading("Создание...");
        try {
            const { uuid } = await getUUID(accessToken);
            const newPointId = uuid[0];

            const createResponse = await createLocation(newPointId, accessToken);
            console.log('Location created:', createResponse);

            const updateData = {
                title: values.pointName,
                coords: newPoint.coordinates.join(';'),
                lang: values.pointLanguage,
                description: ''
            };

            const updateResponse = await updateLocation(newPointId, updateData, accessToken);
            console.log('Location updated:', updateResponse);

            const newPointData = {
                id: newPointId,
                coordinates: newPoint.coordinates,
                name: values.pointName,
                language: values.pointLanguage,
                promoUrl: ''
            };

            setPoints(prevPoints => {
                const updatedPoints = [...prevPoints, newPointData];
                return updatedPoints;
            });

            drawRef.current.add({
                type: 'Feature',
                properties: { name: values.pointName, language: values.pointLanguage, location_id: newPointId },
                geometry: {
                    type: 'Point',
                    coordinates: newPoint.coordinates
                }
            });

            toast.success("Точка успешно создана", { id: toastId });
        } catch (error) {
            console.error('Error creating or updating location:', error);
            toast.error("Ошибка при создании точки", { id: toastId });
        }
    };

    const handleSave = async () => {
        const routeLocations = points.map(point => point.id);
        const values = { routeLocations };
        await handleSubmit(values, questData, setQuestData, accessToken);
    };

    const adjustMarkersBasedOnZoom = (zoomLevel) => {
        // Adjust marker styles based on zoom level if necessary
    };

    return (
        <div className="w-full flex gap-3 flex-col h-[calc(100dvh_-_200px)]">
            <div id="map" ref={mapContainerRef}></div>
            <ButtonGroup color="primary">
                <Button startContent={<FontAwesomeIcon icon={faSave} />} onPress={handleSave}>Сохранить</Button>
                <Button variant="bordered" onPress={() => handlePublishQuest(questData, accessToken)}
                        startContent={<FontAwesomeIcon icon={faEye} />}>Опубликовать</Button>
            </ButtonGroup>
            <PointFormModal isOpen={isOpen} onClose={onOpenChange} onSubmit={handleFormSubmit}
                            initialValues={{ pointName: "", pointLanguage: languageList[0].value }} />
        </div>
    );
};

export default memo(InteractiveMap);
