// LocationAdmin.js

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import routes from "../../routes/routes.js";
import { Button, Card, CardBody, CardHeader, Divider, Image, Skeleton } from "@nextui-org/react";


import {downloadBlob, getLastPathPart} from "../../methods/methods.js";

import { fetchLocationForEditing } from "../../api/api";
import JSZip from 'jszip';
import { useAuth } from "../../providers/AuthProvider.jsx";
import { LocationProvider, useLocationData } from "../../providers/LocationProvider.jsx";

import {LocationMedia} from "../../forms/LocationMedia.jsx";
import LocationInfo from "../../forms/LocationInfo.jsx";
import LocationBreadCrumbs from "../../componets/LocationBreadCrumbs/LocationBreadCrumbs.jsx";


const LocationAdmin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const { locationData, setLocationData } = useLocationData();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadLocationData = async (locationId) => {
            try {
                const zipBlob = await fetchLocationForEditing(locationId, accessToken);
                const zip = await JSZip.loadAsync(zipBlob);

                const file = zip.file(`${locationId}/data.json`);
                if (file) {
                    const content = await file.async('string');
                    const parsedLocationData = JSON.parse(content);

                    let imageFile = null;
                    zip.forEach((relativePath, zipEntry) => {
                        if (relativePath.startsWith(`${locationId}/promo_draft`) && /\.(webp|jpg|png|gif|jpeg)$/i.test(relativePath)) {
                            imageFile = zipEntry;
                        }
                    });
                    console.log(parsedLocationData)
                    const updatedLocationData = {
                        locationId,
                        locationName: parsedLocationData.title_draft || parsedLocationData.title,
                        locationLanguage: parsedLocationData.lang_draft || parsedLocationData.lang,
                        locationDescription: parsedLocationData.description_draft[0] || parsedLocationData.description,
                        locationCoordinates:parsedLocationData.coords_draft
                    };

                    if (imageFile) {
                        const imageBlob = await imageFile.async('blob');
                        const imageFileName = imageFile.name.split('/').pop();
                        const imageFileObj = new File([imageBlob], imageFileName, { type: imageBlob.type });
                        updatedLocationData.promoImage = imageFileObj;
                    }

                    console.log("Updated Location Data:", updatedLocationData);
                    setLocationData(updatedLocationData);
                }
            } catch (error) {
                console.error("Error loading location data:", error);
            } finally {
                setIsLoaded(true);
            }
        };

        const locationId = location.state || locationData.locationId;
        if (locationId) {
            console.log("ddfdfl", locationId)
            loadLocationData(locationId);
        } else {
            navigate(routes.admin.root.url);
        }
    }, [accessToken, location.state, locationData.locationId, setLocationData, navigate]);

    return (
        <div className="flex flex-col items-center p-5 w-full">
            <Card className="w-full max-w-[1000px] h-auto">
                <CardHeader className="flex gap-3 justify-between">
                    <Skeleton isLoaded={isLoaded} className="flex">
                        <LocationBreadCrumbs />
                    </Skeleton>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Skeleton isLoaded={isLoaded} className="w-full h-full">
                        {isLoaded ? (
                            <Routes>
                                <Route path={getLastPathPart(routes.admin.locationAdminMedia.url)} element={<LocationMedia />} />
                                <Route path={getLastPathPart(routes.admin.locationAdminInfo.url)} element={<LocationInfo />} />

                            </Routes>
                        ) : (
                            <Image
                                width={300}
                                height={400}
                                src="https://via.placeholder.com/300x400"
                                alt="Img"
                            />
                        )}
                    </Skeleton>
                </CardBody>
            </Card>
        </div>
    );
};

const WrappedLocationAdmin = () => (
    <LocationProvider>
        <LocationAdmin />
    </LocationProvider>
);

export default WrappedLocationAdmin;
