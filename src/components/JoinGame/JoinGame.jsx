import {useState} from "react";

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
        <>
            <form onSubmit={handleSubmit}>
                <label>Display name:</label>
                <input type="text" value={playerName} onChange={handleChange}/>
                <button type="submit" disabled={isNameTaken}>Join</button>
                {isNameTaken && <span>The name is taken</span>}
            </form>
            <h3>Players in this game</h3>
            {votes.map((vote) => (
                <div key={`player-${vote.playerId}`}>{vote.playerName}</div>
            ))}
        </>
    );
}

export default JoinGame;
