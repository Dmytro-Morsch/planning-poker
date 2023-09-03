import './ShareButton.css';
import {ShareLinkPopup} from "../index.js";


function ShareButton({gameId}) {
    return (
        <>
            <div className="input-group">
                <label className="input-group-text" htmlFor="game-id-input">Game ID #</label>
                <input className="form-control" type="text" readOnly={true} aria-label="Game ID"
                       id="game-id-input" value={gameId}/>
                <button className="btn btn-outline-secondary" type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                         fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16">
                        <path
                            d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
                    </svg>
                </button>
            </div>
            <ShareLinkPopup id="exampleModal" gameId={gameId}/>
        </>
    );
}

export default ShareButton;
