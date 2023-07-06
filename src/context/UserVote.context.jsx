import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import api from "../api.js";

export const UserVoteContext = createContext({
    bets: {},
    loadBets: () => console.log("loadBets"),
    updateBets: () => console.log("updateBets"),
});

export function UserVoteProvider({children}) {
    const [bets, setBets] = useState({});

    useEffect(() => {
        console.log(bets);
    }, [bets]);

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

    const value = useMemo(() => ({bets, loadBets, updateBets}), [bets, loadBets, updateBets]);

    return <UserVoteContext.Provider value={value}>{children}</UserVoteContext.Provider>
}

export function useUserVote() {
    return useContext(UserVoteContext);
}