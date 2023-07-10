import {createContext, useContext, useMemo, useState} from "react";

export const GameContext = createContext({
    player: {},
    setPlayer: () => console.log("setPlayer"),
});

export function PlayerProvider({children}) {
    const [player, setPlayer] = useState(JSON.parse(localStorage.getItem("player") || null));

    const value = useMemo(() => ({
        player,
        setPlayer,
    }), [player, setPlayer]);

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
    return useContext(GameContext);
}