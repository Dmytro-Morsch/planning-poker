import {useState} from "react";

function JoinGamePopup({onJoin}) {
    const [inputValue, setInputValue] = useState();

    function handleSubmit(e) {
        e.preventDefault();
        if (inputValue) {
            onJoin(inputValue);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Display name:</label>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            <button type="submit">Join</button>
        </form>
    );
}

export default JoinGamePopup;
