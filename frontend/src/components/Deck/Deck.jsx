import {Card} from '../'

import './Deck.css';

function Deck({selectedCard, onSelect}) {
    return (
        <div className="card-block">
            {['0', '1', '2', '3', '5', '8', '13', '20', '50', '∞', '?', '☕'].map((value, index) => (
                <Card key={index} value={value} isSelected={value === selectedCard} onSelect={onSelect}/>
            ))}
        </div>
    );
}

export default Deck;
