import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, CaretUp, MagnifyingGlass, PencilSimpleLine, Question, UserCircle } from "phosphor-react";
import { DocumentButton } from "./DocumentButton";
import cx from "classnames";

interface IProps {
  showFoldOutMenu: Boolean;
  setShowFoldOutMenu: React.Dispatch<React.SetStateAction<Boolean>>;
  showColumnView: Boolean;
  setShowColumnView: React.Dispatch<React.SetStateAction<Boolean>>;
}

export const DropdownHeader: React.FC<IProps> = ({ showFoldOutMenu, setShowFoldOutMenu, showColumnView, setShowColumnView }) => {
  return (
    <div className="flex flex-row p-4 pl-8 pr-8 bg-lowWhite">
      <div>
        <p className="font-extrabold tracking-widest text-xs">DARSTELLUNG</p>
        <div className="flex flex-row pt-2">
          <div
            className={cx("p-2 rounded-md", {
              "bg-lightGrey": !showColumnView,
              "": showColumnView,
            })}
            onClick={() => {
              setShowColumnView(false);
            }}
          >
            <img className="w-4" src={`${process.env.PUBLIC_URL}/icons/column-view-icon.svg`} alt="column view icon"></img>
          </div>
          <div
            className={cx("p-2 rounded-md", {
              "bg-lightGrey": showColumnView,
              "": !showColumnView,
            })}
            onClick={() => {
              setShowColumnView(true);
            }}
          >
            <img className="w-4" src={`${process.env.PUBLIC_URL}/icons/row-view-icon.svg`} alt="row view icon"></img>
          </div>
        </div>
      </div>
    </div>
  );
};
