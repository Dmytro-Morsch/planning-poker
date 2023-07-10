import {createContext, useCallback, useContext, useMemo, useState} from "react";
import api from "../api.js";

export const UserVoteContext = createContext({
    votes: {},
    player: {},
    setPlayer: () => console.log("setPlayer"),
    setVotes: () => console.log("setVotes"),
    loadVotes: () => console.log("loadVotes"),
    vote: () => console.log("vote"),
    clearVotes: () => console.log("clearVotes"),
    showVotes: () => console.log("showVotes"),
    deletePlayer: () => console.log("deletePlayer"),
});

export function UserVoteProvider({children}) {
    const [votes, setVotes] = useState([]);
    const [player, setPlayer] = useState(JSON.parse(localStorage.getItem("player") || null));

    const loadVotes = useCallback(async (roomId) => {
        api.getVotes(roomId).then(setVotes);
    }, []);

    const vote = useCallback((playerId, vote) => {
        api.vote(playerId, vote).then(setVotes);
    }, []);

    const clearVotes = useCallback((roomId) => {
        api.clearVotes(roomId).then(setVotes);
    }, []);

    const showVotes = useCallback((roomId) => {
        api.showVotes(roomId).then(setVotes);
    }, [loadVotes]);

    const deletePlayer = useCallback((playerId) => {
        api.deletePlayer(playerId).then(setVotes);
    }, []);

    const value = useMemo(() => ({
        votes,
        setVotes,
        player,
        setPlayer,
        loadVotes,
        vote,
        clearVotes,
        showVotes,
        deletePlayer
    }), [votes, setVotes, player, setPlayer, clearVotes, loadVotes, showVotes, vote, deletePlayer]);

    return <UserVoteContext.Provider value={value}>{children}</UserVoteContext.Provider>
}

export function useUserVote() {
    return useContext(UserVoteContext);
}