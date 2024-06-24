import React from "react";
import {Tabs, Tab} from "@nextui-org/react";


import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {faHouse, faMap, faUser} from "@fortawesome/free-solid-svg-icons";


export default function AppBar() {
    const homeIcon = <FontAwesomeIcon style={{width:"24px", height:"24px"}} icon={faHouse} />
    const mapIcon = <FontAwesomeIcon style={{width:"24px", height:"24px"}} icon={faMap} />
    const userIcon = <FontAwesomeIcon style={{width:"24px", height:"24px"}} icon={faUser} />
    const tabItems = [
        {id: "tab_1", img_src: homeIcon, title: "Главная", key: "photos"},
        {id: "tab_2", img_src: mapIcon, title: "Маршрут", key: "path"},
        {id: "tab_3", img_src: userIcon, title: "Профиль", key: "profile"},

    ]

    const listTabItems = tabItems.map(tabItem => (
        <Tab
            key={tabItem.key}
            title={
                <div className="flex items-center">
                    {tabItem.img_src}
                    {/*<span>{tabItem.title}</span>*/}
                </div>
            }
        />));
    return (
        <div className="w-full flex-col app_nav--container ">
            <Tabs className="sm:hidden" aria-label="Options" color="primary" variant="bordered">
                {listTabItems}
            </Tabs>
        </div>
    );
}
