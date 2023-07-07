import {createContext, useCallback, useContext, useMemo, useState} from "react";
import api from "../api.js";

export const UserVoteContext = createContext({
    bets: {},
    loadBets: () => console.log("loadBets"),
    updateBets: () => console.log("updateBets"),
    deleteEstimate: () => console.log("deleteEstimate"),
    showEstimate: () => console.log("showEstimate"),
});

export function UserVoteProvider({children}) {
    const [bets, setBets] = useState({});

    const loadBets = useCallback(async (roomId) => {
        api.getBets(roomId).then(result => {
            setBets(result);
        });
    }, []);

    const updateBets = useCallback((playerId, bet, roomId) => {
        api.placeBet(playerId, bet).then(() => {
            loadBets(roomId);
        });
    }, [loadBets]);

    const deleteEstimate = useCallback((roomId) => {
        api.clearEstimate(roomId).then(() => {
            loadBets(roomId);
        });
    }, [loadBets]);

    const showEstimate = useCallback((roomId) => {
        api.showEstimate(roomId).then(() => {
            loadBets(roomId);
        });
    }, [loadBets]);

    const value = useMemo(() => ({
        bets,
        loadBets,
        updateBets,
        deleteEstimate,
        showEstimate
    }), [bets, deleteEstimate, loadBets, showEstimate, updateBets]);

    return <UserVoteContext.Provider value={value}>{children}</UserVoteContext.Provider>
}

export function useUserVote() {
    return useContext(UserVoteContext);
}