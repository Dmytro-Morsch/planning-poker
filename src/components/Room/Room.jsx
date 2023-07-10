import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useUserVote} from "../../context/UserVote.context.jsx";

import {Cards, JoinGamePopup} from "../";
import api from "../../api.js";

function Room() {
    const [userExist, setUserExist] = useState(false);
    const [player, setPlayer] = useState(JSON.parse(localStorage.getItem("player") || null));
    const {votes, setVotes, loadVotes, clearVotes, showVotes, vote, deletePlayer} = useUserVote();

    const params = useParams();

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
        const player = JSON.parse(localStorage.getItem("player") || null);
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
            <h1>Room {params.roomId} {player?.playerName}</h1>

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
