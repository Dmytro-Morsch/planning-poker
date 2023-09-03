import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../api.js";
import './Home.css';
import {Header} from "../index.js";
import useLocalStorage from "../../hooks/useLocalStorage.js";

function Home() {
    const navigate = useNavigate();
    const [playerName, setPlayerName] = useState("");
    const [gameId, setGameId] = useState("");
    const [loading, setLoading] = useState(false);
    const storePlayer = useLocalStorage("player")[1]
    const storeGameId = useLocalStorage("gameId")[1]

    function handleStartGame(event) {
        event.preventDefault();
        setLoading(true)
        if (playerName) {
            api.createGame(playerName).then(response => {
                setLoading(false)
                const player = {playerId: response.playerId, playerName: playerName.trim()};
                storePlayer(player);
                storeGameId(response.gameId);
                navigate(`/game/${response.gameId}`);
            });
        }
    }

    function handleJoinGame(event) {
        event.preventDefault();
        if (gameId) {
            navigate(`/game/${gameId}`);
        }
    }

    return (
        <>
            <Header/>
            <h1 className="h1">Welcome</h1>

            <div className="home-block-container">
                <div className="home-block">
                    <h3 className="h3">Start new game</h3>
                    <form onSubmit={handleStartGame}>
                        <label className="custom-field">
                            <input className={!playerName.trim() ? '' : 'not-empty'} type="text"
                                   onChange={e => setPlayerName(e.target.value)}/>
                            <span className="placeholder">Your name</span>
                        </label>
                        <button className="button start" type="submit" disabled={!playerName.trim() || loading}>Start</button>
                    </form>
                </div>
                <div className="home-block">
                    <h3 className="h3">Join existing game</h3>
                    <form onSubmit={handleJoinGame}>
                        <label className="custom-field">
                            <input className={!gameId.trim() ? '' : 'not-empty'} type="text"
                                   onChange={e => setGameId(e.target.value)}/>
                            <span className="placeholder">Game ID</span>
                        </label>
                        <button className="button join" type="submit" disabled={!gameId.trim() || loading}>Join</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Home;
