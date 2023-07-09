import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../api.js";

function Home() {
    const navigate = useNavigate();
    const [playerName, setPlayerName] = useState();
    const [roomId, setRoomId] = useState();
    const [loading, setLoading] = useState(false);

    const onCreateRoom = (event) => {
        event.preventDefault();
        setLoading(true)
        if (playerName) {
            api.createRoom(playerName).then(response => {
                setLoading(false)
                const room = {roomId: response.roomId, playerId: response.playerId, playerName}
                localStorage.setItem(response.roomId, JSON.stringify(room));
                navigate(`/room/${response.roomId}`);
            });
        }
    }

    const onEnterRoom = (event) => {
        event.preventDefault();
        setLoading(true)
        if (roomId) {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Welcome</h1>

            <div style={{display: 'flex'}}>
                <div style={{flex: '50%', height: "100px"}}>
                    <h3>Create new room</h3>
                    <form onSubmit={onCreateRoom}>
                        <input type="text" placeholder="Your name" onChange={e => setPlayerName(e.target.value)}/>
                        <button type="submit" disabled={!playerName || loading}>Create</button>
                    </form>
                </div>
                <div style={{flex: '50%', height: "100px"}}>
                    <h3>Enter existing room</h3>
                    <form onSubmit={onEnterRoom}>
                        <input type="text" placeholder="Room ID" onChange={e => setRoomId(e.target.value)}/>
                        <button type="submit" disabled={!roomId || loading}>Enter</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Home;
