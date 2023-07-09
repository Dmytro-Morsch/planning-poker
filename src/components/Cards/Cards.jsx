import {useCallback} from "react";
import {useUserVote} from "../../context/UserVote.context.jsx";

import {CardVote} from '../'

import './Cards.css';

function Cards() {
    const {vote} = useUserVote();

    const onCardClick = useCallback(async (value) => {
        const playerId = JSON.parse(localStorage.getItem("player" || null)).playerId;
        vote(playerId, value);
    }, [vote]);

    return (
        <div className="card-block">
            <CardVote onClick={onCardClick} value={0}/>
            <CardVote onClick={onCardClick} value={1}/>
            <CardVote onClick={onCardClick} value={2}/>
            <CardVote onClick={onCardClick} value={3}/>
            <CardVote onClick={onCardClick} value={5}/>
            <CardVote onClick={onCardClick} value={8}/>
            <CardVote onClick={onCardClick} value={13}/>
            <CardVote onClick={onCardClick} value={20}/>
            <CardVote onClick={onCardClick} value={40}/>
            <CardVote onClick={onCardClick} value={100}/>
        </div>
    );
}

export default Cards;
