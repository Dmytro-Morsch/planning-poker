import {useEffect} from "react";
import QRCode from "react-qr-code";

import './ShareLinkPopup.css';

import copy from '../../assets/copy.svg';

function ShareLinkPopup({gameId, myref, onClose}) {

    useEffect(() => {
        document.querySelector('.share-link').classList.add('is-active');
    }, []);

    return (
        <div className="share-link">
            <div className="overlay"></div>

            <div className="popup-block" ref={myref}>
                <span className="title">How can people join the game?</span>
                <h2 className="h2">Game {gameId}</h2>

                <div className="copy-block">
                    <input className="url" value={window.location.href} readOnly="readOnly"/>
                    <button className="button copy" type="button"
                            onClick={() => navigator.clipboard.writeText(window.location.href)}>
                        <img src={copy} alt=""/>
                        Copy URL to clipboard
                    </button>
                </div>

                <span className="scan">Scan the QR code</span>
                <div className="qr-code">
                    <QRCode value={window.location.href}/>
                </div>

                <button className="button ok" type="button" onClick={onClose}>GOT IT!</button>
            </div>
        </div>
    );
}

export default ShareLinkPopup;
