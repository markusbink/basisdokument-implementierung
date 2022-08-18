import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, CaretUp } from "phosphor-react";
import IPropsHeader from "../../types";

interface IProps {
  headerContext: IPropsHeader["headerContext"];
}

export const VersionSelector: React.FC<IProps> = ({ headerContext }) => {
  const [showVersionMenu, setShowVersionMenu] = useState<Boolean>(false);

  return (
    <DropdownMenu.Root
      modal={false}
      onOpenChange={() => {
        setShowVersionMenu(!showVersionMenu);
      }}
    >
      <DropdownMenu.Trigger className="flex flex-row justify-between bg-offWhite hover:bg-lightGrey items-center rounded-md gap-2 pl-2 pr-2 pt-1 pb-1 hover:cursor-pointer font-bold">
        <p>
          Version {headerContext.selectedVersion + 1} <span className="text-mediumGrey font-light">{headerContext.versionHistory[headerContext.selectedVersion].author}</span>
        </p>
        {showVersionMenu ? <CaretUp size={12} className="text-darkGrey" /> : <CaretDown size={12} className="text-darkGrey" />}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content side="bottom" align="start" className="flex flex-col bg-white shadow-md mt-4 rounded-lg p-2 max-h-[500px] overflow-x-scroll no-scrollbar">
          {/* Iterate through list with this element */}

          {headerContext["versionHistory"].map((item: any, index: any) => (
            <DropdownMenu.Item
              className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
              key={index}
              onClick={() => {
                console.log("enter");

                headerContext.setSelectedVersion(index);
              }}
            >
              <div className="text-darkGrey">
                Version {index + 1}<span className="text-mediumGrey font-light ml-2">{item.author}</span>
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
