function chekResponse(response) {
    if (!response.ok) {
        throw new Error(response.status)
    }
}

const api = {
    createRoom: async (playerName) => {
        const response = await fetch('/api/room', {
            method: 'POST',
            body: playerName,
        });
        chekResponse(response);
        return await response.json();
    },
    getVotes: async (roomId) => {
        const response = await fetch('/api/room/' + roomId, {
            method: 'GET',
        });
        chekResponse(response);
        return await response.json();
    },
    addPlayerToRoom: async (roomId, playerName) => {
        const response = await fetch('/api/room/' + roomId + '/player', {
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
    clearVotes: async (roomId) => {
        const response = await fetch('/api/room/' + roomId + '/clear', {
            method: 'POST'
        });
        chekResponse(response);
        return await response.json();
    },
    showVotes: async (roomId) => {
        const response = await fetch('/api/room/' + roomId + '/show', {
            method: 'POST'
        });
        chekResponse(response);
        return await response.json();
    }
};

export default api;
