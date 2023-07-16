import {Header} from "../index.js";
import {Outlet} from "react-router-dom";
import {PlayerProvider} from "../../context/Game.context.jsx";

import './MainLayout.css';

function MainLayout() {
    return (
        <div className="main-block">
            <PlayerProvider><Header/></PlayerProvider>
            <div>
                <Outlet/>
            </div>
        </div>
    );
}

export default MainLayout;
