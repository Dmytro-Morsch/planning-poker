import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useUserVote} from "../../context/UserVote.context.jsx";

import {Cards, EnterOneFieldPopup} from "../";
import api from "../../api.js";

function Room() {
    const [userExist, setUserExist] = useState(false);
    const [player, setPlayer] = useState(JSON.parse(localStorage.getItem("player") || null));
    const {bets, setBets, loadBets, deleteEstimate, showEstimate} = useUserVote();

    const params = useParams();

    const addNewPlayer = useCallback((roomId, playerName) => {
        api.addPlayerToRoom(roomId, playerName).then(result => {
            const playerId = result.playerId;
            setBets(result.bets);
            const player = {playerId: playerId, playerName: playerName};
            localStorage.setItem("player", JSON.stringify(player));
            setPlayer(player);
            setUserExist(true);
        });
    }, [setBets]);

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
        loadBets(params.roomId);
    }, [loadBets, params.roomId]);

    return (
        <>
            <h1>Room {params.roomId} {player?.playerName}</h1>

            <Cards/>

            <div>
                <div>
                    <button onClick={() => deleteEstimate(params.roomId)}>Delete Estimate</button>
                    <button onClick={() => showEstimate(params.roomId)}>Show</button>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Story Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(bets).map(([key, value]) => (
                        <tr key={`bets-${key}`}>
                            <td>{key}</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {!userExist &&
                <div>
                    <label>Display name:</label>
                    <EnterOneFieldPopup onClick={(playerName) => addNewPlayer(params.roomId, playerName)}/>
                </div>
            }
        </>
    );
}

export default Room;
