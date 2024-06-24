import { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { NextUIProvider } from "@nextui-org/react";

import QuestInfo from "./pages/QuestInfo/QuestInfo.jsx";
import Header from "./componets/Header/Header.jsx";
import AppBar from "./componets/AppBar/AppBar.jsx";


const UserMap = lazy(() => import("./pages/InteractiveMap/UserMap.jsx"));
const InteractiveMap = lazy(() => import("./pages/InteractiveMap/InteractiveMap.jsx"));

function App() {
    const navigate = useNavigate();

    return (
        <NextUIProvider navigate={navigate}>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<QuestInfo />} />
                    <Route path="/map" element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <UserMap />
                        </Suspense>
                    } />
                    <Route path="/admin" element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <InteractiveMap />
                        </Suspense>
                    } />
                </Routes>
                <AppBar />
            </div>
        </NextUIProvider>
    );
}

export default App;
