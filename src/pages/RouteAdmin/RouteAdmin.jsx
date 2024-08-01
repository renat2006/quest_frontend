import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import routes from "../../routes/routes.js";
import { Card, CardBody, CardHeader, Divider, Image, Skeleton } from "@nextui-org/react";

import RouteInfo from "../../forms/RouteInfo.jsx";
import { RouteMedia } from "../../forms/RouteMedia.jsx";
import { getLastPathPart } from "../../methods/methods.js";
import InteractiveMap from "../InteractiveMap/InteractiveMap.jsx";
import { fetchQuestForEditing } from "../../api/api";
import JSZip from 'jszip';
import { useAuth } from "../../providers/AuthProvider.jsx";
import { QuestProvider, useQuest } from "../../providers/RouteProvider.jsx";
import AdminBreadCrumbs from "../../componets/AdminBreadCrumbs/AdminBreadCrumbs.jsx";

const RouteAdmin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const { questData, setQuestData } = useQuest();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadQuestData = async (questId) => {
            console.log(questId);
            try {
                const zipBlob = await fetchQuestForEditing(questId, accessToken);
                const zip = await JSZip.loadAsync(zipBlob);
                const file = zip.file(`${questId}/data.json`);
                if (file) {
                    const content = await file.async('string');
                    const questData = JSON.parse(content);
                    console.log(questData);
                    let audioFile = null;
                    let imageFile = null
                    zip.forEach((relativePath, zipEntry) => {
                        if (relativePath.startsWith(`${questId}/audio_draft`) && /\.(mp3|wav|ogg|m4a|aac)$/i.test(relativePath)) {
                            audioFile = zipEntry;
                        }
                        if (relativePath === `${questId}/image_draft.webp`) {
                            imageFile = zipEntry;
                        }
                    });

                    setQuestData({
                        questId,
                        routeName: questData.title_draft,
                        routeLanguage: questData.lang_draft,
                        routeType: questData.type_draft,
                        routeDescription: questData.description_draft,
                    });
                    if (audioFile) {
                        const audioBlob = await audioFile.async('blob');
                        const audioFileName = audioFile.name.split('/').pop();
                        setQuestData(prevState => ({
                            ...prevState,
                            routeAudioTeaser: new File([audioBlob], audioFileName, { type: audioBlob.type })
                        }));
                    }
                    if (imageFile) {
                        const imageBlob = await imageFile.async('blob');
                        const imageFileName = imageFile.name.split('/').pop();
                        setQuestData(prevState => ({
                            ...prevState,
                            promoImage: new File([imageBlob], imageFileName, { type: imageBlob.type })
                        }));
                    }
                }
            } catch (error) {
                console.error("Error loading quest data:", error);
            } finally {
                setIsLoaded(true);
            }
        };

        if (location.state || questData.questId) {
            const questId = location.state || questData.questId;
            loadQuestData(questId);
        } else {
            navigate(routes.admin.root.url);
        }
    }, [location.state, accessToken, navigate, setQuestData]);

    return (
        <div className="flex flex-col items-center p-5 w-full">
            <Card className="w-full max-w-[1000px]">
                <CardHeader className="flex gap-3">
                    <Skeleton isLoaded={isLoaded} className="w-3/5 h-10">
                        <AdminBreadCrumbs />
                    </Skeleton>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Skeleton isLoaded={isLoaded} className="w-full h-[400px]">
                        {isLoaded ? (
                            <Routes>
                                <Route path={getLastPathPart(routes.admin.routeAdminMedia.url)}
                                       element={<RouteMedia />} />
                                <Route path={getLastPathPart(routes.admin.routeAdminInfo.url)}
                                       element={<RouteInfo />} />
                                <Route path={getLastPathPart(routes.admin.routeAdminMap.url)} element={
                                    <Suspense fallback={<div>Загрузка...</div>}>
                                        <InteractiveMap />
                                    </Suspense>
                                } />
                            </Routes>
                        ) : <Image
                            width={300}
                            height={400}
                            src="https://via.placeholder.com/300x400"
                            alt="Img"
                        />}
                    </Skeleton>
                </CardBody>
            </Card>
        </div>
    );
};

const WrappedRouteAdmin = () => (
    <QuestProvider>
        <RouteAdmin />
    </QuestProvider>
);

export default WrappedRouteAdmin;
