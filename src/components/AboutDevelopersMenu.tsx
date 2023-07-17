import { CaretDown, CaretUp, Envelope, Info, Notebook } from "phosphor-react";
import { useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { Tooltip } from "./Tooltip";
import { useImprint, usePatchnotes } from "../contexts";

const studentData2021 = [
  {
    group: "Entwicklungsteam Richter:innen",
    names: "Sebastian Hahn, Isabell Röhr, Marie Sautmann",
  },
  {
    group: "Enticklungsteam Anwält:innen",
    names: "Sabrina Freisleben, Sebastian Schwarz, Tobias Zels",
  },
];

const developerData2022 = [
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

const developerData2023 = [
  {
    name: "Martina Emmert",
    email: "Martina.Emmert@student.ur.de",
    githubUrl: "https://github.com/tina-e",
    githubImgUrl: "https://avatars.githubusercontent.com/u/53038141?v=4",
  },
  {
    name: "Julia Sageder",
    email: "Julia.Sageder@informatik.uni-regensburg.de",
    githubUrl: "https://github.com/JuliaSageder",
    githubImgUrl: "https://avatars.githubusercontent.com/u/126691623?v=4",
  },
];

export const AboutDevelopersMenu = () => {
  const [showDevelopersMenu, setShowDevelopersMenu] = useState<boolean>(false);
  const [showStudents2021, setShowStudents2021] = useState<boolean>(false);
  const [showDevelopers2022, setShowDevelopers2022] = useState<boolean>(false);
  const [showDevelopers2023, setShowDevelopers2023] = useState<boolean>(false);
  const { setShowPatchnotesPopup } = usePatchnotes();
  const { setShowImprintPopup } = useImprint();

  return (
    <div>
      <div className="flex flex-row gap-2 justify-end">
        <Tooltip text="Impressum">
          <div
            className="bg-offWhite p-2 rounded-md cursor-pointer hover:bg-lightGrey items-center"
            onClick={() => {
              setShowImprintPopup(true);
            }}>
            <Info size={20} />
          </div>
        </Tooltip>
        <Tooltip text="Was gibt es Neues?">
          <div
            className="bg-offWhite p-2 rounded-md cursor-pointer hover:bg-lightGrey items-center"
            onClick={() => {
              setShowPatchnotesPopup(true);
            }}>
            <Notebook size={20} />
          </div>
        </Tooltip>
        <div
          className="flex flex-row items-center justify-center gap-1 bg-offWhite p-2 rounded-md cursor-pointer hover:bg-lightGrey"
          onClick={() => {
            setShowDevelopersMenu(!showDevelopersMenu);
          }}>
          <span className="text-sm font-bold">Über das Projekt</span>
          {showDevelopersMenu ? (
            <CaretUp size={12} className="text-darkGrey" weight="bold" />
          ) : (
            <CaretDown size={12} className="text-darkGrey" weight="bold" />
          )}
        </div>
      </div>
      {showDevelopersMenu ? (
        <div className="w-full bg-offWhite rounded-md p-6 mt-2">
          <div className="pt-4 pb-6">
            <img
              onClick={() =>
                window.open("https://www.uni-regensburg.de", "_blank")
              }
              className="hover:cursor-pointer h-16 text-darkGrey"
              src={`${process.env.PUBLIC_URL}/logos/universitaet-regensburg.svg`}
              alt="Logo der Universität Regensburg"
            />
          </div>
          <p className="text-darkGrey text-justify text-md">
            <h3>Strukturvorhaben für den Parteivortrag im Zivilprozess</h3>
            Das gemeinsam von den Justizministerien Bayerns und Niedersachsens
            mit den Lehrstühlen für{" "}
            <a
              href="https://www.uni-regensburg.de/rechtswissenschaft/buergerliches-recht/althammer/aktuelles/index.html"
              target="_blank"
              rel="noreferrer">
              Deutsches Verfahrensrecht (Prof. Dr. Althammer)
            </a>{" "}
            und für{" "}
            <a
              href="https://www.uni-regensburg.de/sprache-literatur-kultur/medieninformatik/medieninformatik/index.html"
              target="_blank"
              rel="noreferrer">
              Medieninformatik (Prof. Dr. Wolff)
            </a>{" "}
            der Universität Regensburg durchgeführte Projekt dient der Gewinnung
            von Erkenntnissen über die digitalen Möglichkeiten einer formellen
            Strukturierung des Parteivortrags im Zivilprozess.
            <br />
            <br />
            Weitere Informationen zum Projekt finden Sie unter:{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.uni-regensburg.de/forschung/reallabor-informationen/informationen-reallabor/informationen-reallabor/index.html">
              www.parteivortrag.de
            </a>
          </p>
          <div
            className="flex flex-row items-center gap-1 rounded-md cursor-pointer mt-4"
            onClick={() => {
              setShowStudents2021(!showStudents2021);
            }}>
            <h2 className="text-md font-bold">Entwicklungsteams 2021</h2>
            {showStudents2021 ? (
              <CaretUp size={12} className="text-darkGrey" weight="bold" />
            ) : (
              <CaretDown size={12} className="text-darkGrey" weight="bold" />
            )}
          </div>
          {showStudents2021 && (
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 mt-2">
              {studentData2021.map((students, key) => (
                <div
                  className="flex flex-row items-center gap-4 p-4 rounded-md"
                  key={key}>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                      <span className="font-bold text-base">
                        {students.group}
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span className="text-base">{students.names}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            className="flex flex-row items-center gap-1 rounded-md cursor-pointer mt-4"
            onClick={() => {
              setShowDevelopers2022(!showDevelopers2022);
            }}>
            <h2 className="text-md font-bold">Softwareentwickler:innen 2022</h2>
            {showDevelopers2022 ? (
              <CaretUp size={12} className="text-darkGrey" weight="bold" />
            ) : (
              <CaretDown size={12} className="text-darkGrey" weight="bold" />
            )}
          </div>
          {showDevelopers2022 && (
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 mt-2">
              {developerData2022.map((developer, key) => (
                <div
                  className="flex flex-row items-center gap-4 p-4 rounded-md"
                  key={key}>
                  <img
                    className="rounded-full w-14 h-14"
                    src={developer.githubImgUrl}
                    alt={"Bild von " + developer.name}
                  />
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                      <span className="font-bold text-base">
                        {developer.name}
                      </span>
                      <div
                        className="flex flex-row items-center gap-1 p-1 rounded-md bg-darkGrey hover:bg-mediumGrey cursor-pointer"
                        onClick={() =>
                          window.open(developer.githubUrl, "_blank")
                        }>
                        <AiFillGithub size={14} color={"white"} />
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-row items-center gap-1 p-1 rounded-md bg-gradient-to-r from-lightPetrol to-lightPurple hover:from-lightPetrol/50 hover:to-lightPurple/50 cursor-pointer">
                        <Envelope className="text-darkGrey" size={14} />
                        <span
                          className="text-mediumGrey font-bold text-xs"
                          onClick={() =>
                            window.open("mailto:" + developer.email)
                          }>
                          {developer.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            className="flex flex-row items-center gap-1 rounded-md cursor-pointer mt-4"
            onClick={() => {
              setShowDevelopers2023(!showDevelopers2023);
            }}>
            <h2 className="text-md font-bold">Softwareentwickler:innen 2023</h2>
            {showDevelopers2023 ? (
              <CaretUp size={12} className="text-darkGrey" weight="bold" />
            ) : (
              <CaretDown size={12} className="text-darkGrey" weight="bold" />
            )}
          </div>
          {showDevelopers2023 && (
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 mt-2">
              {developerData2023.map((developer, key) => (
                <div
                  className="flex flex-row items-center gap-4 p-4 rounded-md"
                  key={key}>
                  <img
                    className="rounded-full w-14 h-14"
                    src={developer.githubImgUrl}
                    alt={"Bild von " + developer.name}
                  />
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                      <span className="font-bold text-base">
                        {developer.name}
                      </span>
                      <div
                        className="flex flex-row items-center gap-1 p-1 rounded-md bg-darkGrey hover:bg-mediumGrey cursor-pointer"
                        onClick={() =>
                          window.open(developer.githubUrl, "_blank")
                        }>
                        <AiFillGithub size={14} color={"white"} />
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-row items-center gap-1 p-1 rounded-md bg-gradient-to-r from-lightPetrol to-lightPurple hover:from-lightPetrol/50 hover:to-lightPurple/50 cursor-pointer">
                        <Envelope className="text-darkGrey" size={14} />
                        <span
                          className="text-mediumGrey font-bold text-xs"
                          onClick={() =>
                            window.open("mailto:" + developer.email)
                          }>
                          {developer.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
