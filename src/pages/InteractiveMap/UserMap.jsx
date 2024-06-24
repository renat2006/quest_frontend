import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const UserMap = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const initialPositionSet = useRef(false);

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        if (!mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: import.meta.env.VITE_MAP_STYLE,
                center: [49.106414, 55.796127],
                zoom: 16,
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
                            new mapboxgl.Marker()
                                .setLngLat(feature.geometry.coordinates)
                                .addTo(mapRef.current)
                                .getElement()
                                .addEventListener('click', () => {
                                    alert(`Вы нажали на точку с координатами: ${feature.geometry.coordinates}`);
                                });
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
                                    'line-color': '#888',
                                    'line-width': 8,
                                },
                            });
                        }
                    });
                }
            });
        }
    }, []);

    return <div className="map--container"><div id="map" ref={mapContainerRef}></div></div>;
};

export default React.memo(UserMap);
