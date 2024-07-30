import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {Suspense, useEffect, useState} from "react";
import routes from "../../routes/routes.js";
import {Card, CardBody, CardHeader, Divider, Skeleton} from "@nextui-org/react";
import AdminBreadCrumbs from "../../componets/AdminBreadCrumbs/AdminBreadCrumbs.jsx";
import RouteInfo from "../../forms/RouteInfo.jsx";
import {RouteMedia} from "../../forms/RouteMedia.jsx";
import {getLastPathPart} from "../../methods/methods.js";
import {useRoute} from "../../providers/RouteProvider.jsx";
import InteractiveMap from "../InteractiveMap/InteractiveMap.jsx";
import {fetchQuestForEditing} from "../../api/api";
import JSZip from 'jszip';
import {useAuth} from "../../providers/AuthProvider.jsx";

const RouteAdmin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {routeState, setRouteState} = useRoute();
    const [isLoaded, setIsLoaded] = useState(false);
    const [routeAudioTeaser, setRouteAudioTeaser] = useState(null);
    const [questId, setQuestId] = useState(null);
    const {accessToken} = useAuth();

    useEffect(() => {
        const loadQuestData = async (questId) => {
            try {
                const zipBlob = await fetchQuestForEditing(questId, accessToken);
                const zip = await JSZip.loadAsync(zipBlob);
                const file = zip.file(`${questId}/data.json`);
                if (file) {
                    const content = await file.async('string');
                    const questData = JSON.parse(content);
                    console.log(questData);

                    // Загрузка аудиофайла
                    const audioFile = zip.file(`${questId}/audio_draft.mp3`);
                    if (audioFile) {
                        const audioBlob = await audioFile.async('blob');
                        const audioUrl = URL.createObjectURL(audioBlob);
                        setRouteAudioTeaser(new File([audioBlob], "audio_draft.mp3", {type: "audio/mpeg"}));
                    }

                    setRouteState({
                        routeName: questData.title_draft,
                        routeLanguage: questData.lang_draft,
                        routeType: questData.type_draft,
                        routeDescription: questData.description_draft,
                    });
                }
            } catch (error) {
                console.error("Error loading quest data:", error);
            }
            setIsLoaded(true);
        };

        if (location.state) {
            const questId = location.state;
            setQuestId(questId)
            console.log(questId);
            loadQuestData(questId);
        } else if (!routeState.routeName) {
            navigate(routes.admin.root.url);
        } else {
            setIsLoaded(true);
        }
    }, [location]);

    const {routeName, routeType, routeLanguage, routeDescription} = routeState;

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
                <CardHeader className="flex gap-3">
                    <AdminBreadCrumbs/>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <Skeleton isLoaded={isLoaded} className="w-full">
                        <Routes>
                            <Route path={getLastPathPart(routes.admin.routeAdminMedia.url)} element={<RouteMedia/>}/>
                            <Route path={getLastPathPart(routes.admin.routeAdminInfo.url)}
                                   element={<RouteInfo {...routeInfoProps} />}/>
                            <Route path={getLastPathPart(routes.admin.routeAdminMap.url)} element={<Suspense
                                fallback={<div>Загрузка...</div>}>
                                <InteractiveMap/>
                            </Suspense>}/>
                        </Routes>
                    </Skeleton>
                </CardBody>
            </Card>
        </div>
    );
}

export default RouteAdmin;
