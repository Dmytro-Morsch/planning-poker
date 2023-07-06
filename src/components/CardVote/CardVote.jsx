import './CardVote.css';

function CardVote(props) {
    const {onClick, value} = props;

    return (
        <div className="card">
            <button className="button vote" onClick={() => onClick(value)}>
                <span>{value}</span>
            </button>
        </div>
    );
}

export default CardVote;
