import React, { useEffect } from 'react';

const MapComponent = () => {
    useEffect(() => {
        // Создаем элемент <script> для загрузки API
        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/v3/?apikey=${import.meta.env.VITE_YANDEX_MAP_API_KEY}Y&lang=ru_RU`;
        script.async = true;
        document.body.appendChild(script);

        // После загрузки скрипта вызываем initMap
        script.onload = () => {
            initMap();
        };

        // Функция инициализации карты
        const initMap = async () => {
            await ymaps3.ready;

            const { YMap, YMapDefaultSchemeLayer } = ymaps3;

            const map = new YMap(
                document.getElementById('map'),
                {
                    location: {
                        center: [37.588144, 55.733842],
                        zoom: 10
                    }
                }
            );

            map.addChild(new YMapDefaultSchemeLayer());
        };

        // Очищаем скрипт при размонтировании компонента
        return () => {
            document.body.removeChild(script);
        };
    }, []); // [] указывает на то, что useEffect выполнится только один раз при монтировании компонента

    return (
        <div id="map" style={{ width: '600px', height: '400px' }}></div>
    );
};

export default MapComponent;