import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {Suspense, useEffect, useState} from "react";
import routes from "../../routes/routes.js";
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
} from "@nextui-org/react";
import AdminBreadCrumbs from "../../componets/AdminBreadCrumbs/AdminBreadCrumbs.jsx";
import RouteInfo from "../../forms/RouteInfo.jsx";
import {RouteMedia} from "../../forms/RouteMedia.jsx";
import {getLastPathPart} from "../../methods/methods.js";
import {useRoute} from "../../providers/RouteProvider.jsx";
import InteractiveMap from "../InteractiveMap/InteractiveMap.jsx";
import AdminYandexMap from "../InteractiveMap/AdminYandexMap.jsx";


const RouteAdmin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {routeState, setRouteState} = useRoute();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (location.state) {
            setRouteState(location.state);
            setIsLoaded(true);
        } else if (!location.state && !routeState.routeName) {
            navigate(routes.admin.root.url);
        } else {
            setIsLoaded(true);
        }
    }, [location]);

    const {routeName, routeType, routeLanguage} = routeState;

    const routeInfoProps = {routeName, routeLanguage, routeType};

    if (!isLoaded) {
        return null;
    }

    return (
        <div className="flex flex-col items-center p-5 w-full">
            <Card className="w-full max-w-[1000px]">
                <CardHeader className="flex gap-3">
                    <AdminBreadCrumbs/>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <Routes>
                        <Route path={getLastPathPart(routes.admin.routeAdminMedia.url)} element={<RouteMedia/>}/>
                        <Route path={getLastPathPart(routes.admin.routeAdminInfo.url)}
                               element={<RouteInfo {...routeInfoProps} />}/>
                        <Route path={getLastPathPart(routes.admin.routeAdminMap.url)} element={<Suspense
                            fallback={<div>Загрузка...</div>}>
                            <AdminYandexMap/>
                        </Suspense>} />
                    </Routes>
                </CardBody>
            </Card>
        </div>
    );
}

export default RouteAdmin;
