import {useCallback, useState} from "react";
import api from "../../api.js";

function CreateRoomPopup(props) {
    const {onRoomCreated} = props;

    const [playerName, setPlayerName] = useState();

    const changePlayerName = useCallback(event => setPlayerName(event.target.value), []);

    const submitForm = useCallback((e) => {
        e.preventDefault();
        api.createRoom(playerName).then(result => onRoomCreated(result));
    }, [onRoomCreated, playerName]);

    return (
        <section className="limit-car-popup">
            <div className="overlay"></div>

            <div className="popup-block">
                <div className="input-block">
                    <input type="text" value={playerName} onChange={changePlayerName}/>
                </div>
                <div className="buttons">
                    <button className="button close" type="button" onClick={submitForm}>Submit</button>
                </div>
            </div>
        </section>
    );
}

export default CreateRoomPopup;
