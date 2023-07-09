import {useCallback} from "react";
import {useUserVote} from "../../context/UserVote.context.jsx";

import {CardVote} from '../'

import './Cards.css';

function Cards() {
    const {updateBets} = useUserVote();

    const makeVote = useCallback(async (bet) => {
        let playerId = JSON.parse(localStorage.getItem("player" || null)).playerId;
        updateBets(playerId, bet);
    }, [updateBets]);

    return (
        <div className="card-block">
            <CardVote onClick={makeVote} value={0}/>
            <CardVote onClick={makeVote} value={1}/>
            <CardVote onClick={makeVote} value={2}/>
            <CardVote onClick={makeVote} value={3}/>
            <CardVote onClick={makeVote} value={5}/>
            <CardVote onClick={makeVote} value={8}/>
            <CardVote onClick={makeVote} value={13}/>
            <CardVote onClick={makeVote} value={20}/>
            <CardVote onClick={makeVote} value={40}/>
            <CardVote onClick={makeVote} value={100}/>
        </div>
    );
}

export default Cards;
