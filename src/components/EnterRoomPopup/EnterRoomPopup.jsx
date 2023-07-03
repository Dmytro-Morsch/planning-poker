import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../api.js";

function EnterRoomPopup(props) {
    const {onRoomOpened} = props;

    const [roomId, setRoomId] = useState();
    const [playerName, setPlayerName] = useState();

    const changeRoomId = useCallback(event => setRoomId(event.target.value), []);
    const changePlayerName = useCallback(event => setPlayerName(event.target.value), []);

    const navigate = useNavigate();

    const openRoom = useCallback(() => {
        api.addPlayerToRoom(roomId, playerName).then(result => {
            sessionStorage.setItem("playerId", result);
            onRoomOpened(roomId);
            navigate(`room/${roomId}`);
        });
    }, [navigate, onRoomOpened, playerName, roomId]);

    return (
        <>
            <section className="enter-room-popup">
                <div className="overlay"></div>

                <div className="popup-block">
                    <div className="input-block">
                        <label>Room:</label>
                        <input type="text" value={roomId} onChange={changeRoomId}/>

                        <label>Display name:</label>
                        <input type="text" value={playerName} onChange={changePlayerName}/>
                    </div>
                    <div className="buttons">
                        <button className="button" type="button" onClick={openRoom}>Submit</button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default EnterRoomPopup;
