import {Card} from '../'

function Deck({selectedCard, onSelect}) {
    return (
        <div className="d-flex justify-content-around flex-wrap my-5">
            {['0', '1', '2', '3', '5', '8', '13', '20','50', '∞', '?', '☕'].map((value, index) => (
                <Card key={index} value={value} isSelected={value === selectedCard} onSelect={onSelect}/>
            ))}
        </div>
    );
}

export default Deck;
