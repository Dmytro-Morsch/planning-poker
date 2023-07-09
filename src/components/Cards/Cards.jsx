import {useState} from "react";
import {CardVote} from '../'

import './Cards.css';

function Cards({onCardSelected}) {
    const [selectedCard, setSelectedCard] = useState()

    function onClick(value){
        setSelectedCard(value);
        onCardSelected(value)
    }

    return (
        <div className="card-block">
            {[0, 1, 2, 3, 5, 8, 13, 20, 40, 100].map((value) => (
                <CardVote onClick={onClick} value={value} selected={value === selectedCard}/>
            ))}
        </div>
    );
}

export default Cards;
