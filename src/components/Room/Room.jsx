import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useUserVote} from "../../context/UserVote.context.jsx";

import {Cards, EnterOneFieldPopup} from "../";
import api from "../../api.js";

function Room() {
    const [userExist, setUserExist] = useState(false);
    const [playerName, setPlayerName] = useState();
    const {bets, loadBets, deleteEstimate} = useUserVote();

    const changePlayerName = useCallback(event => setPlayerName(event.target.value), []);

    const params = useParams();

    const addNewPlayer = useCallback((roomId, playerName) => {
        api.addPlayerToRoom(roomId, playerName).then(result => {
            localStorage.setItem("playerId", result);
            setUserExist(true);
        });
    }, []);

    useEffect(() => {
        const playerId = localStorage.getItem("playerId");
        api.getRoomPlayers(params.roomId).then(result => {
            const found = result.find(element => element == playerId);
            if (found) {
                setUserExist(true);
                console.log("User found");
            } else {
                setUserExist(false);
                console.log("User not found");
            }
        });
    }, [params.roomId]);

    useEffect(() => {
        loadBets(params.roomId);
    }, [loadBets, params.roomId]);

    return (
        <>
            <h1>Room {params.roomId}</h1>

            <Cards/>

            <div>
                <div>
                    <button onClick={() => deleteEstimate(params.roomId)}>Delete Estimate</button>
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
                    <EnterOneFieldPopup inputValue={playerName} onChange={changePlayerName}
                                        onClick={() => addNewPlayer(params.roomId, playerName)}/>
                </div>
            }
        </>
    );
}

export default Room;
