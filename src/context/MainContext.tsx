import useLLM from "@/hooks/useLLM";
import { createContext, useContext, type ReactNode } from "react";

type MainContextType = {
    canUseChromeAi: boolean,
    error: number | null,
    isDownloading: boolean,
    downLoadStatus: number,
    status: string | null,
    downloadLLM: () => Promise<void>,

}

const MainContext = createContext<MainContextType>({
    canUseChromeAi: false,
    error: 0,
    isDownloading: false,
    downLoadStatus: 0,
    status: null,
    downloadLLM: async () => {}
});

export function MainProvider({ children }: { children: ReactNode }) {
    const {canUseChromeAi, error, isDownloading, downLoadStatus, status, downloadLLM} = useLLM();
    
    const contextValue: MainContextType = {
        canUseChromeAi,
        error,
        isDownloading,
        downLoadStatus,
        status,
        downloadLLM
    }

    return (
        <MainContext.Provider value={contextValue} >
        { children }
        </MainContext.Provider>
    )

};

export function useMain(){
    const context = useContext(MainContext);
    if (context === undefined) {
        throw new Error("useMain must be used within a MainProvider");
    }
    return context;
}