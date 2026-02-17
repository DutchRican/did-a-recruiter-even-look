import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Modal } from "./Modal";
import { Button } from "./ui/button";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "./ui/input";
import { defaultOllamaUrl, getLocalStorageSettings, setLocalStorageSettings } from "@/lib/utils";
import AsyncSelect from "./AsyncSelect";
import { useMain } from "@/context/MainContext";
import { messageMap } from "@/types";

export default function SettingsModal({ closeAction, canClose }: { closeAction: () => void, canClose: boolean }) {
    const [downloadAI, setDownloadAI] = useState(false);
    const [selectedLLM, setselectedLLM] = useState<'chrome_ai' | 'ollama' | ''>('');
    const settings = useMemo(() => getLocalStorageSettings(), []);
    const [ollamaUrl, setOllamaUrl] = useState('');
    const [selectedModel, setSelectedModel] = useState<string|undefined>();
    const { error: chromeErrors, downLoadStatus, isDownloading, canUseChromeAi, status, downloadLLM } = useMain();

    useEffect(() => {
        setselectedLLM(settings.llmType);
        setOllamaUrl(settings.ollamaUrl || defaultOllamaUrl);
        setSelectedModel(settings.model);
        if (!chromeErrors && status ==='downloadable') setDownloadAI(true);
    }, []);

    const settingsChanged = useCallback(() => {
        return selectedLLM !== settings.llmType && selectedLLM !== '' || (settings.ollamaUrl !== ollamaUrl) || settings.model !== selectedModel;
    }, [selectedLLM, ollamaUrl, selectedModel]);

    const updateSettings = () => {
        setLocalStorageSettings({
            llmType: selectedLLM,
            ollamaUrl,
            model: selectedModel
        });
        closeAction();
    }

    const isOllamaAndHasUrl = useCallback(() => {
        return selectedLLM === 'ollama' ? ollamaUrl !== '' : true;
    }, [selectedLLM, ollamaUrl]);

    return (
        <Modal.Body onClose={closeAction}>
            <Modal.Header title="Settings" onClose={closeAction} canClose={canClose} />
            <Modal.Content>
                <div className="flex flex-col">
                    <RadioGroup value={selectedLLM} onValueChange={(v) => { setselectedLLM(v as 'ollama' | 'chrome_ai') }} className="w-fit">
                        <div className="flex items-center gap-3" >
                            <RadioGroupItem value='chrome_ai' id="chrome_ai" className="bg-white"  aria-disabled={!canUseChromeAi || isDownloading} disabled={!canUseChromeAi || isDownloading}/>
                            <Label htmlFor="chrome_ai">{!canUseChromeAi  || isDownloading ? messageMap[status!] : 'Use built in Chrome AI'}</Label>
                        </div>
                        <div className="flex items-center gap-3" >
                            <RadioGroupItem value='ollama' id="ollama" className="bg-white" />
                            <Label htmlFor="ollama">Connect to an Ollama instance</Label>
                        </div>
                        {/* Show input only when the user wants to connect to an ollama instance */}
                        {selectedLLM === 'ollama' && <div className="flex flex-col gap-2 pl-6">
                            <Input id="ollama-url" onChange={(e) => setOllamaUrl(e.target.value)} value={ollamaUrl} />
                        </div>}
                        {selectedLLM === 'ollama' && !!ollamaUrl && <div className="flex flex-col gap-2 pl-6">
                            <AsyncSelect selectedItem={selectedModel} onSelect={setSelectedModel}/>
                            </div>}
                    </RadioGroup>
                </div>
            </Modal.Content>
            <Modal.Footer>
                {settingsChanged() && isOllamaAndHasUrl() && <Button variant={'outline'} onClick={updateSettings}>Save</Button>}
                <Button variant={'outline'} onClick={closeAction} disabled={!canClose}>Close</Button>
                {downloadAI && <Button onClick={downloadLLM} variant={'outline'} className="pl-2">Click here to download the Chrome AI model</Button>}
            </Modal.Footer>
        </Modal.Body>
    )
}