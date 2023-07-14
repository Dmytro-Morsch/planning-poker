import {useState} from "react";

function JoinGamePopup({votes, onJoin}) {
    const [playerName, setPlayerName] = useState();
    const [isNameTaken, setNameTaken] = useState();

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
        <form onSubmit={handleSubmit}>
            <label>Display name:</label>
            <input type="text" value={playerName} onChange={handleChange}/>
            <button type="submit" disabled={isNameTaken}>Join</button>
            {isNameTaken && <span>The name is taken</span>}
        </form>
    );
}

export default JoinGamePopup;
