import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";

import {EnterOneFieldPopup} from "../";
import api from "../../api.js";

function Home() {
    const [roomId, setRoomId] = useState();
    const [playerName, setPlayerName] = useState();
    const [isCreateRoomPopupVisible, setIsCreateRoomPopupVisible] = useState(false);
    const [isEnterRoomPopupVisible, setIsEnterRoomPopupVisible] = useState(false);

    const navigate = useNavigate();

    const changeRoomId = useCallback(event => setRoomId(event.target.value), []);
    const changePlayerName = useCallback(event => setPlayerName(event.target.value), []);

    const enterToRoom = useCallback(() => navigate(`room/${roomId}`), [navigate, roomId]);
    const createRoom = useCallback(() => {
        console.log("Create room")
        api.createRoom(playerName).then(result => {
            console.log(result);
            localStorage.setItem("playerId", result.playerId);
            navigate(`/room/${result.roomId}`);
        });
    }, [navigate, playerName]);

    return (
        <>
            <h1>Welcome</h1>
            <div className="buttons">
                <button onClick={() => setIsCreateRoomPopupVisible(true)}>Create new room</button>
                <button onClick={() => setIsEnterRoomPopupVisible(true)}>Enter room</button>
            </div>

            {isCreateRoomPopupVisible &&
                <div>
                    <label>Display name:</label>
                    <EnterOneFieldPopup inputValue={playerName} onChange={changePlayerName} onClick={createRoom}/>
                </div>
            }

            {isEnterRoomPopupVisible &&
                <div>
                    <label>Room:</label>
                    <EnterOneFieldPopup inputValue={roomId} onChange={changeRoomId} onClick={enterToRoom}/>
                </div>
            }
        </>
    );
}

export default Home;
