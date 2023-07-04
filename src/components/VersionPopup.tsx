import { Info } from "phosphor-react";
import cx from "classnames";
import { useState } from "react";
import { UserRole } from "../types";

interface ErrorPopupProps {
  role: UserRole;
  isVisible: boolean;
  children: React.ReactNode;
}

export const VersionPopup: React.FC<ErrorPopupProps> = ({
  role,
  isVisible,
  children,
}) => {
  const [showInfo, setShowInfo] = useState<boolean>(true);
  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="opacity-25 fixed inset-0 z-40 bg-black !m-0" />
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50">
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            p-8 bg-white rounded-lg content-center shadow-lg space-y-2 w-full max-w-[800px]">
          <div className="flex justify-between items-center w-full text-xl font-bold">
            {role === UserRole.Judge
              ? "Stammt die hochgeladene Datei von Ihrem Gericht?"
              : "Stammt die hochgeladene Datei von Ihrer Partei?"}
            <Info
              size={30}
              weight="bold"
              onClick={() => {
                setShowInfo(!showInfo);
              }}
              className="p-1 text-black bg-offWhite hover:bg-lightGrey rounded-md"
            />
          </div>

          <p
            className={cx(
              "text-justify text-base transition-height duration-300 pt-2",
              {
                "h-[0px] -mt-[50px] text-transparent": !showInfo,
                "h-[200px] overflow-auto": showInfo,
              }
            )}>
            Stammt die hochgeladene Version des Basisdokuments{" "}
            <b>von Ihrer Partei oder Ihnen selbst als Gericht</b> und Sie
            möchten daran weiterarbeiten, wird keine neue Version erstellt. Sie
            können weitere Beiträge hinzufügen und zuletzt hinzugefügte Beiträge
            noch editieren, bevor sie es wieder an die Gegenpartei oder das
            Gericht übermitteln.
            <br></br>
            <br></br>
            Wenn Sie die hochgeladene Version des Basisdokuments zuvor{" "}
            <b>von einer anderen Partei</b> erhalten und noch nicht editiert
            haben, wird nun eine neue Version erstellt. So kann nachverfolgt
            werden, welche Beiträge zu welchem Zeitpunkt hinzugefügt wurden.
          </p>

          <div className="flex flex-col gap-2 w-full">{children}</div>
        </div>
      </div>
    </>
  );
};
