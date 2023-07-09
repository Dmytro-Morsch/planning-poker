const api = {
    createRoom: async (playerName) => {
        const response = await fetch('/api/room', {
            method: 'POST',
            body: playerName,
        });
        return await response.json();
    },
    getVotes: async (roomId) => {
        const response = await fetch('/api/room/' + roomId, {
            method: 'GET',
        });
        return await response.json();
    },
    addPlayerToRoom: async (roomId, playerName) => {
        const response = await fetch('/api/room/' + roomId + '/player', {
            method: 'POST',
            body: playerName,
        });
        return await response.json();
    },
    vote: async (playerId, value) => {
        const response = await fetch('/api/vote/' + playerId, {
            method: 'POST',
            body: value
        });
        return await response.json();
    },
    clearVotes: async (roomId) => {
        const response = await fetch('/api/room/' + roomId + '/clear', {
            method: 'POST'
        });
        return await response.json();
    },
    showVotes: async (roomId) => {
        await fetch('/api/room/' + roomId + '/show', {
            method: 'POST'
        });
    }
};

export default api;
