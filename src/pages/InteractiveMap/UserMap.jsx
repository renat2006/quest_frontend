import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import { fetchQuestLocations } from "../../api/api.js";
import { useAuth } from "../../providers/AuthProvider.jsx";
import JSZip from "jszip";
import QuestInfoModal from "../../componets/PlaceInfoModal/PlaceInfoModal.jsx";
import Preload from "../../componets/Preloader/Preloader.jsx";
import {downloadBlob} from "../../methods/methods.js";


const UserMap = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const initialPositionSet = useRef(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(12);
    const { accessToken } = useAuth();
    const location = useLocation();
    const questId = location.state;
    const [points, setPoints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadQuestData = async () => {
            try {
                const zipBlob = await fetchQuestLocations(questId, accessToken, false);


                const zip = await JSZip.loadAsync(zipBlob);
                const locations = [];

                await Promise.all(
                    Object.keys(zip.files).map(async (filePath) => {
                        if (filePath.endsWith('data.json')) {
                            const fileData = await zip.file(filePath).async('string');
                            const locationData = JSON.parse(fileData);

                            const folderPath = filePath.split('/').slice(0, -1).join('/');
                            const promoFilePath = `${folderPath}/promo.webp`;
                            const promoFile = zip.file(promoFilePath);
                            let promoImage = null;

                            if (promoFile) {
                                const promoBlob = await promoFile.async('blob');
                                promoImage = new File([promoBlob], 'promo.webp', { type: 'image/webp' });
                            }

                            const mediaFiles = [];
                            let index = 0;

                            const mediaExtensions = ['png', 'jpg', 'jpeg', 'webp', 'mp4', 'webm', 'ogg'];
                            for (const ext of mediaExtensions) {
                                let mediaFilePath;
                                while ((mediaFilePath = `${folderPath}/media_${index}.${ext}`), zip.file(mediaFilePath)) {
                                    const mediaFileBlob = await zip.file(mediaFilePath).async('blob');
                                    let mediaFileType = '';

                                    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
                                        mediaFileType = 'image/webp';
                                    } else if (['mp4', 'webm', 'ogg'].includes(ext)) {
                                        mediaFileType = 'video/webm';
                                    }

                                    const mediaFile = new File([mediaFileBlob], `media_${index}.${ext}`, { type: mediaFileType });
                                    mediaFiles.push(mediaFile);
                                    index++;
                                }
                            }

                            locations.push({
                                id: locationData.location,
                                name: locationData.title || "Untitled",
                                coordinates: locationData.coords.split(';').map(Number),
                                language: locationData.lang,
                                description: locationData.description || '',
                                promoImage: promoImage || null,
                                mediaFiles: mediaFiles,
                            });
                        }
                    })
                );

                setPoints(locations);
            } catch (error) {
                console.error("Error loading quest locations:", error);
            }
        };

        loadQuestData().then(() => setIsLoading(false));

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        if (!mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: import.meta.env.VITE_MAP_STYLE,
                center: [49.106414, 55.796127],
                zoom: 15,
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
            });

            mapRef.current.on('zoom', () => {
                setZoomLevel(mapRef.current.getZoom());
            });
        }
    }, [accessToken, questId]);

    useEffect(() => {
        if (mapRef.current) {
            points.forEach(location => {
                const markerElement = document.createElement('div');
                markerElement.className = 'custom-marker';

                const markerImage = document.createElement('img');
                markerImage.src = URL.createObjectURL(location.promoImage);
                markerImage.className = 'marker-image';

                const markerPoint = document.createElement('div');
                markerPoint.className = 'marker-point';

                const markerLabel = document.createElement('div');
                markerLabel.className = 'marker-label';
                markerLabel.textContent = location.name;

                markerElement.appendChild(markerImage);
                markerElement.appendChild(markerPoint);
                markerElement.appendChild(markerLabel);

                const marker = new mapboxgl.Marker(markerElement)
                    .setLngLat(location.coordinates)
                    .addTo(mapRef.current);

                markerElement.addEventListener('click', () => {
                    setSelectedPoint(location);
                    onOpen();
                });

                markerElement.dataset.id = location.id;
            });

            if (points.length > 1) {
                const coordinates = points.map(point => point.coordinates.join(',')).join(';');

                fetch(`https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.routes && data.routes.length > 0) {
                            const route = data.routes[0].geometry;

                            mapRef.current.addLayer({
                                id: 'route',
                                type: 'line',
                                source: {
                                    type: 'geojson',
                                    data: {
                                        type: 'Feature',
                                        properties: {},
                                        geometry: route
                                    }
                                },
                                layout: {
                                    'line-join': 'round',
                                    'line-cap': 'round'
                                },
                                paint: {
                                    'line-color': '#007aff',
                                    'line-width': 4
                                }
                            });
                        }
                    })
                    .catch(error => console.error('Error fetching directions:', error));
            }
        }
    }, [points]);

    useEffect(() => {
        const updateMarkerStyles = () => {
            const markers = document.querySelectorAll('.custom-marker');
            markers.forEach(marker => {
                const markerImage = marker.querySelector('.marker-image');
                const markerLabel = marker.querySelector('.marker-label');
                const markerPoint = marker.querySelector('.marker-point');

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
        <Preload isLoading={isLoading}>
            <div className="map--container h-[calc(100dvh_-_65px)] w-full">
                <div id="map" ref={mapContainerRef} className="h-full w-full"></div>
                {selectedPoint && (
                    <QuestInfoModal
                        isOpen={isOpen}
                        onOpenChange={handleCloseModal}
                        point={selectedPoint}
                    />
                )}
            </div>
        </Preload>
    );
};

export default React.memo(UserMap);
