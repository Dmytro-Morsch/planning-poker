import './CardVote.css';

function CardVote({value, isSelected, onSelect}) {
    return (
        <div className={"card" + (isSelected ? ' selected' : '')} onClick={() => onSelect(value)}>
            <span>{value}</span>
        </div>
    );
}

export default CardVote;
