import {Route, Routes} from "react-router-dom";
import {PlayerProvider} from "./context/Game.context.jsx";

import {Game, Home, MainLayout, PageNotFound} from './components';

import './App.css';
import './reset.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/game/:gameId" element={<PlayerProvider><Game/></PlayerProvider>}/>
            </Route>
            <Route path="*" element={<PageNotFound/>}/>
        </Routes>
    );
}

export default App;
