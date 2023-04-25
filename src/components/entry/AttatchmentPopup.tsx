import { Plus, X, XCircle } from "phosphor-react";
import { useState } from "react";
import { SyntheticKeyboardEvent } from "react-draft-wysiwyg";
import { Button } from "../Button";
import { getAttatchments } from "../../util/get-attatchments";
import { useCase, useUser } from "../../contexts";

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
  const [suggestionsActive, setSuggestionsActive] = useState<boolean>(false);
  const { user } = useUser();
  const { entries } = useCase();

  const handleKeyDown = (e: SyntheticKeyboardEvent) => {
    if (e.key !== "Enter") return;
    login();
  };

  const login = (input?: string) => {
    const value = input ? input : currentTag;
    if (!value || value?.trim().length <= 0) return;
    setTags([...tags, value]);
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
            Sie den Dateinamen hier angeben. (z.B. zeugenaussage.pdf,
            schaden.jpg, ...)
          </span>
          <div className="flex flex-col">
            <div className="flex flex-row w-full items-start justify-between gap-1">
              <div className="w-full">
                <input
                  value={currentTag}
                  className="w-full px-2 py-2 text-sm bg-offWhite block rounded-lg text-mediumGrey focus:outline-none"
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setCurrentTag(e.target.value);
                  }}
                  onFocus={(e) => setSuggestionsActive(true)}
                  type="text"
                  placeholder="Dateiname..."
                />
                {suggestionsActive ? (
                  <ul className="my-1 ml-0 p-1 text-darkGrey w-full max-h-[100px] overflow-auto bg-offWhite rounded-b-lg">
                    {getAttatchments(entries, user?.role, currentTag).map(
                      (attatchment, index) => (
                        <li
                          tabIndex={index}
                          className="p-1 rounded-lg hover:bg-lightGrey focus:bg-lightGrey focus:outline-none cursor-pointer"
                          onClick={(e: React.BaseSyntheticEvent) => {
                            setCurrentTag(e.target.innerHTML);
                            setSuggestionsActive(false);
                            login(e.target.innerHTML);
                          }}>
                          {attatchment}
                        </li>
                      )
                    )}
                  </ul>
                ) : null}
              </div>
              <div className="items-center flex my-1">
                <Button
                  alternativePadding="p-1"
                  icon={<Plus size={20} color="white" weight="regular" />}
                  onClick={login}></Button>
              </div>
            </div>
          </div>

          {/* TODO: dnd für reihenfolge */}
          <div className="flex flex-col flex-wrap gap-1 w-full">
            {tags.map((tag, index) => (
              <div
                className="flex flex-row items-center px-2 py-1 rounded-lg bg-offWhite justify-between"
                key={index}>
                <div className="flex flex-row gap-3">
                  <span>{index + 1}.</span>
                  <span>{tag}</span>
                </div>
                <XCircle
                  size={20}
                  weight="fill"
                  className="cursor-pointer"
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
