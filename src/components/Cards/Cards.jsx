import {useState} from "react";
import {CardVote} from '../'

import './Cards.css';

function Cards({onCardSelected}) {
    const [selectedCard, setSelectedCard] = useState()

    function handleClick(value){
        setSelectedCard(value);
        onCardSelected(value)
    }

    return (
        <div className="card-block">
            {['0', '1', '2', '3', '5', '8', '13', '20', '50', '∞', '?', '☕'].map((value, index) => (
                <CardVote key={index} onClick={handleClick} value={value} selected={value === selectedCard}/>
            ))}
        </div>
    );
}

export default Cards;
