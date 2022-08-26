import { CaretDown, CaretUp } from "phosphor-react";
import { useState } from "react";

const developerData = [
  {
    name: "Markus Bink",
    email: "Markus.Bink@student.ur.de",
    githubUrl: "https://github.com/markusbink",
    githubImgUrl: "https://avatars.githubusercontent.com/u/12990702?v=4",
  },
  {
    name: "Martina Emmert",
    email: "Martina.Emmert@student.ur.de",
    githubUrl: "https://github.com/tina-e",
    githubImgUrl: "https://avatars.githubusercontent.com/u/53038141?v=4",
  },
  {
    name: "Nils Constantin Hellwig",
    email: "Nils-Constantin.Hellwig@student.ur.de",
    githubUrl: "https://github.com/NilsHellwig",
    githubImgUrl: "https://avatars2.githubusercontent.com/u/44339207?s=60&v=4",
  },
  {
    name: "Michelle Lanzinger",
    email: "Michelle.Lanzinger@student.ur.de",
    githubUrl: "https://github.com/MichelleLanzinger",
    githubImgUrl: "https://avatars.githubusercontent.com/u/42041831?v=4",
  },
  {
    name: "Nicole Schönwerth",
    email: "Nicole.Schoenwerth@student.ur.de",
    githubUrl: "https://github.com/NiciSc",
    githubImgUrl: "https://avatars.githubusercontent.com/u/40839111?v=4",
  },
];

export const AboutDevelopersMenu = () => {
  const [showDevelopersMenu, setShowDevelopersMenu] = useState<boolean>(false);
  return (
    <div className="flex flex-col">
      <div className="flex justify-end w-full">
        <div
          className="flex flex-row items-center justify-center gap-1 bg-offWhite p-2 rounded-md cursor-pointer hover:bg-lightGrey"
          onClick={() => {
            setShowDevelopersMenu(!showDevelopersMenu);
          }}
        >
          <span className="text-sm font-bold">Über die Entwickler</span>
          {showDevelopersMenu ? <CaretUp size={12} className="text-darkGrey" weight="bold" /> : <CaretDown size={12} className="text-darkGrey" weight="bold" />}
        </div>
      </div>
      {showDevelopersMenu ? (
        <div className="w-full bg-offWhite rounded-md p-6 mt-2">
          <p className="text-darkGrey text-justify text-md">
            Im Rahmen des Projektseminars des Masterstudiengangs Medieninformatik an der Universität Regensburg wurde im Sommersemester 2022 das Konzept des Basisdokuments, das zur Strukturierung des
            Parteivortrags im Zivilprozess dient, weiterentwickelt. Geleitet wurde das Projekt von
            <span
              className="cursor-pointer hover:bg-lightGrey px-1 py-0.5 rounded-md"
              onClick={() => window.open("https://www.uni-regensburg.de/sprache-literatur-kultur/medieninformatik/sekretariat-team/christian-wolff/index.html", "_blank")}
            >
              Prof. Dr. Christian Wolff
            </span>
            .
          </p>
          <h2 className="font-bold text-md mt-4">Softwareentwickler:innen</h2>
          <div className="grid grid-cols-2 gap-2 mt-6">
            {developerData.map((developer) => (
              <div className="flex flex-row items-center gap-4 hover:bg-lightGrey p-4 rounded-md cursor-pointer" onClick={() => window.open(developer.githubUrl, "_blank")}>
                <img className="rounded-full w-16 h-26" src={developer.githubImgUrl} alt={"Bild von " + developer.name} />
                <div className="flex flex-col">
                  <span className="font-bold text-md">{developer.name}</span>
                  <span className="text-mediumGrey">{developer.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
