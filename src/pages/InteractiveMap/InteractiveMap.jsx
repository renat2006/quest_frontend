import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState, memo } from "react";
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
    AutocompleteItem
} from "@nextui-org/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { languageList } from "../../data/types.js";

const validationSchema = Yup.object().shape({
    pointName: Yup.string()
        .required("Название не может быть пустым.")
        .max(30, "Название не должно превышать 30 символов.")
        .matches(/^[\p{L}\p{N}\s]+$/u, "Название может содержать только стандартные символы Unicode."),
    pointLanguage: Yup.string().required("Язык точки должен быть выбран."),
});

const PointFormModal = ({ isOpen, onClose, onSubmit }) => {
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="auto">
            <ModalContent>
                {(onClose) => (
                    <Formik
                        initialValues={{ pointName: "", pointLanguage: languageList[0].value }}
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
                                                {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
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
    const [selectedPoint, setSelectedPoint] = useState(null);

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        if (!mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: import.meta.env.VITE_MAP_STYLE,
                center: [49.106414, 55.796127],
                zoom: 15,
            });

            const Draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    point: true,
                    line_string: true,
                    trash: true,
                },
            });

            mapRef.current.addControl(Draw);

            const saveData = () => {
                const data = Draw.getAll();
                console.log(data);
                localStorage.setItem('mapData', JSON.stringify(data));
            };

            mapRef.current.on('draw.create', (e) => {
                saveData();
                const coordinates = e.features[0].geometry.coordinates;
                setNewPoint(coordinates);
                onOpen();
            });
            mapRef.current.on('draw.update', saveData);
            mapRef.current.on('draw.delete', saveData);

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
    }, []);

    const handleFormSubmit = (values) => {
        const newPointData = {
            coordinates: newPoint,
            name: values.pointName,
            image: values.image || "https://via.placeholder.com/300x200" // Add path to placeholder image
        };
        setPoints([...points, newPointData]);
        addMarkerToMap(newPointData);
    };

    const addMarkerToMap = (point) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${point.image})`;
        el.style.borderRadius = "15px";
        el.style.width = '75px';
        el.style.height = '75px';
        el.style.backgroundSize = 'cover';
        el.style.transition = 'width 0.3s, height 0.3s, opacity 0.3s';

        const textDiv = document.createElement('div');
        textDiv.className = 'marker-text';
        textDiv.innerText = point.name;
        textDiv.style.textAlign = 'center';
        textDiv.style.marginTop = '5px';
        textDiv.style.transition = 'opacity 0.3s';

        const wrapper = document.createElement('div');
        wrapper.appendChild(el);
        wrapper.appendChild(textDiv);

        wrapper.addEventListener('click', () => {
            if (selectedPoint && selectedPoint !== wrapper) {
                selectedPoint.children[0].style.width = '75px';
                selectedPoint.children[0].style.height = '75px';
            }
            el.style.width = '100px';
            el.style.height = '100px';
            setSelectedPoint(wrapper);
        });

        new mapboxgl.Marker(wrapper)
            .setLngLat(point.coordinates)
            .addTo(mapRef.current);
    };

    const adjustMarkersBasedOnZoom = (zoomLevel) => {
        const markers = document.getElementsByClassName('marker');
        const texts = document.getElementsByClassName('marker-text');

        for (let i = 0; i < markers.length; i++) {
            const marker = markers[i];
            const text = texts[i];
            if (zoomLevel < 14) {
                marker.style.width = '50px';
                marker.style.height = '50px';
                text.style.opacity = '0';
            } else {
                marker.style.width = '75px';
                marker.style.height = '75px';
                text.style.opacity = '1';
            }

            if (zoomLevel < 13) {
                marker.style.opacity = '0';
            } else {
                marker.style.opacity = '1';
            }
        }

        if (selectedPoint) {
            selectedPoint.children[0].style.width = '100px';
            selectedPoint.children[0].style.height = '100px';
            selectedPoint.style.opacity = '1';
            if (zoomLevel < 10) {
                selectedPoint.style.opacity = '1';
            }
        }
    };

    return (
        <div className="w-full h-[calc(100dvh_-_200px)]">
            <div id="map" ref={mapContainerRef}></div>
            <PointFormModal isOpen={isOpen} onClose={onOpenChange} onSubmit={handleFormSubmit} />
        </div>
    );
};

export default memo(InteractiveMap);
