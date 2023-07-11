import './CardVote.css';

function CardVote({value, isSelected, onSelect}) {
    return (
        <div className="card">
            <button className="button vote" onClick={() => onSelect(value)}>
                <span>{value}{isSelected && '*' }</span>
            </button>
        </div>
    );
}

export default CardVote;
