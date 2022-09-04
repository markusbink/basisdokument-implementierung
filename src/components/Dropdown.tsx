import { Quotes } from "phosphor-react";
import React, { useState } from "react";
import { useNotes } from "../contexts";

export const Dropdown = ({ options }: {options:any}) => {
    const [showOptions, setShowOptions] = useState(false);
    const { setAssociatedEntryId} = useNotes();
    const handleClick = () => {
        setShowOptions(!showOptions);
    }
    return(
        <div className="bg-darkGrey rounded flex items-center p-1 m-1 ">
        <div className="relative inline-block text-left">
        <div>
          <button 
          onClick={handleClick}
          type="button" className="" id="menu-button" aria-expanded="true" aria-haspopup="true">
            <Quotes size={16} color="white" weight="regular" />
          </button>
        </div>
        {showOptions && (<div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
          <div className="py-1" role="none">
            {options && options.map((option:string) => (
            <button  onClick={() => setAssociatedEntryId(option)} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem" id="menu-item-0">{option}</button>)) }
          </div>
        </div>)}
      </div>
      </div>
    );
}

