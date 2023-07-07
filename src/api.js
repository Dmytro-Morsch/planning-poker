const api = {
    createRoom: async (playerName) => {
        const response = await fetch('/api/room', {
            method: 'POST',
            body: playerName,
        });
        return await response.json();
    },
    getBets: async (roomId) => {
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
    getRoomPlayers: async (roomId) => {
        const response = await fetch('/api/room/' + roomId + '/players', {
            method: 'GET'
        });
        return await response.json();
    },
    placeBet: async (playerId, bet) => {
        await fetch('/api/bet/' + playerId, {
            method: 'POST',
            body: bet
        });
    },
    clearEstimate: async (roomId) => {
        await fetch('/api/room/' + roomId + '/clear', {
            method: 'POST'
        });
    },
    showEstimate: async (roomId) => {
        await fetch('/api/room/' + roomId + '/show', {
            method: 'POST'
        });
    }
};

export default api;
