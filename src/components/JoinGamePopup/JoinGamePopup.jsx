import {useCallback, useState} from "react";

function JoinGamePopup(props) {
    const {onClick} = props;

    const [inputValue, setInputValue] = useState();

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        if (inputValue) {
            onClick(inputValue);
        }
    }, [inputValue, onClick]);

    return (
        <form onSubmit={onSubmit}>
            <label>Display name:</label>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            <button type="submit">Join </button>
        </form>
    );
}

export default JoinGamePopup;
