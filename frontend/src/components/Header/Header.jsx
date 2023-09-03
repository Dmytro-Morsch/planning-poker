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

    const {
        ref: refMenuPopup,
        isComponentVisible: isMenuPopupVisible,
        setIsComponentVisible: setIsMenuPopupVisible
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

            <div className="menu" ref={refMenuPopup}>
                {(player && params.gameId) &&
                    <span className="user">
                        {player.playerName}
                    </span>
                }
                <button className="button dropdown" onClick={() => setIsMenuPopupVisible(!isMenuPopupVisible)}>
                    <span className="nav-line"></span>
                    <span className="nav-line"></span>
                    <span className="nav-line"></span>
                </button>

                {isMenuPopupVisible &&
                    <div className="dropdown-content">
                        <div className="links">
                            <NavLink className="link" to="/about"
                                     onClick={() => setIsMenuPopupVisible(false)}>About</NavLink>
                            {params.gameId &&
                                <>
                                    <NavLink className="link" to="/setting"
                                             onClick={() => setIsMenuPopupVisible(false)}>Settings</NavLink>
                                    <NavLink className="link" to="/"
                                             onClick={() => setIsMenuPopupVisible(false)}>Logout</NavLink>
                                </>
                            }
                        </div>
                    </div>
                }
            </div>

            {isShareLinkPopupVisible &&
                <ShareLinkPopup gameId={params.gameId} myref={refShareLinkPopup}
                                onClose={() => setIsShareLinkPopupVisible(false)}/>}
        </nav>
    );
}

export default Header;
