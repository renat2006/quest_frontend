import {useState, Suspense, lazy} from 'react';
import {BrowserRouter, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {NextUIProvider} from "@nextui-org/react";

import QuestInfo from "./pages/QuestInfo/QuestInfo.jsx";
import Header from "./componets/Header/Header.jsx";
import AppBar from "./componets/AppBar/AppBar.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import {Toaster} from "react-hot-toast";
import Admin from "./pages/Admin/Admin.jsx";
import RouteAdmin from "./pages/RouteAdmin/RouteAdmin.jsx";
import routes from "./routes/routes.js";
import {RouteProvider} from "./providers/RouteProvider.jsx";

import NotFound from "./pages/NotFound/NotFound.jsx";



const UserMap = lazy(() => import("./pages/InteractiveMap/UserMap.jsx"));
const InteractiveMap = lazy(() => import("./pages/InteractiveMap/InteractiveMap.jsx"));

function App() {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const appBarPathList = ["/", routes.profile.url, routes.map.url, routes.admin.root.url]
    return (
        <NextUIProvider navigate={navigate}>
            <AuthProvider>
                <RouteProvider>
                    <div><Toaster/></div>
                    <Header/>
                    <Routes>
                        <Route path={routes.home.url} element={<QuestInfo/>}/>
                        <Route path={routes.admin.routeAdmin.url + "/*"} element={<RouteAdmin/>}/>
                        <Route path={routes.profile.url} element={<Profile/>}/>

                        <Route path={routes.map.url} element={
                            <Suspense fallback={<div>Загрузка...</div>}>
                                <UserMap/>
                            </Suspense>
                        }/>
                        <Route path={routes.admin.root.url} element={
                            <Suspense fallback={<div>Загрузка...</div>}>
                                <Admin/>
                            </Suspense>
                        }/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                    {appBarPathList.includes(pathname) && <AppBar/>}
                </RouteProvider>
            </AuthProvider>
        </NextUIProvider>
    );
}

export default App;
