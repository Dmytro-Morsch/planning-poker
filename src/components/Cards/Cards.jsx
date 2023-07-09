import {useCallback} from "react";
import {useUserVote} from "../../context/UserVote.context.jsx";

import {CardVote} from '../'

import './Cards.css';
import {useParams} from "react-router-dom";

function Cards() {
    const {updateBets} = useUserVote();

    const params = useParams();

    const makeVote = useCallback(async (bet) => {
        let playerId = JSON.parse(localStorage.getItem("player" || null)).playerId;
        updateBets(playerId, bet, params.roomId);
    }, [updateBets, params.roomId]);

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
