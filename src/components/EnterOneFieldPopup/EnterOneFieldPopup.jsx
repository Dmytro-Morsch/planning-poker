function EnterOneFieldPopup(props) {
    const {onClick, inputValue, onChange} = props;
    return (
        <>
            <input type="text" value={inputValue} onChange={onChange}/>
            <button onClick={onClick}>Enter</button>
        </>
    );
}

export default EnterOneFieldPopup;
