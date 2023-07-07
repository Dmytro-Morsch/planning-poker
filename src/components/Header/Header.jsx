import {NavLink, useParams} from "react-router-dom";
import useComponentVisible from "../../useCompontentVisible.js";

import {ShareLinkPopup} from '../';

import './Header.css';

import share from '../../assets/share.svg'

function Header() {

    const {
        ref: refShareLinkPopup,
        isComponentVisible: isShareLinkPopupVisible,
        setIsComponentVisible: setIsShareLinkPopupVisible
    } = useComponentVisible(false);

    const params = useParams();

    return (
        <nav className="navbar">
            <div className="logo">
                <NavLink className="link" to="/">Planning-poker</NavLink>
            </div>

            {params.roomId &&
                <div className="share-button">
                    <div className="block">
                        <button className="button share" type="button" onClick={() => setIsShareLinkPopupVisible(true)}>
                            Room {params.roomId}
                            <img src={share} alt=""/>
                        </button>
                    </div>
                </div>
            }

            <div className="burger">
                <p>Burger</p>
            </div>

            {isShareLinkPopupVisible &&
                <ShareLinkPopup roomId={params.roomId} myref={refShareLinkPopup}
                                closePopup={() => setIsShareLinkPopupVisible(false)}/>}
        </nav>
    );
}

export default Header;
