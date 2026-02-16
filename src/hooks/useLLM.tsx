import { useEffect, useState } from "react";

const defaultValues = {
    canUseChromeAi: false,
    error: null,
    isDownloading: false,
    downLoadStatus: 0,
    status: null,
    downloadLLM: async () => {}

}
export default function useLLM() {
    const [downLoadStatus, setDownloadStatus] = useState(0);
    const [canUseChromeAi, setCanUseChromeAi] = useState(false);
    const [status, setStatus] = useState<string| null>(null);

    if (!navigator.userAgent.toLowerCase().includes("chrome")) {
        return { ...defaultValues, status: 'chrome_only' };
    };

    try {
        LanguageModel;
    }
    catch {
        return { ...defaultValues, status: 'enable_flag' };
    }
    let mon: CreateMonitor;

    const updateProgress = (event: any) => {
        if (event.loaded < 1) {
            setDownloadStatus(event.loaded * 100);
        }
    }

    const downloadLLM = async () => {
        await LanguageModel.create();
        setStatus('downloading');
    }

    useEffect(() => {
        const checkPrompt = async () => {
            return await LanguageModel.availability({ });
        }

        checkPrompt().then(async (stat) => {
            switch (stat) {
                case 'available':
                    setCanUseChromeAi(true);
                    setDownloadStatus(100);
                    return;
                case 'downloading':
                    setCanUseChromeAi(true);
                    setDownloadStatus(0);
                    setStatus('downloading')
                    return;
                case 'downloadable':
                    setCanUseChromeAi(true);
                    setDownloadStatus(0);
                    return;
            }
            setStatus(stat);
        }).catch((e) => console.log(e));
    }, []);
    return { ...defaultValues, canUseChromeAi, isDownloading: downLoadStatus < 100, downLoadStatus, status, downloadLLM };
}