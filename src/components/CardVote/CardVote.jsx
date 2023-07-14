import './CardVote.css';

function CardVote({value, isSelected, onSelect}) {
    return (
        <div className="card" onClick={() => onSelect(value)}>
            <span className={isSelected ? 'selected' : ''}>{value}</span>
        </div>
    );
}

export default CardVote;
