import {CardVote} from '../'

import './Cards.css';

function Cards({selectedCard, onSelect}) {
    return (
        <div className="card-block">
            {['0', '1', '2', '3', '5', '8', '13', '20', '50', '∞', '?', '☕'].map((value, index) => (
                <CardVote key={index} value={value} isSelected={value === selectedCard} onSelect={onSelect}/>
            ))}
        </div>
    );
}

export default Cards;
