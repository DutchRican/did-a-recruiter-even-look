import { SettingsIcon } from "lucide-react";

export function Settings ({clickHandler}: {clickHandler: () => void}) {
    
    return (
        <SettingsIcon  className="absolute top-0 right-0 m-8" onClick={clickHandler}/>
    )
}