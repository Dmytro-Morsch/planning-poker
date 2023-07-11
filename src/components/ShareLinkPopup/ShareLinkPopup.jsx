import {useEffect} from "react";

import './ShareLinkPopup.css';

import copy from '../../assets/copy.svg';
import QRCode from "react-qr-code";

function ShareLinkPopup(props) {
    const {gameId, myref, closePopup} = props;

    useEffect(() => {
        document.querySelector('.share-link').classList.add('is-active');
    }, []);

    return (
        <div className="share-link">
            <div className="overlay"></div>

            <div className="popup-block" ref={myref}>
                <h2 className="h2">Game {gameId}</h2>

                <div className="copy-block">
                    <input className="url" value={window.location.href} readOnly="readOnly"/>
                    <button className="button copy" type="button"
                            onClick={() => navigator.clipboard.writeText(window.location.href)}>
                        <img src={copy} alt=""/>
                        Copy URL to clipboard
                    </button>
                </div>

                <QRCode value={window.location.href} />

                <button className="button ok" type="button" onClick={closePopup}>GOT IT!</button>
            </div>
        </div>
    );
}

export default ShareLinkPopup;
