function chekResponse(response) {
    if (!response.ok) {
        throw new Error(response.status)
    }
}

const api = {
    createGame: async (playerName) => {
        const response = await fetch('/api/game', {
            method: 'POST',
            body: playerName,
        });
        chekResponse(response);
        return await response.json();
    },
    getVotes: async (gameId) => {
        const response = await fetch('/api/game/' + gameId, {
            method: 'GET',
        });
        chekResponse(response);
        return await response.json();
    },
    addPlayerToGame: async (gameId, playerName) => {
        const response = await fetch('/api/game/' + gameId + '/player', {
            method: 'POST',
            body: playerName,
        });
        chekResponse(response);
        return await response.json();
    },
    deletePlayer: async  (playerId) => {
        const response = await fetch('/api/player/' + playerId + '/delete', {
            method: 'POST'
        });
        chekResponse(response);
        return await response.json();
    },
    vote: async (playerId, value) => {
        const response = await fetch('/api/player/' + playerId + '/vote', {
            method: 'POST',
            body: value
        });
        chekResponse(response);
        return await response.json();
    },
    clearVotes: async (gameId) => {
        const response = await fetch('/api/game/' + gameId + '/clear', {
            method: 'POST'
        });
        chekResponse(response);
        return await response.json();
    },
    showVotes: async (gameId) => {
        const response = await fetch('/api/game/' + gameId + '/show', {
            method: 'POST'
        });
        chekResponse(response);
        return await response.json();
    }
};

export default api;
