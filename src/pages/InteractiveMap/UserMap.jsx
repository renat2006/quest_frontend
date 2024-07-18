import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import QuestInfoModal from "../../componets/PlaceInfoModal/PlaceInfoModal.jsx";


const UserMap = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const initialPositionSet = useRef(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(12);

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        if (!mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: import.meta.env.VITE_MAP_STYLE,
                center: [49.106414, 55.796127],
                zoom: 12,
            });

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

                const data = JSON.parse(localStorage.getItem('mapData'));
                if (data) {
                    data.features.forEach(feature => {
                        if (feature.geometry.type === 'Point') {
                            const markerElement = document.createElement('div');
                            markerElement.className = 'custom-marker';

                            const markerImage = document.createElement('img');
                            markerImage.src = feature.properties.image || 'https://via.placeholder.com/300x200';
                            markerImage.className = 'marker-image';

                            const markerPoint = document.createElement('div');
                            markerPoint.className = 'marker-point';

                            const markerLabel = document.createElement('div');
                            markerLabel.className = 'marker-label';
                            markerLabel.textContent = feature.properties.name;

                            markerElement.appendChild(markerImage);
                            markerElement.appendChild(markerPoint);
                            markerElement.appendChild(markerLabel);

                            const marker = new mapboxgl.Marker(markerElement)
                                .setLngLat(feature.geometry.coordinates)
                                .addTo(mapRef.current);

                            markerElement.addEventListener('click', () => {
                                setSelectedPoint(feature);
                                onOpen();
                            });

                            markerElement.dataset.id = feature.id;
                        } else if (feature.geometry.type === 'LineString') {
                            mapRef.current.addLayer({
                                id: feature.id,
                                type: 'line',
                                source: {
                                    type: 'geojson',
                                    data: feature,
                                },
                                layout: {
                                    'line-join': 'round',
                                    'line-cap': 'round',
                                },
                                paint: {
                                    'line-color': '#438EE4',
                                    'line-width': 4,
                                },
                            });
                        }
                    });
                }
            });

            mapRef.current.on('zoom', () => {
                setZoomLevel(mapRef.current.getZoom());
            });
        }
    }, []);

    useEffect(() => {
        const updateMarkerStyles = () => {
            const markers = document.querySelectorAll('.custom-marker');
            markers.forEach(marker => {
                const markerImage = marker.querySelector('.marker-image');
                const markerLabel = marker.querySelector('.marker-label');
                const markerPoint = marker.querySelector('.marker-point');

                console.log('Zoom Level:', zoomLevel);
                console.log('Marker Image:', markerImage);

                if (zoomLevel >= 15) {
                    marker.style.display = 'flex';
                    markerImage.style.display = 'block';
                    markerImage.style.width = '50px';
                    markerImage.style.height = '50px';
                    markerPoint.style.display = 'block';
                    markerPoint.style.width = '10px';
                    markerPoint.style.height = '10px';
                    markerLabel.style.display = 'block';
                } else if (14 <= zoomLevel && zoomLevel < 15) {
                    marker.style.display = 'flex';
                    markerImage.style.display = 'block';
                    markerImage.style.width = '30px';
                    markerImage.style.height = '30px';

                    markerPoint.style.display = 'block';
                    markerPoint.style.width = '8px';
                    markerPoint.style.height = '8px';
                    markerLabel.style.display = 'block';
                    markerLabel.style.display = 'none';
                } else if (zoomLevel < 14) {
                    marker.style.display = 'flex';
                    markerImage.style.display = 'none';
                    markerPoint.style.display = 'block';
                    markerPoint.style.width = '6px';
                    markerPoint.style.height = '6px';
                    markerLabel.style.display = 'none';
                }

                if (selectedPoint && marker.dataset.id === selectedPoint.id) {
                    markerImage.style.width = '100px';
                    markerImage.style.height = '100px';
                }
            });
        };

        updateMarkerStyles();

        mapRef.current.on('zoom', updateMarkerStyles);
        mapRef.current.on('move', updateMarkerStyles);

        return () => {
            mapRef.current.off('zoom', updateMarkerStyles);
            mapRef.current.off('move', updateMarkerStyles);
        };
    }, [zoomLevel, selectedPoint]);

    const handleCloseModal = () => {
        setSelectedPoint(null);
        onOpenChange(false);
    };

    return (
        <div className="map--container h-full w-full">
            <div id="map" ref={mapContainerRef} className="h-full w-full"></div>
            {selectedPoint && (
                <QuestInfoModal
                    isOpen={isOpen}
                    onOpenChange={handleCloseModal}
                    point={selectedPoint}
                />
            )}
        </div>
    );
};

export default React.memo(UserMap);
