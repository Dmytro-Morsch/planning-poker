import './Card.css';

function Card({value, isSelected, onSelect}) {
    return (
        <div className={"card" + (isSelected ? ' selected' : '')} onClick={() => onSelect(value)}>
            <span>{value}</span>
        </div>
    );
}

export default Card;
