import {Route, Routes} from "react-router-dom";
import {PlayerProvider} from "./context/Game.context.jsx";

import {Home, MainLayout, PageNotFound, Room} from './components';

import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/room/:roomId" element={<PlayerProvider><Room/></PlayerProvider>}/>
            </Route>
            <Route path="*" element={<PageNotFound/>}/>
        </Routes>
    );
}

export default App;
