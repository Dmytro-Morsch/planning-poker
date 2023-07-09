import './CardVote.css';

function CardVote({onClick, value, selected}) {
    return (
        <div className="card">
            <button className="button vote" onClick={() => onClick(value)}>
                <span>{value}{selected && '*' }</span>
            </button>
        </div>
    );
}

export default CardVote;
