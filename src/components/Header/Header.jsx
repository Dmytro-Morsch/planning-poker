import {NavLink, useParams} from "react-router-dom";

import './Header.css';

import share from '../../assets/share.svg'

function Header() {
    const params = useParams();

    return (
        <nav className="navbar">
            <div className="logo">
                <NavLink className="link" to="/">Planning-poker</NavLink>
            </div>

            {params.roomId &&
                <div className="share-link">
                    <div className="block">
                        <button className="button share" type="button" onClick={() => setShareLinkPopupShown(true)}>
                            Room {params.roomId}
                            <img src={share} alt=""/>
                        </button>
                    </div>
                </div>
            }

            <div className="burger">
                <p>Burger</p>
            </div>
        </nav>
    );
}

export default Header;
