import useModels from "@/hooks/useModels";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function AsyncSelect({selectedItem, onSelect}: {selectedItem?: string, onSelect: (value: string) => void}) {
    const { availableModels, isLoading, error} = useModels();

    if (isLoading) {
        return (
            <Loader2 className="mx-4 animate-spin" />
        )
    }
    return (
        <Select onValueChange={onSelect} value={selectedItem}>
            <SelectTrigger className="w-45"><SelectValue placeholder="Select a model"/></SelectTrigger>
            <SelectContent className="max-h-75 z-999">
                {error && <SelectItem disabled={true} value="failure" key="fail">Fetching models failed</SelectItem>}
                {!error && availableModels.map((model) => {
                    return (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    )
}