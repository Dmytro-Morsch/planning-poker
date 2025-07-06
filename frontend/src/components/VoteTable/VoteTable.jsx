function VoteTable({ownerId, votes, onDeletePlayer}) {
    return (
        <table className="table table-striped">
            <thead>
            <tr>
                <th>Name</th>
                <th>Vote</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {votes.map((vote) => (
                <tr key={`vote-${vote.playerId}`}>
                    <td>{vote.playerName} {vote.playerId === ownerId && <small>(owner)</small>}</td>
                    <td>{vote.value}</td>
                    <td className="text-end">
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Delete" onClick={() => onDeletePlayer(vote.playerId)}></button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default VoteTable;