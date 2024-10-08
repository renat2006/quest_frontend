import {useState, Suspense, lazy} from 'react';
import {BrowserRouter, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {NextUIProvider} from "@nextui-org/react";

import QuestInfo from "./pages/QuestInfo/QuestInfo.jsx";
import Header from "./componets/Header/Header.jsx";
import AppBar from "./componets/AppBar/AppBar.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import AuthProvider, {useAuth} from "./providers/AuthProvider.jsx";

import Admin from "./pages/Admin/Admin.jsx";
import RouteAdmin from "./pages/RouteAdmin/RouteAdmin.jsx";
import routes from "./routes/routes.js";

import {Toaster} from "react-hot-toast";
import NotFound from "./pages/NotFound/NotFound.jsx";
import ProtectedRoute from "./componets/ProtectedRoute/ProtectedRoute.jsx";
import LocationAdmin from "./pages/LocationAdmin/LocationAdmin.jsx";


const UserMap = lazy(() => import("./pages/InteractiveMap/UserMap.jsx"));
const InteractiveMap = lazy(() => import("./pages/InteractiveMap/InteractiveMap.jsx"));

function App() {
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const appBarPathList = ["/", routes.profile.url, routes.map.url, routes.admin.root.url]
    return (
        <NextUIProvider navigate={navigate}>
            <AuthProvider>

                <div><Toaster/></div>
                <Header/>
                <Routes>
                    <Route path={routes.home.url} element={<QuestInfo/>}/>
                    <Route path={routes.admin.routeAdmin.url + "/*"} element={
                        <Suspense fallback={<div>Загрузка...</div>}>
                            <RouteAdmin/>
                        </Suspense>
                    }/>
                    <Route path={routes.admin.locationAdmin.url + "/*"} element={
                        <Suspense fallback={<div>Загрузка...</div>}>
                            <LocationAdmin/>
                        </Suspense>
                    }/>
                    <Route path={routes.profile.url} element={<Profile/>}/>

                    <Route path={routes.map.url} element={
                        <Suspense fallback={<div>Загрузка...</div>}>
                            <UserMap/>
                        </Suspense>
                    }/>
                    <Route path={routes.admin.root.url} element={
                        <ProtectedRoute>
                            <Suspense fallback={<div>Загрузка...</div>}>
                                <Admin/>
                            </Suspense>
                        </ProtectedRoute>
                    }/>

                    <Route path="*" element={<NotFound/>}/>
                </Routes>
                {appBarPathList.includes(pathname) && <AppBar/>}

            </AuthProvider>
        </NextUIProvider>
    );
}

export default App;
