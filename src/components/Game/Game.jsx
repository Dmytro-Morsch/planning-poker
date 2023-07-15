import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useGame} from "../../context/Game.context.jsx";

import {Cards, JoinGame} from "../";
import api from "../../api.js";

import './Game.css';
import VoteTable from "../VoteTable/VoteTable";

function Game() {
    const [votes, setVotes] = useState([]);
    const [selectedCard, setIsSelectedCard] = useState();
    const [userExist, setUserExist] = useState(false);
    const {player, setPlayer} = useGame();

    const params = useParams();

    function loadVotes(gameId) {
        api.getVotes(gameId).then(setVotes);
    }

    function vote(playerId, vote) {
        api.vote(playerId, vote).then(setVotes);
    }

    function clearVotes(gameId) {
        api.clearVotes(gameId).then(setVotes);
    }

    function showVotes(gameId) {
        api.showVotes(gameId).then(setVotes);
    }

    function deletePlayer(playerId) {
        api.deletePlayer(playerId).then(setVotes);
    }

    function handleJoinGame(playerName) {
        api.addPlayerToGame(params.gameId, playerName).then(result => {
            const playerId = result.playerId;
            setVotes(result.votes);
            const player = {playerId, playerName};
            localStorage.setItem("player", JSON.stringify(player));
            setPlayer(player);
            setUserExist(true);
        });
    }

    function handleDeletePlayer(playerId) {
        if (confirm("Sure?")) {
            deletePlayer(playerId);
        }
    }

    useEffect(() => {
        const gameId = localStorage.getItem("gameId");
        if (gameId !== params.gameId || !player) {
            localStorage.removeItem("player");
            setUserExist(false);
        } else {
            setUserExist(true);
        }
        localStorage.setItem("gameId", params.gameId);
    }, [params.gameId]);

    useEffect(() => {
        loadVotes(params.gameId);
        const interval = setInterval(() => {
            loadVotes(params.gameId);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {userExist && (
                <>
                    <Cards selectedCard={selectedCard} onSelect={(value) => {
                        setIsSelectedCard(value);
                        vote(player.playerId, value);
                    }}/>
                    <div className="estimate-block">
                        <div className="buttons">
                            <button className="button clear" onClick={() => clearVotes(params.gameId)}>Clear</button>
                            <button className="button show" onClick={() => showVotes(params.gameId)}>Show</button>
                        </div>
                        <VoteTable votes={votes} onDeletePlayer={handleDeletePlayer}/>
                    </div>
                </>
            )}

            {!userExist && (
                <JoinGame votes={votes} onJoin={handleJoinGame}/>
            )}
        </>
    );
}

export default Game;
