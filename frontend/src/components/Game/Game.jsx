import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {Deck, JoinGame, ShareButton} from "../";
import api from "../../api.js";

import VoteTable from "../VoteTable/VoteTable";
import useInterval from "../../hooks/useInterval.js";
import useLocalStorage from "../../hooks/useLocalStorage.js";

function Game() {
    const params = useParams();
    const [votes, setVotes] = useState([]);
    const [selectedCard, setSelectedCard] = useState();
    const [error, setError] = useState();
    const [player, setPlayer] = useLocalStorage("player");
    const [gameId, setGameId] = useLocalStorage("gameId");

    function handleError(e) {
        setError(e.message);
    }

    function vote(playerId, vote) {
        api.vote(playerId, vote).then(setVotes).catch(handleError);
    }

    function resetGame() {
        api.resetGame(gameId).then(setVotes).catch(handleError);
    }

    function revealVotes() {
        api.revealVotes(gameId).then(setVotes).catch(handleError);
    }

    function handleJoinGame(playerName) {
        api.addPlayerToGame(gameId, playerName).then(result => {
            const playerId = result.playerId;
            setVotes(result.votes);
            const player = {playerId, playerName};
            setGameId(gameId);
            setPlayer(player);
        }).catch(handleError);
    }

    function handleDeletePlayer(playerId) {
        if (confirm("Sure?")) {
            api.deletePlayer(playerId).then(setVotes).catch(handleError);
        }
    }

    useEffect(() => {
        if (String(gameId) !== params.gameId || !player) {
            setPlayer(null);
            setGameId(parseInt(params.gameId));
        } else {
            api.getVotes(gameId).then(setVotes).catch(handleError);
        }
    }, [gameId, params.gameId, player])

    useInterval(() => {
        if (gameId) {
            api.getVotes(gameId).then(setVotes).catch(handleError);
        }
    }, 2000);

    return (
        <div className="container">
            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <img src="/poker.svg" alt="Logo" width="48" height="48" className="align-middle"/>
                        <span className="h3 ms-2 align-middle">Planning Poker</span>
                    </a>
                    <nav className="navbar-expand">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <ShareButton gameId={gameId}/>
                            </li>
                            {player &&
                                <li className="nav-item">
                                    <span className="nav-link">
                                        {player.playerName}
                                    </span>
                                </li>
                            }
                        </ul>
                    </nav>
                </div>
            </nav>

            {error &&
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            }

            {gameId && player && !error &&
                <>
                    <Deck selectedCard={selectedCard} onSelect={(value) => {
                        if (value === selectedCard) value = null;
                        setSelectedCard(value);
                        vote(player.playerId, value);
                    }}/>
                    <div className="container w-75">
                        <div className="d-flex justify-content-center p-2">
                            <button className="btn btn-outline-primary" onClick={resetGame}>Reset</button>
                            <button className="btn btn-primary ms-2" onClick={revealVotes}>Reveal</button>
                        </div>
                        <VoteTable votes={votes} onDeletePlayer={handleDeletePlayer}/>
                    </div>
                </>
            }

            {gameId && !player && !error && (
                <JoinGame votes={votes} onJoin={handleJoinGame}/>
            )}
        </div>
    );
}

export default Game;
