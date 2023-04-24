import { Paperclip, X, XCircle } from "phosphor-react";
import { useState } from "react";
import { SyntheticKeyboardEvent } from "react-draft-wysiwyg";
import { Button } from "../Button";

interface AttatchmentPopupProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  attatchments: string[];
  setAttatchments: React.Dispatch<React.SetStateAction<string[]>>;
}

export const AttatchmentPopup: React.FC<AttatchmentPopupProps> = ({
  isVisible,
  setIsVisible,
  attatchments,
  setAttatchments,
}) => {
  const [tags, setTags] = useState<string[]>(attatchments);
  const [currentTag, setCurrentTag] = useState<string>("");

  const handleKeyDown = (e: SyntheticKeyboardEvent) => {
    if (e.key !== "Enter" || !currentTag || currentTag?.trim().length <= 0) {
      return;
    }
    login();
  };

  const login = () => {
    setTags([...tags, currentTag]);
    setCurrentTag("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((el, i) => i !== index));
  };

  const addAttatchment = () => {
    setAttatchments(tags);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="opacity-25 fixed inset-0 z-40 bg-black !m-0" />
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50">
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            p-8 bg-white rounded-lg content-center shadow-lg space-y-8 w-full max-w-[600px]">
          <div className="flex items-start justify-between rounded-lg ">
            <h3>Anlagen hinzufügen</h3>
            <div>
              <button
                onClick={() => {
                  setIsVisible(false);
                }}
                className="text-darkGrey bg-offWhite p-1 rounded-md hover:bg-lightGrey">
                <X size={24} />
              </button>
            </div>
          </div>
          <span className="text-sm">
            Verweisen Sie auf eine Anlage, die Sie später mit versenden, indem
            Sie den Dateinamen hier angeben.
          </span>
          <div className="flex flex-row items-center justify-between bg-offWhite rounded-lg">
            <input
              value={currentTag}
              className="w-full px-2 py-2 text-sm bg-offWhite block rounded-l-lg text-mediumGrey focus:outline-none"
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                setCurrentTag(e.target.value);
              }}
              type="text"
              placeholder="Dateiname..."
            />
            <Button
              alternativePadding="p-2 m-1"
              icon={<Paperclip size={16} color="white" weight="regular" />}
              onClick={login}></Button>
          </div>
          <div className="flex flex-row flex-wrap gap-1">
            {tags.map((tag, index) => (
              <div
                className="flex flex-row items-center cursor-pointer rounded-full gap-1 pl-3 pr-1 py-1 text-xs font-semibold bg-darkGrey text-white"
                key={index}>
                <span>{tag}</span>
                <XCircle
                  size={20}
                  weight="fill"
                  onClick={() => {
                    removeTag(index);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end">
            <button
              className="bg-darkGrey hover:bg-mediumGrey rounded-md text-white py-2 px-3 text-sm"
              onClick={() => {
                addAttatchment();
              }}>
              Auf gelistete Anlagen verweisen
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
