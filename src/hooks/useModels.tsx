import { getLocalStorageSettings, getOllamaModels } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function useModels() {
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const settings = useMemo(() => getLocalStorageSettings(), []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const getModels = async () => {
            try {
                setIsLoading(true);
                const models = await getOllamaModels(settings.ollamaUrl);
                setAvailableModels(models);
            } catch (err: any) {
                toast.error('error loading models', err.message ?? err);
                setError(true);
            }
            finally {
                setIsLoading(false);
            }
        }

        getModels();
    }, [settings.ollamaUrl]);

    return { availableModels, isLoading, error };
}