import {useCallback, useState} from "react";

function EnterOneFieldPopup(props) {
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
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            <button type="submit">Enter</button>
        </form>
    );
}

export default EnterOneFieldPopup;
