import { Bookmarks, List, Notepad, Scales } from "phosphor-react"
import { useState } from "react"
import { Button } from "./Button"
import cx from "classnames"

export const SidebarHeader = () => {
    const [isNotesActive, setIsNotesActive] = useState<boolean>(false);
    const [isHintsActive, setIsHintsActive] = useState<boolean>(false);
    const [isBookmarksActive, setIsBookmarksActive] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    return (
        <div className={cx("flex flex-row", {
            "justify-between": sidebarOpen,
            "justify-end": !sidebarOpen,
            })}>
            <div className={sidebarOpen ? "transition duration-300 rotate-90" : "transition duration-300 rotate-0"}
                onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Button bgColor="None"
                    size="sm"
                    textColor="font-bold text-darkGrey"
                    icon={<List size={18} />}>
                </Button>
            </div>
            
            <div className={sidebarOpen ? "flex flex-row gap-2 w-[1h]" : "flex flex-row gap-2 w-[1h] hidden"}>
                <Button bgColor={isNotesActive ? "bg-offWhite" : "None"}
                    size="sm"
                    textColor="font-bold text-darkGrey"
                    icon={<Notepad size={18} />}
                    onClick={() => {
                        setIsNotesActive(true);
                        setIsHintsActive(false);
                        setIsBookmarksActive(false);
                    }}>
                </Button>
                <Button bgColor={isHintsActive ? "bg-offWhite" : "None"}
                    size="sm"
                    textColor="font-bold text-darkGrey"
                    icon={<Scales size={18} />}
                    onClick={() => {
                        setIsNotesActive(false);
                        setIsHintsActive(true);
                        setIsBookmarksActive(false);
                    }}>
                </Button>
                <Button bgColor={isBookmarksActive ? "bg-offWhite" : "None"}
                    size="sm"
                    textColor="font-bold text-darkGrey"
                    icon={<Bookmarks size={18} />}
                    onClick={() => {
                        setIsNotesActive(false);
                        setIsHintsActive(false);
                        setIsBookmarksActive(true);
                    }}>
                </Button>
            </div>
        </div>
    )
}