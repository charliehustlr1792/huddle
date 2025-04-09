"use client";
import { BackgroundMode } from "@/types/BackgroundMode";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getGameInstance } from "../components/PhaserGame";
import Preloader from "@/components/Preloader";
const phaserGame = getGameInstance()
export function getInitialBackgroundMode() {
    const currentHour = new Date().getHours()
    return currentHour > 6 && currentHour <= 18 ? BackgroundMode.DAY : BackgroundMode.NIGHT
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        backgroundMode: getInitialBackgroundMode(),
        sessionId: '',
        loggedIn: false,
        playerNameMap: new Map<string, string>(),
        x:705,
        y:500,
        anim:"",
        readyToConnect:false,
        playerName: "",
        playerTexture: "",
    },
    reducers: {
        toggleBackgroundMode: (state) => {
            const newMode = state.backgroundMode === BackgroundMode.DAY ? BackgroundMode.NIGHT : BackgroundMode.DAY
            state.backgroundMode = newMode
            if (phaserGame) {
                const preloader = phaserGame.scene.keys.preloader as Preloader
                preloader.changeBackgroundMode(newMode)
            }
        },
        setSessionId: (state, action: PayloadAction<string>) => {
            state.sessionId = action.payload
        },
        setLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.loggedIn = action.payload
        },
        updatePlayer: (
            state,
            action: PayloadAction<{ x: number; y: number; anim: string | null }>
          ) => {
            state.x = action.payload.x;
            state.y = action.payload.y;
            state.anim = action.payload.anim ?? "";
          },
          setReadyToConnect: (state, action: PayloadAction<boolean>) => {
            state.readyToConnect = action.payload
          },
          setInitialisation: (
            state,
            action: PayloadAction<{ name: string; avatar: string }>
          ) => {
            
              state.readyToConnect = true
              state.playerName = action.payload.name
              state.playerTexture = action.payload.avatar
          },
            
    },
})

export const { toggleBackgroundMode,setLoggedIn,setSessionId,updatePlayer,setReadyToConnect,setInitialisation } = userSlice.actions
export default userSlice.reducer

