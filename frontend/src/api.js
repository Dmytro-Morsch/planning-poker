function checkResponse(response) {
    if (!response.ok) {
        throw new Error(response.statusText || response.status)
    }
}

const api = {
    createGame: async (playerName) => {
        const response = await fetch('/api/game', {
            method: 'POST',
            body: playerName,
        });
        checkResponse(response);
        return await response.json();
    },
    getVotes: async (gameId) => {
        const response = await fetch('/api/game/' + encodeURIComponent(gameId), {
            method: 'GET',
        });
        checkResponse(response);
        return await response.json();
    },
    addPlayerToGame: async (gameId, playerName) => {
        const response = await fetch('/api/game/' + encodeURIComponent(gameId) + '/player', {
            method: 'POST',
            body: playerName,
        });
        checkResponse(response);
        return await response.json();
    },
    deletePlayer: async  (playerId) => {
        const response = await fetch('/api/player/' + encodeURIComponent(playerId) + '/delete', {
            method: 'POST'
        });
        checkResponse(response);
        return await response.json();
    },
    vote: async (playerId, value) => {
        const response = await fetch('/api/player/' + encodeURIComponent(playerId) + '/vote', {
            method: 'POST',
            body: value
        });
        checkResponse(response);
        return await response.json();
    },
    resetGame: async (gameId) => {
        const response = await fetch('/api/game/' + encodeURIComponent(gameId) + '/reset', {
            method: 'POST'
        });
        checkResponse(response);
        return await response.json();
    },
    showVotes: async (gameId) => {
        const response = await fetch('/api/game/' + encodeURIComponent(gameId) + '/show', {
            method: 'POST'
        });
        checkResponse(response);
        return await response.json();
    }
};

export default api;
