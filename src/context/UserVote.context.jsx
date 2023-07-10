import {createContext, useCallback, useContext, useMemo, useState} from "react";
import api from "../api.js";

export const UserVoteContext = createContext({
    votes: {},
    setVotes: () => console.log("setVotes"),
    loadVotes: () => console.log("loadVotes"),
    vote: () => console.log("vote"),
    clearVotes: () => console.log("clearVotes"),
    showVotes: () => console.log("showVotes"),
});

export function UserVoteProvider({children}) {
    const [votes, setVotes] = useState([]);

    const loadVotes = useCallback(async (roomId) => {
        api.getVotes(roomId).then(result => {
            setVotes(result);
        });
    }, []);

    const vote = useCallback((playerId, vote) => {
        api.vote(playerId, vote).then((votes) => {
            setVotes(votes);
        });
    }, []);

    const clearVotes = useCallback((roomId) => {
        api.clearVotes(roomId).then((votes) => {
            setVotes(votes);
        });
    }, []);

    const showVotes = useCallback((roomId) => {
        api.showVotes(roomId).then((votes) => {
            setVotes(votes);
        });
    }, [loadVotes]);

    const value = useMemo(() => ({
        votes,
        setVotes,
        loadVotes,
        vote,
        clearVotes,
        showVotes
    }), [votes, setVotes, clearVotes, loadVotes, showVotes, vote]);

    return <UserVoteContext.Provider value={value}>{children}</UserVoteContext.Provider>
}

export function useUserVote() {
    return useContext(UserVoteContext);
}