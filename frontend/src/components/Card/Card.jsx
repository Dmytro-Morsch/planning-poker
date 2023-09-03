import './Card.css';

function Card({value, isSelected, onSelect}) {
    return (
        <div className={"card shadow " + (isSelected ? 'bg-primary' : '')} onClick={() => onSelect(value)}>
            <span>{value}</span>
        </div>
    );
}

export default Card;
