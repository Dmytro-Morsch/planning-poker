import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../api.js";
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const [playerName, setPlayerName] = useState();
    const [gameId, setGameId] = useState();
    const [loading, setLoading] = useState(false);

    function handleStartGame (event) {
        event.preventDefault();
        setLoading(true)
        if (playerName) {
            api.createGame(playerName).then(response => {
                setLoading(false)
                const player = {playerId: response.playerId, playerName: playerName};
                localStorage.setItem("player", JSON.stringify(player));
                localStorage.setItem("gameId", response.gameId);
                navigate(`/game/${response.gameId}`);
            });
        }
    }

    function handleJoinGame (event){
        event.preventDefault();
        if (gameId) {
            navigate(`/game/${gameId}`);
        }
    }

    return (
        <div>
            <h1 className="h1">Welcome</h1>

            <div className="home-block-container">
                <div className="home-block">
                    <h3 className="h3">Start new game</h3>
                    <form onSubmit={handleStartGame}>
                        <input type="text" placeholder="Your name" onChange={e => setPlayerName(e.target.value)}/>
                        <button type="submit" disabled={!playerName || loading}>Start</button>
                    </form>
                </div>
                <div className="home-block">
                    <h3 className="h3">Join existing game</h3>
                    <form onSubmit={handleJoinGame}>
                        <input type="text" placeholder="Game ID" onChange={e => setGameId(e.target.value)}/>
                        <button type="submit" disabled={!gameId || loading}>Join</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Home;
