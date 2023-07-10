import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../api.js";

function Home() {
    const navigate = useNavigate();
    const [playerName, setPlayerName] = useState();
    const [roomId, setRoomId] = useState();
    const [loading, setLoading] = useState(false);

    const handleCreateRoom = useCallback((event) => {
        event.preventDefault();
        setLoading(true)
        if (playerName) {
            api.createRoom(playerName).then(response => {
                setLoading(false)
                const player = {playerId: response.playerId, playerName: playerName};
                localStorage.setItem("player", JSON.stringify(player));
                localStorage.setItem("roomId", response.roomId);
                navigate(`/room/${response.roomId}`);
            });
        }
    }, [navigate, playerName]);

    const handleEnterRoom = useCallback((event) => {
        event.preventDefault();
        if (roomId) {
            navigate(`/room/${roomId}`);
        }
    }, [navigate, roomId]);

    return (
        <div>
            <h1>Welcome</h1>

            <div style={{display: 'flex'}}>
                <div style={{flex: '50%', height: "100px"}}>
                    <h3>Create new room</h3>
                    <form onSubmit={handleCreateRoom}>
                        <input type="text" placeholder="Your name" onChange={e => setPlayerName(e.target.value)}/>
                        <button type="submit" disabled={!playerName || loading}>Create</button>
                    </form>
                </div>
                <div style={{flex: '50%', height: "100px"}}>
                    <h3>Enter existing room</h3>
                    <form onSubmit={handleEnterRoom}>
                        <input type="text" placeholder="Room ID" onChange={e => setRoomId(e.target.value)}/>
                        <button type="submit" disabled={!roomId || loading}>Enter</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Home;
