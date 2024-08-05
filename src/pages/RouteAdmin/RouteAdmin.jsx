import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import routes from "../../routes/routes.js";
import { Button, Card, CardBody, CardHeader, Divider, Image, Skeleton, Spacer } from "@nextui-org/react";
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
            try {
                const zipBlob = await fetchQuestForEditing(questId, accessToken);
                const zip = await JSZip.loadAsync(zipBlob);
                const file = zip.file(`${questId}/data.json`);
                if (file) {
                    const content = await file.async('string');
                    const parsedQuestData = JSON.parse(content);

                    let audioFile = null;
                    let imageFile = null;
                    zip.forEach((relativePath, zipEntry) => {
                        if (relativePath.startsWith(`${questId}/audio_draft`) && /\.(mp3|wav|ogg|m4a|aac)$/i.test(relativePath)) {
                            audioFile = zipEntry;
                        }
                        if (relativePath.startsWith(`${questId}/promo_draft`) && /\.(webp|jpg|png|gif|jpeg)$/i.test(relativePath)) {
                            imageFile = zipEntry;
                        }
                    });

                    const updatedQuestData = {
                        questId,
                        routeName: parsedQuestData.title_draft,
                        routeLanguage: parsedQuestData.lang_draft,
                        routeType: parsedQuestData.type_draft,
                        routeDescription: parsedQuestData.description_draft,
                    };

                    if (audioFile) {
                        const audioBlob = await audioFile.async('blob');
                        const audioFileName = audioFile.name.split('/').pop();
                        updatedQuestData.routeAudioTeaser = new File([audioBlob], audioFileName, { type: audioBlob.type });
                    }

                    if (imageFile) {
                        const imageBlob = await imageFile.async('blob');
                        const imageFileName = imageFile.name.split('/').pop();
                        const imageFileObj = new File([imageBlob], imageFileName, { type: imageBlob.type });
                        updatedQuestData.promoImage = imageFileObj;
                    }

                    console.log("Updated Quest Data:", updatedQuestData);
                    setQuestData(updatedQuestData);
                }
            } catch (error) {
                console.error("Error loading quest data:", error);
            } finally {
                setIsLoaded(true);
            }
        };

        const questId = location.state || questData.questId;
        if (questId) {
            loadQuestData(questId);
        } else {
            navigate(routes.admin.root.url);
        }
    }, [accessToken, location.state, questData.questId, setQuestData, navigate]);

    return (
        <div className="flex flex-col items-center p-5 w-full">
            <Card className="w-full max-w-[1000px] h-auto">
                <CardHeader className="flex gap-3 justify-between">
                    <Skeleton isLoaded={isLoaded} className="flex">
                        <AdminBreadCrumbs />
                    </Skeleton>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Skeleton isLoaded={isLoaded} className="w-full h-full">
                        {isLoaded ? (
                            <Routes>
                                <Route path={getLastPathPart(routes.admin.routeAdminMedia.url)}
                                       element={<RouteMedia />} />
                                <Route path={getLastPathPart(routes.admin.routeAdminInfo.url)} element={<RouteInfo />} />
                                <Route path={getLastPathPart(routes.admin.routeAdminMap.url)} element={
                                    <Suspense fallback={<div>Загрузка...</div>}>
                                        <InteractiveMap />
                                    </Suspense>
                                } />
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

const WrappedRouteAdmin = () => (
    <QuestProvider>
        <RouteAdmin />
    </QuestProvider>
);

export default WrappedRouteAdmin;
