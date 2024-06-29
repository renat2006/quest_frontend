import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMap, faUser, faTools } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";

export default function AppBar() {
    const { pathname } = useLocation();
    const [selectedKey, setSelectedKey] = useState(pathname);
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedKey(pathname);
    }, [pathname]);

    const homeIcon = <FontAwesomeIcon style={{ width: "24px", height: "24px" }} icon={faHouse} />;
    const mapIcon = <FontAwesomeIcon style={{ width: "24px", height: "24px" }} icon={faMap} />;
    const userIcon = <FontAwesomeIcon style={{ width: "24px", height: "24px" }} icon={faUser} />;
    const adminIcon = <FontAwesomeIcon style={{ width: "24px", height: "24px" }} icon={faTools} />;

    const tabItems = [
        { t_id: "/", img_src: homeIcon, title: "Главная", key: "/" },
        { t_id: "/map", img_src: mapIcon, title: "Маршрут", key: "/map" },
        { t_id: "/profile", img_src: userIcon, title: "Профиль", key: "/profile" },
        { t_id: "/admin", img_src: adminIcon, title: "Админ", key: "/admin" },
    ];

    const handleTabChange = (key) => {
        setSelectedKey(key);
        navigate(key);
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
            onClick={() => handleTabChange(tabItem.key)}
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
