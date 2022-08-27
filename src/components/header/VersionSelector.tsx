import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, CaretUp } from "phosphor-react";
import { useHeaderContext } from "../../contexts";

export const VersionSelector = () => {
  const { selectedVersion, versionHistory, setSelectedVersion } = useHeaderContext();
  const [showVersionMenu, setShowVersionMenu] = useState<boolean>(false);

  useEffect(() => {
    setSelectedVersion(versionHistory.length - 1);
  }, [versionHistory, setSelectedVersion]);

  return (
    <DropdownMenu.Root
      modal={false}
      onOpenChange={() => {
        setShowVersionMenu(!showVersionMenu);
      }}
    >
      <DropdownMenu.Trigger className="flex flex-row justify-between bg-offWhite hover:bg-lightGrey items-center rounded-md gap-2 pl-2 pr-2 h-8 hover:cursor-pointer font-bold text-sm max-w-[200px]">
        <span className="truncate">
          Version {selectedVersion + 1}
          <span className="text-mediumGrey font-light ml-2">{versionHistory[selectedVersion].author}</span>
        </span>
        {showVersionMenu ? <CaretUp size={12} className="text-darkGrey" weight="bold" /> : <CaretDown size={12} className="text-darkGrey" weight="bold" />}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content side="bottom" align="start" className="flex flex-col bg-white shadow-md mt-4 rounded-lg p-2 max-h-[500px] overflow-x-scroll no-scrollbar">
          {/* Iterate through list with this element */}

          {versionHistory.map((item: any, index: any) => (
            <DropdownMenu.Item
              className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
              key={index}
              onClick={() => {
                setSelectedVersion(index);
              }}
            >
              <div className="text-darkGrey text-sm font-medium">
                Version {index + 1}
                <span className="text-mediumGrey font-light ml-2">{item.author}</span>
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
