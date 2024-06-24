import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const InteractiveMap = () => {
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
                zoom: 10,
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

            mapRef.current.on('draw.create', saveData);
            mapRef.current.on('draw.update', saveData);
            mapRef.current.on('draw.delete', saveData);

            // Закомментированные части для геолокации, если необходимо
            // const geolocate = new mapboxgl.GeolocateControl({
            //     positionOptions: {
            //         enableHighAccuracy: true,
            //     },
            //     trackUserLocation: true,
            //     showUserHeading: true,
            // });

            // mapRef.current.addControl(geolocate);
            // mapRef.current.on('load', () => {
            //     geolocate.trigger();
            // });
        }
    }, []);

    return <div className="map--container"><div id="map" ref={mapContainerRef}></div></div>;
};

export default React.memo(InteractiveMap);
