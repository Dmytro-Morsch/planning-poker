const api = {
    createRoom: async (playerName) => {
        const response = await fetch("/api/room", {
            method: 'POST',
            body: playerName,
        });
        return await response.json();
    }
};

export default api;
