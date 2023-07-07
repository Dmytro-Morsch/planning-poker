import {Header} from "../index.js";
import {Outlet} from "react-router-dom";

import './MainLayout.css';

function MainLayout() {
    return (
        <div className="main-block">
            <Header/>
            <div>
                <Outlet/>
            </div>
            <h1>This is footer</h1>
        </div>
    );
}

export default MainLayout;
