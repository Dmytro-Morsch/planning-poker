import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {EnterOneFieldPopup} from "../";
import api from "../../api.js";

function Room() {
    const [userExist, setUserExist] = useState(false);
    const [playerName, setPlayerName] = useState();
    const [bets, setBets] = useState({});

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
        api.getBets(params.roomId).then(result => {
            setBets(result);
        })
    }, [params.roomId, userExist]);

    return (
        <>
            <h1>Room {params.roomId}</h1>

            <table>
                {Object.entries(bets).map(([key, value]) => (
                    <tr key={`bets-${key}`}>
                        <td>{key}</td>
                        <td>{value}</td>
                    </tr>
                ))}
            </table>

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
