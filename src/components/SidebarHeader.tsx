import { Bookmarks, List, Notepad, Scales } from "phosphor-react"
import { Button } from "./Button"

export const SidebarHeader = () => {
    return (
        <div className="flex flex-row justify-between ">
            <Button bgColor="bg-offWhite"
                size="sm"
                textColor="font-bold text-darkGrey"
                icon={<List size={16} />}>
            </Button>
            <div className="flex flex-row gap-2 w-[1h]">
                <Button bgColor="bg-offWhite"
                    size="sm"
                    textColor="font-bold text-darkGrey"
                    icon={<Notepad size={16} />}>
                </Button>
                <Button bgColor="bg-offWhite"
                    size="sm"
                    textColor="font-bold text-darkGrey"
                    icon={<Scales size={16} />}>
                </Button>
                <Button bgColor="bg-offWhite"
                    size="sm"
                    textColor="font-bold text-darkGrey"
                    icon={<Bookmarks size={16} />}>
                </Button>
            </div>
        </div>
    )
}