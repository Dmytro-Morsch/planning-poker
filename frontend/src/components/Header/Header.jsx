import {NavLink, useParams} from "react-router-dom";
import useComponentVisible from "../../hooks/useCompontentVisible.js";

import {ShareButton, ShareLinkPopup} from '../';

import './Header.css';
import useLocalStorage from "../../hooks/useLocalStorage.js";

function Header() {
    const [player, setPlayer] = useLocalStorage("player");

    const {
        ref: refShareLinkPopup,
        isComponentVisible: isShareLinkPopupVisible,
        setIsComponentVisible: setIsShareLinkPopupVisible
    } = useComponentVisible(false);

    const params = useParams();

    return (
        <nav className="navbar">
            <div className="logo">
                <NavLink className="link" to="/">Planning Poker</NavLink>
            </div>

            {params.gameId &&
                <ShareButton gameId={params.gameId} onClick={() => setIsShareLinkPopupVisible(true)}/>
            }

            {(player && params.gameId) &&
                <span className="user">
                        {player.playerName}
                    </span>
            }

            {isShareLinkPopupVisible &&
                <ShareLinkPopup gameId={params.gameId} myref={refShareLinkPopup}
                                onClose={() => setIsShareLinkPopupVisible(false)}/>}
        </nav>
    );
}

export default Header;
