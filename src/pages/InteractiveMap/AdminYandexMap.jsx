import React from "react";
import {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer, YMapComponentsProvider, YMapDefaultMarker, YMapMarker

} from "ymap3-components";


function AdminYandexMap() {
    return (
        <YMapComponentsProvider apiKey={import.meta.env.VITE_YANDEX_MAP_API_KEY}>
            <YMap location={{center: [25.229762, 55.289311], zoom: 9}} mode="vector">
                <YMapDefaultSchemeLayer/>
                <YMapDefaultFeaturesLayer/>

                <YMapMarker coordinates={[25.229762, 55.289311]} draggable={true}>
                    <section>
                        <h1>You can drag this header</h1>
                    </section>
                </YMapMarker>
            </YMap>
        </YMapComponentsProvider>
    );
}

export default AdminYandexMap;