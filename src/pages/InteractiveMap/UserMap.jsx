import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, {Component, useEffect} from "react";

import MapboxDraw from "@mapbox/mapbox-gl-draw";


export default class UserMap extends Component {

    constructor(props) {
        super(props);
        this.divRef = React.createRef();
        this.handleLoad = this.handleLoad.bind(this);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        this.handleLoad();

    }

    handleLoad() {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;


        const userMap = new mapboxgl.Map({
            container: 'map',
            style: import.meta.env.VITE_MAP_STYLE,
            center: [49.106414, 55.796127],
            zoom: 16,
        });


        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true,
            showAccuracyCircle: false,
        });

        userMap.addControl(geolocate);

        userMap.on('load', () => {
            geolocate.on('geolocate', (e) => {
                const coords = [e.coords.longitude, e.coords.latitude];

                if (!this.initialPositionSet) {
                    userMap.setCenter(coords);
                    this.initialPositionSet = true;
                }
            });
            geolocate.trigger();


            const data = JSON.parse(localStorage.getItem('mapData'));
            if (data) {
                data.features.forEach(feature => {
                    if (feature.geometry.type === 'Point') {
                        new mapboxgl.Marker()
                            .setLngLat(feature.geometry.coordinates)
                            .addTo(userMap)
                            .getElement()
                            .addEventListener('click', () => {
                                alert(`Вы нажали на точку с координатами: ${feature.geometry.coordinates}`);
                            });
                    } else if (feature.geometry.type === 'LineString') {
                        userMap.addLayer({
                            id: feature.id,
                            type: 'line',
                            source: {
                                type: 'geojson',
                                data: feature
                            },
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            paint: {
                                'line-color': '#888',
                                'line-width': 8
                            }
                        });
                    }
                });
            }
        });
    }

    render() {
        return (
            <div className="map--container">
                <div id="map" ref={this.divRef}></div>
            </div>
        );
    }
}
