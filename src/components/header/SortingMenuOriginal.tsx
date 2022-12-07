import { ArrowsClockwise } from "phosphor-react";
import { useRef, useState } from "react";
import { useSection } from "../../contexts";
import { useUser } from "../../contexts/UserContext";
import { useOutsideClick } from "../../hooks/use-outside-click";

export const SortingMenuOriginal = () => {
  const { sectionList, individualSorting, setIndividualSorting } = useSection();
  const [showSortingMenu, setShowSortingMenu] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setShowSortingMenu(false));
  const { user } = useUser();

  const handleChange = (droppedItem: any) => {
    const updatedList = [...individualSorting];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setIndividualSorting(updatedList);
  };

  const getSectionObject = (id: string) => {
    let section: any = sectionList.find((section) => section.id === id);
    return section;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setShowSortingMenu(!showSortingMenu)}
        className={`flex flex-row justify-between bg-offWhite hover:bg-lightGrey items-center rounded-md gap-2 pl-2 pr-2 pt-2 pb-2 hover:cursor-pointer font-bold h-8`}>
        <ArrowsClockwise size={22} className="text-darkGrey" />
      </button>
    </div>
  );
};
