import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import routes from "../../routes/routes.js";
import { Card, CardBody, CardHeader, Divider, Skeleton } from "@nextui-org/react";
import AdminBreadCrumbs from "../../componets/AdminBreadCrumbs/AdminBreadCrumbs.jsx";
import RouteInfo from "../../forms/RouteInfo.jsx";
import { RouteMedia } from "../../forms/RouteMedia.jsx";
import { getLastPathPart } from "../../methods/methods.js";
import InteractiveMap from "../InteractiveMap/InteractiveMap.jsx";
import { fetchQuestForEditing } from "../../api/api";
import JSZip from 'jszip';
import { useAuth } from "../../providers/AuthProvider.jsx";

const RouteAdmin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [routeAudioTeaser, setRouteAudioTeaser] = useState(null);
    const [questId, setQuestId] = useState(null);
    const [routeData, setRouteData] = useState({
        routeName: '',
        routeLanguage: '',
        routeType: '',
        routeDescription: '',
    });
    const { accessToken } = useAuth();

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
                    zip.forEach((relativePath, zipEntry) => {
                        if (relativePath.startsWith(`${questId}/audio_draft`) && /\.(mp3|wav|ogg|m4a)$/i.test(relativePath)) {
                            audioFile = zipEntry;
                        }
                    });

                    if (audioFile) {
                        const audioBlob = await audioFile.async('blob');
                        const audioFileName = audioFile.name.split('/').pop();
                        setRouteAudioTeaser(new File([audioBlob], audioFileName, { type: audioBlob.type }));
                    }

                    setRouteData({
                        routeName: questData.title_draft,
                        routeLanguage: questData.lang_draft,
                        routeType: questData.type_draft,
                        routeDescription: questData.description_draft,
                    });
                }
            } catch (error) {
                console.error("Error loading quest data:", error);
            } finally {
                setIsLoaded(true);
            }
        };

        if (location.state) {
            const questId = location.state;
            setQuestId(questId);
            loadQuestData(questId);
        } else {
            navigate(routes.admin.root.url);
        }
    }, [location.state, accessToken, navigate]);

    const { routeName, routeType, routeLanguage, routeDescription } = routeData;

    const routeInfoProps = {
        questId,
        routeName,
        routeLanguage,
        routeType,
        routeDescription,
        routeAudioTeaser,
        accessToken
    };

    return (
        <div className="flex flex-col items-center p-5 w-full">
            <Card className="w-full max-w-[1000px]">
                <Skeleton isLoaded={isLoaded}>
                    <CardHeader className="flex gap-3">
                        {isLoaded ? <AdminBreadCrumbs /> : <Skeleton className="w-3/5 h-10" />}
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        {isLoaded ? (
                            <Routes>
                                <Route path={getLastPathPart(routes.admin.routeAdminMedia.url)}
                                       element={<RouteMedia />} />
                                <Route path={getLastPathPart(routes.admin.routeAdminInfo.url)}
                                       element={<RouteInfo {...routeInfoProps} />} />
                                <Route path={getLastPathPart(routes.admin.routeAdminMap.url)} element={
                                    <Suspense fallback={<div>Загрузка...</div>}>
                                        <InteractiveMap />
                                    </Suspense>
                                } />
                            </Routes>
                        ) : (
                            <Skeleton className="w-full h-[400px]" />
                        )}
                    </CardBody>
                </Skeleton>
            </Card>
        </div>
    );
}

export default RouteAdmin;
