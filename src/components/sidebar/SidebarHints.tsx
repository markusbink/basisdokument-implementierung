import { Plus } from "phosphor-react";
import { Button } from "../Button";
import { HintProps, Hint } from "./Hint";
import { useState } from "react";
import { JudgeHintPopup } from "../JudgeHintPopup";

//TODO: remove this, this is for testing
const isJudge = true;
const hints: HintProps[] = [
  {
    id: "1",
    title: "Hinweis Test Titel mit Bezug",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur dolorum earum dolores omnis odit, voluptas ratione? Praesentium reprehenderit perspiciatis repudiandae officia veniam qui facere at deserunt, harum ab pariatur beatae?",
    author: "Max Muster",
    timestamp: new Date(),
    referenceTo: "12345",
  },
  {
    id: "2",
    title: "Hinweis Test Titel ohne Bezug",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur dolorum earum dolores omnis odit, voluptas ratione? Praesentium reprehenderit perspiciatis repudiandae officia veniam qui facere at deserunt, harum ab pariatur beatae?",
    author: "Max Muster",
    timestamp: new Date(),
  },
];

export const SidebarHints = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="flex flex-col gap-7 p-4 h-full overflow-auto">
      <div className="flex justify-between items-center">
        <div className="text-base font-bold text-darkGrey text-lg">
          Hinweise (nach §139 ZPO)
        </div>
        <Button
          key="createNote"
          onClick={() => setShowModal(true)}
          bgColor="bg-darkGrey"
          size="sm"
          textColor="text-white"
          hasText={false}
          alternativePadding="p-1"
          icon={<Plus size={18} weight="bold" />}
        ></Button>
      </div>
      {hints.length <= 0 && (
        <div className="mt-7 text-darkGrey opacity-40 text-center text-sm">
          {isJudge
            ? "Hinweise, die Sie zu Beiträgen verfassen, erscheinen in dieser Ansicht. Nur Sie können Hinweise verfassen."
            : "Hinweise nach §139 ZPO erscheinen in dieser Ansicht, sobald der Richter oder die Richterin welche verfasst hat."}
        </div>
      )}
      <div className="text-mediumGrey font-bold text-sm">
        OHNE BEZUG AUF BEITRAG
        {hints.map(
          (hint) => !hint.referenceTo && <Hint key={hint.id} {...hint}></Hint>
        )}
      </div>
      <div className="text-mediumGrey font-bold text-sm">
        MIT BEZUG AUF BEITRAG
        {hints.map(
          (hint) => hint.referenceTo && <Hint key={hint.id} {...hint}></Hint>
        )}
      </div>
      {showModal ? <JudgeHintPopup isVisible={showModal} onClose={() => setShowModal(false)} /> : null}
    </div>
  );
};
