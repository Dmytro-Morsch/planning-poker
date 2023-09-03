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
            <form className="col shadow h-100 p-lg-5 w-50" onSubmit={handleSubmit}>
                <h4 className="pb-3">Join game</h4>
                <div className="input-group">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="name-input"
                               aria-describedby="name-button"
                               placeholder="Your name" onChange={handleChange}/>
                        <label htmlFor="name-input">Your name</label>
                    </div>
                    <button className="btn btn-outline-primary" type="submit" id="name-button"
                            disabled={!playerName.trim()}>Join
                    </button>
                </div>

                <h6 className="mt-5">Other players in this game</h6>
                <ul>
                    {votes.map((vote) => (
                        <li key={`player-${vote.playerId}`}>{vote.playerName}</li>
                    ))}
                </ul>
            </form>
        </>
    );
}

export default JoinGame;
