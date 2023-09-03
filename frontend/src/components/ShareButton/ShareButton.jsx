import './ShareButton.css';
import share from '../../assets/share.svg'


function ShareButton({gameId, onClick}) {
    return (
        <div className="share-button">
            <div className="block">
                <button className="button share" type="button" onClick={onClick}>
                    Game #{gameId}
                    <img src={share} alt=""/>
                </button>
            </div>
        </div>
    );
}

export default ShareButton;
