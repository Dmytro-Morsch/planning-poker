import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useUserVote} from "../../context/UserVote.context.jsx";

import {Cards, JoinGamePopup} from "../";
import api from "../../api.js";

function Room() {
    const [userExist, setUserExist] = useState(false);
    const [player, setPlayer] = useState(JSON.parse(localStorage.getItem("player") || null));
    const {votes, setVotes, loadVotes, clearVotes, showVotes} = useUserVote();

    const params = useParams();

    const addNewPlayer = useCallback((playerName) => {
        api.addPlayerToRoom(params.roomId, playerName).then(result => {
            const playerId = result.playerId;
            setVotes(result.votes);
            const player = {playerId, playerName};
            localStorage.setItem("player", JSON.stringify(player));
            setPlayer(player);
            setUserExist(true);
        });
    }, [setVotes, params.roomId]);

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
    }, [loadVotes, params.roomId]);

    return (
        <>
            <h1>Room {params.roomId} {player?.playerName}</h1>

            {userExist && <Cards/>}

            <div>
                <div>
                    <button onClick={() => clearVotes(params.roomId)}>Clear</button>
                    <button onClick={() => showVotes(params.roomId)}>Show</button>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Story Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(votes).map(([player, value]) => (
                        <tr key={`vote-${player}`}>
                            <td>{player}</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {!userExist && <JoinGamePopup onClick={addNewPlayer}/>}
        </>
    );
}

export default Room;
