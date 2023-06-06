import { CaretDown, CaretUp, Envelope } from "phosphor-react";
import { useState } from "react";
import { AiFillGithub } from "react-icons/ai";

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
  const { setShowPatchnotesPopup } = usePatchnotes();
  
  return (
    <div>
      <div className="flex flex-row gap-2 justify-end">
          <div
            className="bg-offWhite p-2 rounded-md cursor-pointer hover:bg-lightGrey items-center"
            onClick={() => {setShowPatchnotesPopup(true)}}
          >
            <Notebook size={20} />
          </div>
        <div
          className="flex flex-row items-center justify-center gap-1 bg-offWhite p-2 rounded-md cursor-pointer hover:bg-lightGrey"
          onClick={() => {
            setShowDevelopersMenu(!showDevelopersMenu);
          }}
        >
          <span className="text-sm font-bold">Über das Projekt</span>
          {showDevelopersMenu ? <CaretUp size={12} className="text-darkGrey" weight="bold" /> : <CaretDown size={12} className="text-darkGrey" weight="bold" />}
        </div>
      </div>
      {showDevelopersMenu ? (
        <div className="w-full bg-offWhite rounded-md p-6 mt-2">
          <div className="pt-4 pb-6">
            <img
              onClick={() => window.open("https://www.uni-regensburg.de", "_blank")}
              className="hover:cursor-pointer h-16 text-darkGrey"
              src={`${process.env.PUBLIC_URL}/logos/universitaet-regensburg.svg`}
              alt="Logo der Universität Regensburg"
            />
          </div>
          <p className="text-darkGrey text-justify text-md">
            Im Rahmen des Projektseminars des Masterstudiengangs Medieninformatik der Fakultät für Informatik und Data Science an der Universität Regensburg wurde im Sommersemester 2022 das Konzept
            des Basisdokuments, das zur Strukturierung des Parteivortrags im Zivilprozess dient, weiterentwickelt. Geleitet wurde das Projekt von
            <span
              className="cursor-pointer hover:bg-lightGrey px-1 py-0.5 rounded-md"
              onClick={() => window.open("https://www.uni-regensburg.de/sprache-literatur-kultur/medieninformatik/sekretariat-team/christian-wolff/index.html", "_blank")}
            >
              Prof. Dr. Christian Wolff
            </span>
            .
          </p>
          <h2 className="font-bold text-md mt-4">Softwareentwickler:innen</h2>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2 mt-6">
            {developerData.map((developer, key) => (
              <div className="flex flex-row items-center gap-4 p-4 rounded-md" key={key}>
                <img className="rounded-full w-14 h-14" src={developer.githubImgUrl} alt={"Bild von " + developer.name} />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2">
                    <span className="font-bold text-base">{developer.name}</span>
                    <div className="flex flex-row items-center gap-1 p-1 rounded-md bg-darkGrey hover:bg-mediumGrey cursor-pointer" onClick={() => window.open(developer.githubUrl, "_blank")}>
                      <AiFillGithub size={14} color={"white"} />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-row items-center gap-1 p-1 rounded-md bg-gradient-to-r from-lightPetrol to-lightPurple hover:from-lightPetrol/50 hover:to-lightPurple/50 cursor-pointer">
                      <Envelope className="text-darkGrey" size={14} />
                      <span className="text-mediumGrey font-bold text-xs" onClick={() => window.open("mailto:" + developer.email)}>
                        {developer.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
