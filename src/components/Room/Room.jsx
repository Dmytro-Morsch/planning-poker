import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useGame} from "../../context/Game.context.jsx";

import {Cards, JoinGamePopup} from "../";
import api from "../../api.js";

function Room() {
    const [votes, setVotes] = useState([]);
    const [userExist, setUserExist] = useState(false);
    const {player, setPlayer} = useGame();

    const params = useParams();

    const loadVotes = useCallback(async (roomId) => {
        api.getVotes(roomId).then(setVotes);
    }, [setVotes]);

    const vote = useCallback((playerId, vote) => {
        api.vote(playerId, vote).then(setVotes);
    }, [setVotes]);

    const clearVotes = useCallback((roomId) => {
        api.clearVotes(roomId).then(setVotes);
    }, [setVotes]);

    const showVotes = useCallback((roomId) => {
        api.showVotes(roomId).then(setVotes);
    }, [setVotes]);

    const deletePlayer = useCallback((playerId) => {
        api.deletePlayer(playerId).then(setVotes);
    }, [setVotes]);

    function handleJoinGame(playerName) {
        api.addPlayerToRoom(params.roomId, playerName).then(result => {
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
        const roomId = localStorage.getItem("roomId");
        if (roomId !== params.roomId || !player) {
            localStorage.removeItem("player");
            setUserExist(false);
        } else {
            setUserExist(true);
        }
        localStorage.setItem("roomId", params.roomId);
    }, [params.roomId]);

    useEffect(() => {
        loadVotes(params.roomId);
        const interval = setInterval(() => {
            loadVotes(params.roomId);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {userExist && <Cards onCardSelected={(value) => vote(player.playerId, value)}/>}

            <div>
                {userExist && (
                    <div>
                        <button onClick={() => clearVotes(params.roomId)}>Clear</button>
                        <button onClick={() => showVotes(params.roomId)}>Show</button>
                    </div>
                )}
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Story Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {votes.map((vote) => (
                        <tr key={`vote-${vote.playerId}`}>
                            <td>{vote.playerName}</td>
                            <td>{vote.value}</td>
                            <td>
                                {userExist && (
                                    <button onClick={() => handleDeletePlayer(vote.playerId)}>delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {!userExist && <JoinGamePopup onJoin={handleJoinGame}/>}
        </>
    );
}

export default Room;
