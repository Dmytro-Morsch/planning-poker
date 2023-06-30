import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../../api.js";

function Room() {
    const [bets, setBets] = useState({});

    const params = useParams();

    useEffect(() => {
        api.getBets(params.roomId).then(result => {
            setBets(result);
        });
    }, [params.roomId]);

    return (
        <>
            <h1>Welcome to Room {params.roomId}</h1>

            <table>
                {Object.entries(bets).map(([key, value]) => (
                    <tr key={`bets-${key}`}>
                        <td>{key}</td>
                        <td>{value}</td>
                    </tr>
                ))}
            </table>
        </>
    );
}

export default Room;
