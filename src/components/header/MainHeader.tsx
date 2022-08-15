import { CaretDown, CaretUp, MagnifyingGlass, PencilSimpleLine, Question, UserCircle } from "phosphor-react";
import { DocumentButton } from "../header/DocumentButton";

interface IProps {
  showFoldOutMenu: Boolean;
  setShowFoldOutMenu: React.Dispatch<React.SetStateAction<Boolean>>;
}

export const MainHeader: React.FC<IProps> = ({ showFoldOutMenu, setShowFoldOutMenu }) => {
  return (
    <div className="flex p-3 pl-8 pr-8 justify-between">
      {/* actions on the left side */}
      <div className="flex flex-row gap-4 items-center">
        <DocumentButton />
        <div style={{display: "none"}} className="flex flex-row align-middle justify-center items-center gap-2 bg-darkGrey rounded-md pl-2 pr-2 h-full">
          <UserCircle size={18} className="text-white" />
          <div className="">
            <p className="font-extrabold text-xs text-white">Max Mustermann</p>
            <p className="text-xs text-white">Beklagtenpartei</p>
          </div>
        </div>
        <div
          className="flex flex-row justify-center items-center gap-1 bg-offWhite rounded-full h-8 pl-2 pr-2"
          onClick={() => {
            setShowFoldOutMenu(!showFoldOutMenu);
          }}
        >
          <p className="text-sm font-bold">Ansicht</p>
          {showFoldOutMenu ? <CaretUp size={12} className="text-darkGrey" /> : <CaretDown size={12} className="text-darkGrey" />}
        </div>
        <p className="font-extralight">AZ. 8 0 6432/19</p>
      </div>
      {/* searchbar */}
      <div className="flex flex-row gap-2 justify-center items-center">
        <div className="flex flex-row bg-offWhite rounded-md pl-2 pr-2 h-full items-center">
          <input className="bg-offWhite h-full outline-0 min-w-[300px] max-w-[400px] pl-2" type="text" placeholder="Im Basisdokument suchen..." />
          <MagnifyingGlass size={20} weight="bold" className="text-darkGrey ml-1 mr-1" />
        </div>
      </div>
      {/* actions on the right side */}
      <div className="flex flex-row gap-4 justify-end">
        <div className="flex flex-row align-middle justify-center items-center gap-2 bg-offWhite rounded-md w-16 h-full">
          <Question size={24} weight="bold" className="text-darkGrey" />
        </div>
        <div className="flex flex-row align-middle justify-center items-center gap-2 bg-offWhite rounded-md w-16 h-full">
          <div className="w-6 h-6 bg-marker-yellow rounded-full border-darkGrey border-2"></div>
        </div>
        <div className="flex flex-row align-middle justify-center items-center gap-2 bg-offWhite rounded-md w-16 h-full">
          <PencilSimpleLine size={24} weight="bold" className="text-darkGrey" />
          <CaretDown size={12} className="text-darkGrey" weight="fill"/>
        </div>
      </div>
    </div>
  );
};
