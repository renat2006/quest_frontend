import React, {useState, useEffect} from "react";
import {Tabs, Tab} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouse, faMap, faUser, faTools, faRoad} from "@fortawesome/free-solid-svg-icons";
import {useLocation, useNavigate} from "react-router-dom";
import routes from "../../routes/routes.js";
import {useAuth} from "../../providers/AuthProvider.jsx";

export default function AppBar() {
    const {pathname} = useLocation();
    const [selectedKey, setSelectedKey] = useState(pathname);
    const navigate = useNavigate();
    const {user} = useAuth();
    useEffect(() => {
        setSelectedKey(pathname);
    }, [pathname]);

    const homeIcon = <FontAwesomeIcon style={{width: "24px", height: "24px"}} icon={faHouse}/>;
    const mapIcon = <FontAwesomeIcon style={{width: "24px", height: "24px"}} icon={faMap}/>;
    const userIcon = <FontAwesomeIcon style={{width: "24px", height: "24px"}} icon={faUser}/>;
    const adminIcon = <FontAwesomeIcon style={{width: "24px", height: "24px"}} icon={faTools}/>;
    const routeAdminIcon = <FontAwesomeIcon style={{width: "24px", height: "24px"}} icon={faRoad}/>;

    const tabItems = [
        {t_id: routes.home.url, img_src: homeIcon, title: "Главная", key: routes.home.url},
        {t_id: routes.map.url, img_src: mapIcon, title: "Маршрут", key: routes.map.url},
        {t_id: routes.profile.url, img_src: userIcon, title: "Профиль", key: routes.profile.url},

    ];
    if (user) {
        tabItems.push({t_id: routes.admin.root.url, img_src: adminIcon, title: "Админ", key: routes.admin.root.url},)
    }

    // if (pathname === routes.admin.routeAdmin) {
    //     tabItems.push({t_id: routes.admin.routeAdmin, img_src: routeAdminIcon, title: "Редактор Маршрута", key: routes.admin.routeAdmin})
    // }

    const handleTabChange = (key) => {
        setSelectedKey(key);
        navigate(key)

    };


    const listTabItems = tabItems.map(tabItem => (
        <Tab
            key={tabItem.t_id}
            id={tabItem.t_id}
            title={
                <div className="flex items-center">
                    {tabItem.img_src}
                </div>
            }

        />
    ));

    return (
        <div className="w-full flex-col app_nav--container z-40">
            <Tabs
                className=" app_nav--tabs"
                selectedKey={selectedKey}
                onSelectionChange={handleTabChange}
                aria-label="Tabs"
                color="primary"
                variant="solid"
            >
                {listTabItems}
            </Tabs>
        </div>
    );
}
