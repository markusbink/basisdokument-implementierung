import cx from "classnames";
import { CaretDown, CaretUp, DotsThree, Pencil, Plus } from "phosphor-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCase, useHeaderContext, useUser } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { getTheme } from "../../themes/getTheme";
import { UserRole } from "../../types";
import { Button } from "../Button";
import { Action } from "../entry";
import { ErrorPopup } from "../ErrorPopup";
import { Tooltip } from "../Tooltip";
import { MetaDataBody } from "./MetaDataBody";
import { MetaDataForm } from "./MetaDataForm";

interface MetaDataProps {
  owner: UserRole;
}

export const MetaData: React.FC<MetaDataProps> = ({ owner }) => {
  const [isRubrumEditing, setIsRubrumEditing] = useState<boolean>(false);
  const [isIntroductionEditing, setIsIntroductionEditing] =
    useState<boolean>(false);
  const [isRubrumEditErrorVisible, setIsRubrumEditErrorVisible] =
    useState<boolean>(false);
  const [isIntroductionEditErrorVisible, setIsIntroductionEditErrorVisible] =
    useState<boolean>(false);
  const [isMetaDataMenuOpen, setIsMetaDataMenuOpen] = useState<boolean>(false);
  const [isMetaDataBodyOpen, setIsMetaDataBodyOpen] = useState<boolean>(true);
  const { user } = useUser();
  const { metaData, setMetaData } = useCase();
  const { introduction, setIntroduction } = useCase();
  const menuRef = useRef(null);
  useOutsideClick(menuRef, () => {
    setIsMetaDataMenuOpen(false);
  });

  const { selectedTheme } = useHeaderContext();

  const isPlaintiff = owner === UserRole.Plaintiff;
  const isJudge = user?.role === UserRole.Judge;
  const canEdit = isJudge || user?.role === owner;
  const rubrumContent = isPlaintiff ? metaData?.plaintiff : metaData?.defendant;
  const introductionContent = isPlaintiff
    ? introduction?.plaintiff
    : introduction?.defendant;

  const toggleMetaDataMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMetaDataMenuOpen(!isMetaDataMenuOpen);
  };

  const toggleMetaData = () => {
    setIsMetaDataBodyOpen(!isMetaDataBodyOpen);
    setIsRubrumEditing(false);
    setIsIntroductionEditing(false);
  };

  const editRubrum = () => {
    setIsRubrumEditing(!isRubrumEditing);
    setIsMetaDataBodyOpen(true);
    setIsMetaDataMenuOpen(false);
  };

  const updateRubrum = (plainText: string, rawHtml: string) => {
    if (plainText.length === 0) {
      toast("Bitte geben Sie einen Text ein.", { type: "error" });
      return;
    }

    setMetaData((prevState) => {
      const newState = { ...prevState };
      if (isPlaintiff) {
        newState.plaintiff = rawHtml;
      } else {
        newState.defendant = rawHtml;
      }
      return newState;
    });
    setIsRubrumEditing(false);
  };

  const editIntroduction = () => {
    setIsIntroductionEditing(!isIntroductionEditing);
    setIsMetaDataBodyOpen(true);
    setIsMetaDataMenuOpen(false);
  };

  const updateIntroduction = (plainText: string, rawHtml: string) => {
    if (plainText.length === 0) {
      toast("Bitte geben Sie einen Text ein.", { type: "error" });
      return;
    }

    setIntroduction((prevState) => {
      const newState = { ...prevState };
      if (isPlaintiff) {
        newState.plaintiff = rawHtml;
      } else {
        newState.defendant = rawHtml;
      }
      return newState;
    });
    setIsIntroductionEditing(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex gap-2">
        <Button
          position="end"
          bgColor={cx({
            [`bg-${getTheme(selectedTheme)?.secondaryPlaintiff} hover-bg-${
              getTheme(selectedTheme)?.primaryPlaintiff
            }`]: isPlaintiff,
            [`bg-${getTheme(selectedTheme)?.secondaryDefendant} hover-bg-${
              getTheme(selectedTheme)?.primaryDefendant
            }`]: !isPlaintiff,
          })}
          textColor={cx("font-bold text-sm uppercase tracking-wider", {
            [`text-${getTheme(selectedTheme)?.primaryPlaintiff} hover-text-${
              getTheme(selectedTheme)?.secondaryPlaintiff
            }`]: isPlaintiff,
            [`text-${getTheme(selectedTheme)?.primaryDefendant} hover-text-${
              getTheme(selectedTheme)?.secondaryDefendant
            }`]: !isPlaintiff,
          })}
          size="sm"
          onClick={toggleMetaData}
          icon={
            isMetaDataBodyOpen ? (
              <CaretUp size={14} weight="bold" />
            ) : (
              <CaretDown size={14} weight="bold" />
            )
          }>
          {owner}
        </Button>
        {canEdit && (
          <div ref={menuRef} className="flex relative space-y-1 cursor-pointer">
            <Tooltip text="Mehr Optionen">
              <Action
                className={cx("relative", {
                  [`bg-${getTheme(selectedTheme)?.primaryPlaintiff} text-${
                    getTheme(selectedTheme)?.secondaryPlaintiff
                  }`]: isPlaintiff && isMetaDataMenuOpen,
                  [`bg-${getTheme(selectedTheme)?.primaryDefendant} text-${
                    getTheme(selectedTheme)?.secondaryDefendant
                  }`]: !isPlaintiff && isMetaDataMenuOpen,
                  [`hover-text-${getTheme(selectedTheme)?.secondaryPlaintiff}`]:
                    isPlaintiff,
                  [`hover-text-${getTheme(selectedTheme)?.secondaryDefendant}`]:
                    !isPlaintiff,
                })}
                onClick={toggleMetaDataMenu}
                isPlaintiff={isPlaintiff}>
                <DotsThree size={20} />
              </Action>
            </Tooltip>
            {isMetaDataMenuOpen ? (
              <ul className="absolute right-0 top-full p-2 bg-white text-darkGrey rounded-xl min-w-[150px] shadow-lg z-50 text-sm">
                <>
                  <li
                    tabIndex={0}
                    onClick={editRubrum}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none">
                    <Pencil size={20} />
                    Rubrum bearbeiten
                  </li>
                  <li
                    tabIndex={0}
                    onClick={editIntroduction}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none">
                    <Pencil size={20} />
                    Einführung bearbeiten
                  </li>
                </>
              </ul>
            ) : null}
          </div>
        )}
      </div>
      {isMetaDataBodyOpen && (
        <>
          <div
            className={cx(
              "flex flex-col rounded-lg shadow text-sm overflow-hidden",
              {
                [`bg-${getTheme(selectedTheme)?.secondaryPlaintiff} text-${
                  getTheme(selectedTheme)?.primaryPlaintiff
                }`]: isPlaintiff,
                [`bg-${getTheme(selectedTheme)?.secondaryDefendant} text-${
                  getTheme(selectedTheme)?.primaryDefendant
                }`]: !isPlaintiff,
              }
            )}>
            {isRubrumEditing ? (
              <MetaDataForm
                defaultContent={rubrumContent}
                onAbort={(plainText, rawHtml) => {
                  setIsRubrumEditErrorVisible(true);
                }}
                onSave={(plainText, rawHtml) => {
                  updateRubrum(plainText, rawHtml);
                }}
              />
            ) : (
              <MetaDataBody isPlaintiff={isPlaintiff}>
                {rubrumContent ? (
                  <p dangerouslySetInnerHTML={{ __html: rubrumContent }} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 max-w-[200px] m-auto text-center space-y-3">
                    <p className="text-sm">
                      Bisher wurde noch kein Rubrum hinterlegt.
                    </p>
                    {canEdit && (
                      <Button
                        size="sm"
                        bgColor={cx({
                          [`bg-${
                            getTheme(selectedTheme)?.primaryPlaintiff
                          } hover-bg-25-${
                            getTheme(selectedTheme)?.primaryPlaintiff
                          }`]: isPlaintiff,
                          [`bg-${
                            getTheme(selectedTheme)?.primaryDefendant
                          } hover-bg-25-${
                            getTheme(selectedTheme)?.primaryDefendant
                          }`]: !isPlaintiff,
                        })}
                        textColor={cx({
                          [`text-${
                            getTheme(selectedTheme)?.secondaryPlaintiff
                          } hover-text-${
                            getTheme(selectedTheme)?.primaryPlaintiff
                          }`]: isPlaintiff,
                          [`text-${
                            getTheme(selectedTheme)?.secondaryDefendant
                          } hover-text-${
                            getTheme(selectedTheme)?.primaryDefendant
                          }`]: !isPlaintiff,
                        })}
                        onClick={() => setIsRubrumEditing(true)}
                        icon={<Plus size={18} />}>
                        Hinzufügen
                      </Button>
                    )}
                  </div>
                )}
              </MetaDataBody>
            )}
            <ErrorPopup isVisible={isRubrumEditErrorVisible}>
              <div className="flex flex-col items-center justify-center space-y-8">
                <p className="text-center text-base">
                  Sind Sie sicher, dass Sie Ihre Änderungen verwerfen und somit{" "}
                  <strong>nicht</strong> speichern möchten?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    bgColor="bg-lightGrey"
                    textColor="text-mediumGrey font-bold"
                    onClick={() => {
                      setIsRubrumEditErrorVisible(false);
                    }}>
                    Abbrechen
                  </Button>
                  <Button
                    bgColor="bg-lightRed"
                    textColor="text-darkRed font-bold"
                    onClick={() => {
                      setIsRubrumEditErrorVisible(false);
                      setIsRubrumEditing(false);
                    }}>
                    Verwerfen
                  </Button>
                </div>
              </div>
            </ErrorPopup>
          </div>
          <div
            className={cx(
              "flex flex-col rounded-lg shadow text-sm overflow-hidden",
              {
                [`bg-${getTheme(selectedTheme)?.secondaryPlaintiff} text-${
                  getTheme(selectedTheme)?.primaryPlaintiff
                }`]: isPlaintiff,
                [`bg-${getTheme(selectedTheme)?.secondaryDefendant} text-${
                  getTheme(selectedTheme)?.primaryDefendant
                }`]: !isPlaintiff,
              }
            )}>
            {isIntroductionEditing ? (
              <MetaDataForm
                defaultContent={introductionContent}
                onAbort={(plainText, rawHtml) => {
                  setIsIntroductionEditErrorVisible(true);
                }}
                onSave={(plainText, rawHtml) => {
                  updateIntroduction(plainText, rawHtml);
                }}
              />
            ) : (
              <MetaDataBody isPlaintiff={isPlaintiff}>
                {introductionContent ? (
                  <p
                    dangerouslySetInnerHTML={{ __html: introductionContent }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 max-w-[200px] m-auto text-center space-y-3">
                    <p className="text-sm">
                      Bisher wurde noch keine Einführung hinterlegt.
                    </p>
                    {canEdit && (
                      <Button
                        size="sm"
                        bgColor={cx({
                          [`bg-${
                            getTheme(selectedTheme)?.primaryPlaintiff
                          } hover-bg-25-${
                            getTheme(selectedTheme)?.primaryPlaintiff
                          }`]: isPlaintiff,
                          [`bg-${
                            getTheme(selectedTheme)?.primaryDefendant
                          } hover-bg-25-${
                            getTheme(selectedTheme)?.primaryDefendant
                          }`]: !isPlaintiff,
                        })}
                        textColor={cx({
                          [`text-${
                            getTheme(selectedTheme)?.secondaryPlaintiff
                          } hover-text-${
                            getTheme(selectedTheme)?.primaryPlaintiff
                          }`]: isPlaintiff,
                          [`text-${
                            getTheme(selectedTheme)?.secondaryDefendant
                          } hover-text-${
                            getTheme(selectedTheme)?.primaryDefendant
                          }`]: !isPlaintiff,
                        })}
                        onClick={() => setIsIntroductionEditing(true)}
                        icon={<Plus size={18} />}>
                        Hinzufügen
                      </Button>
                    )}
                  </div>
                )}
              </MetaDataBody>
            )}
            <ErrorPopup isVisible={isIntroductionEditErrorVisible}>
              <div className="flex flex-col items-center justify-center space-y-8">
                <p className="text-center text-base">
                  Sind Sie sicher, dass Sie Ihre Änderungen verwerfen und somit{" "}
                  <strong>nicht</strong> speichern möchten?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    bgColor="bg-lightGrey"
                    textColor="text-mediumGrey font-bold"
                    onClick={() => {
                      setIsIntroductionEditErrorVisible(false);
                    }}>
                    Abbrechen
                  </Button>
                  <Button
                    bgColor="bg-lightRed"
                    textColor="text-darkRed font-bold"
                    onClick={() => {
                      setIsIntroductionEditErrorVisible(false);
                      setIsIntroductionEditing(false);
                    }}>
                    Verwerfen
                  </Button>
                </div>
              </div>
            </ErrorPopup>
          </div>
        </>
      )}
    </div>
  );
};
