import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, {useEffect, useRef, useState, memo} from "react";
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
    AutocompleteItem, Avatar
} from "@nextui-org/react";
import {Formik, Form, Field} from "formik";
import * as Yup from "yup";
import {languageList} from "../../data/types.js";
import ReactDOM, {createRoot} from "react-dom/client";
import {capitalizeFirstLetter} from "../../methods/methods.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faGlobe, faLanguage} from "@fortawesome/free-solid-svg-icons";

const PopupContent = ({name, languageCode, onEdit}) => {
    const languageName = languageList.find(lang => lang.value === languageCode)?.label || languageCode;

    return (
        <div className="flex flex-col gap-1.5 p-2 ">
            <div className="popover-title text-base font-bold flex items-center w-full  justify-between">
                <div className="line-clamp-1 max-w-[75px]"> {capitalizeFirstLetter(name)} </div>
                <Avatar isBordered color="primary" radius="sm" size="sm"
                        src="https://avatars.mds.yandex.net/i?id=b6b043354e6d2d770429e29ab4c12394cd63383709223706-12510920-images-thumbs&n=13"/>
            </div>
            <div className="popover-subtitle flex gap-1.5 items-center"><FontAwesomeIcon icon={faGlobe}/> {languageName}
            </div>
            <Button size="sm"
                    color="primary"
                    onClick={onEdit}
                    startContent={<FontAwesomeIcon icon={faEdit}/>}
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

const PointFormModal = ({isOpen, onClose, onSubmit, initialValues}) => {
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
                        {({setFieldValue, errors, touched}) => (
                            <Form>
                                <ModalHeader className="flex flex-col gap-1">Создать точку</ModalHeader>
                                <ModalBody>
                                    <Field name="pointName">
                                        {({field}) => (
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
                                        {({field}) => (
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
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [newPoint, setNewPoint] = useState(null);
    const [points, setPoints] = useState(() => {
        const savedPoints = localStorage.getItem('points');
        return savedPoints ? JSON.parse(savedPoints) : [];
    });
    const drawRef = useRef(null);

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
                        drawRef.current = Draw;

                        const savedData = localStorage.getItem('mapData');
                        if (savedData) {
                            Draw.set(JSON.parse(savedData));
                        }

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
                    }
                );
            });
        }
    }, []);

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
        saveData();
    };

    const handleDrawDelete = () => {
        saveData();
    };

    const handleDrawUpdate = () => {
        saveData();
    };

    const handleSelectionChange = (e) => {
        const selectedFeatures = e.features;
        if (selectedFeatures.length > 0) {
            const feature = selectedFeatures[0];
            if (feature.geometry.type === 'Point') {
                const coordinates = feature.geometry.coordinates.slice();
                const name = feature.properties.name;
                const languageCode = feature.properties.language;

                const popupNode = document.createElement('div');

                const onEdit = () => {
                    setNewPoint({id: feature.id, coordinates});
                    onOpen();
                    popup.remove();
                };

                const root = createRoot(popupNode);
                root.render(<PopupContent name={name} languageCode={languageCode} onEdit={onEdit}/>);

                const popup = new mapboxgl.Popup({offset: 25})
                    .setLngLat(coordinates)
                    .setDOMContent(popupNode)
                    .addTo(mapRef.current);
            }
        }
    };

    const handleFormSubmit = (values) => {
        const newPointData = {
            id: newPoint.id,
            coordinates: newPoint.coordinates,
            name: values.pointName,
            language: values.pointLanguage
        };
        setPoints(prevPoints => {
            const updatedPoints = [...prevPoints, newPointData];
            localStorage.setItem('points', JSON.stringify(updatedPoints));
            return updatedPoints;
        });

        drawRef.current.add({
            type: 'Feature',
            properties: {name: values.pointName, language: values.pointLanguage},
            geometry: {
                type: 'Point',
                coordinates: newPoint.coordinates
            }
        });
        saveData();
    };

    const saveData = () => {
        const data = drawRef.current.getAll();
        console.log(data);
        localStorage.setItem('mapData', JSON.stringify(data));
    };

    const adjustMarkersBasedOnZoom = (zoomLevel) => {
        // Adjust marker styles based on zoom level if necessary
    };

    return (
        <div className="w-full h-[calc(100dvh_-_200px)]">
            <div id="map" ref={mapContainerRef}></div>
            <PointFormModal isOpen={isOpen} onClose={onOpenChange} onSubmit={handleFormSubmit}
                            initialValues={{pointName: "", pointLanguage: languageList[0].value}}/>
        </div>
    );
};

export default memo(InteractiveMap);
