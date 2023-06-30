import {useCallback, useState} from "react";
import api from "../../api.js";
import {useNavigate} from "react-router-dom";

function CreateRoomPopup(props) {
    const {onRoomCreated} = props;

    const [playerName, setPlayerName] = useState();

    const changePlayerName = useCallback(event => setPlayerName(event.target.value), []);

    const navigate = useNavigate();

    const createRoom = useCallback(() => {
        api.createRoom(playerName).then(result => {
            onRoomCreated(result.roomId);
            navigate(`room/${result.roomId}`);
        });

    }, [navigate, onRoomCreated, playerName]);

    return (
        <section className="limit-car-popup">
            <div className="overlay"></div>

            <div className="popup-block">
                <div className="input-block">
                    <input type="text" value={playerName} onChange={changePlayerName}/>
                </div>
                <div className="buttons">
                    <button className="button" type="button" onClick={createRoom}>Submit</button>
                </div>
            </div>
        </section>
    );
}

export default CreateRoomPopup;
