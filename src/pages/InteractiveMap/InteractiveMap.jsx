import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, {Component, useEffect} from "react";

import MapboxDraw from "@mapbox/mapbox-gl-draw";


export default class InteractiveMap extends Component {

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


        const adminMap = new mapboxgl.Map({
            container: 'map',
            style: import.meta.env.VITE_MAP_STYLE,
            center: [49.106414, 55.796127],
            zoom: 10,
        });


        const Draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                point: true,
                line_string: true,
                trash: true
            }
        });

        adminMap.addControl(Draw);

        // const geolocate = new mapboxgl.GeolocateControl({
        //     positionOptions: {
        //         enableHighAccuracy: true
        //     },
        //     trackUserLocation: true,
        //     showUserHeading: true
        // });

        // adminMap.addControl(geolocate);

        // adminMap.on('load', () => {
        //
        //     geolocate.trigger();
        // });


        const saveData = () => {
            const data = Draw.getAll();
            console.log(data)
            localStorage.setItem('mapData', JSON.stringify(data));

        };


        adminMap.on('draw.create', saveData);
        adminMap.on('draw.update', saveData);
        adminMap.on('draw.delete', saveData);
    }

    render() {
        return (
            <div className="map--container">
                <div id="map" ref={this.divRef}></div>
            </div>
        );
    }
}
