function VoteTable({votes, onDeletePlayer}) {
    return (
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Story Points</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {votes.map((vote) => (
                <tr key={`vote-${vote.playerId}`}>
                    <td>{vote.playerName}</td>
                    <td>{vote.value}</td>
                    <td>
                        <button onClick={() => onDeletePlayer(vote.playerId)}>delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default VoteTable;