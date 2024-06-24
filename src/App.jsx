import {useState} from 'react'
import Header from "./componets/Header/Header.jsx";
import Quest from "./pages/Quest/Quest.jsx";
import AppBar from "./componets/AppBar/AppBar.jsx";
import Map from "./pages/Map/Map.jsx";
import QuestInfo from "./pages/QuestInfo/QuestInfo.jsx";
import InteractiveMap from "./pages/InteractiveMap/InteractiveMap.jsx";
import UserMap from "./pages/InteractiveMap/UserMap.jsx";


function App() {


    return (
        <div className="App">
            <Header></Header>
            {/*<Quest/>*/}
            {/*<Map/>*/}
            {/*<QuestInfo/>*/}



            {/*<InteractiveMap />*/}
            <UserMap/>
            <AppBar/>
        </div>
    )
}

export default App
