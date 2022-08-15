import { Bookmarks, List, Notepad, Scales } from "phosphor-react"
import { useState } from "react"
import { Button } from "./Button"
import cx from "classnames"

export const SidebarHeader = () => {
    const buttons = [
        {
            name: "Notepad",
            icon: <Notepad size={18} />,
        },
        {
            name: "Hints",
            icon: <Scales size={18} />,
        },
        {
            name: "Bookmarks",
            icon: <Bookmarks size={18} />,
        },
    ];
    const [activeButton, setActiveButton] = useState<string>(buttons[0].name)
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    return (
        <div className={cx("flex flex-row", {
            "justify-between": sidebarOpen,
            "justify-end": !sidebarOpen,
            })}>
            <div className={cx("transition duration-300", {
                "rotate-90" : sidebarOpen,
                 "rotate-0" : !sidebarOpen,
                })}
                onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Button key={"sidebarActive"}
                    bgColor="transparent"
                    size="sm"
                    textColor="font-bold text-darkGrey"
                    icon={<List size={18} />}
                />
            </div>
            
            <div className={cx("flex flex-row gap-2", {
                "hidden": !sidebarOpen,
            })}>
                {buttons.map((button) => (
                    <Button key={button.name}
                        bgColor={button.name === activeButton ? "bg-offWhite" : "transparent"}
                        size="sm"
                        textColor="font-bold text-darkGrey"
                        icon={button.icon}
                        onClick={() => {
                            setActiveButton(button.name)
                        }}
                    />
                ))}
            </div>
        </div>
    )
}