import {useState} from "react";

import './JoinGame.css';

function JoinGame({votes, onJoin}) {
    const [playerName, setPlayerName] = useState("");
    const [isNameTaken, setNameTaken] = useState(false);

    function handleChange(e) {
        const name = e.target.value;
        setPlayerName(name);
        setNameTaken(votes.map((vote) => vote.playerName).includes(name));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (playerName) {
            onJoin(playerName);
        }
    }

    return (
        <div className="join-game">
            <h1 className="h1">Enter Game</h1>
            <form onSubmit={handleSubmit}>
                <label className="custom-field">
                    <input type="text" value={playerName} onChange={handleChange}/>
                    <span className="placeholder">Display name *</span>
                </label>
                <button className="button join" type="submit" disabled={isNameTaken || !playerName}>Join</button>
                {isNameTaken && <span>The name is taken</span>}
            </form>
            <h3 className="h3">Players in this game</h3>
            <ul className="players">
                {votes.map((vote) => (
                    <li className="player" key={`player-${vote.playerId}`}>{vote.playerName}</li>
                ))}
            </ul>
        </div>
    );
}

export default JoinGame;
