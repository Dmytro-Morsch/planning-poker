import {Header} from "../index.js";
import {Outlet} from "react-router-dom";
import {UserVoteProvider} from "../../context/UserVote.context.jsx";

import './MainLayout.css';

function MainLayout() {
    return (
        <div className="main-block">
            <UserVoteProvider><Header/></UserVoteProvider>
            <div>
                <Outlet/>
            </div>
            <h1>This is footer</h1>
        </div>
    );
}

export default MainLayout;
