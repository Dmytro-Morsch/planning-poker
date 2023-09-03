import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../api.js";
import './Home.css';
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
        <div className="container">
            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src="/poker.svg" alt="Logo" width="48" height="48" className="align-middle"/>
                        <span className="h3 ms-2 align-middle">Planning Poker</span>
                    </a>
                </div>
            </nav>

            <div className="text-center">
                <h1 className="display-5 fw-bold p-lg-5">Welcome</h1>

                <div className="row">
                    <form className="col shadow h-100 p-lg-5 m-3" onSubmit={handleStartGame}>
                        <h5 className="pb-3">Start new game</h5>
                        <div className="input-group">
                            <div className="form-floating">
                                <input type="text" className="form-control" id="name-input"
                                       aria-describedby="name-button"
                                       placeholder="Your name" onChange={e => setPlayerName(e.target.value)}/>
                                <label htmlFor="name-input">Your name</label>
                            </div>
                            <button className="btn btn-outline-primary" type="submit" id="name-button"
                                    disabled={!playerName.trim() || loading}>Start
                            </button>
                        </div>
                    </form>

                    <form className="col shadow h-100 p-lg-5 m-3" onSubmit={handleJoinGame}>
                        <h5 className="pb-3">Join existing game</h5>
                        <div className="input-group">
                            <div className="form-floating">
                                <input type="text" className="form-control" id="game-input"
                                       aria-describedby="game-button"
                                       placeholder="Game ID" onChange={e => setGameId(e.target.value)}/>
                                <label htmlFor="game-input">Game ID</label>
                            </div>
                            <button className="btn btn-outline-primary" type="submit" id="game-button"
                                    disabled={!gameId.trim() || loading}>Join
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Home;
