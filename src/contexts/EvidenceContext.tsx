import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { IEvidence } from "../types";

interface IEvidenceContext {
  evidenceList: IEvidence[];
  setEvidenceList: React.Dispatch<React.SetStateAction<IEvidence[]>>;
  updateEvidenceList: (evidence: IEvidence) => void;
  removeFromEvidenceList: (evidenceId: string) => void;
  evidenceIdsPlaintiff: (string | undefined)[];
  setEvidenceIdsPlaintiff: Dispatch<SetStateAction<(string | undefined)[]>>;
  addNewEvidenceIdPlaintiff: (evidence: IEvidence) => void;
  updateEvidenceIdsPlaintiff: (evidenceId: string) => void;
  removeEvidenceIdPlaintiff: (evidenceId: string) => void;
  evidenceIdsDefendant: (string | undefined)[];
  setEvidenceIdsDefendant: Dispatch<SetStateAction<(string | undefined)[]>>;
  addNewEvidenceIdDefendant: (evidence: IEvidence) => void;
  updateEvidenceIdsDefendant: (evidenceId: string) => void;
  removeEvidenceIdDefendant: (evidenceId: string) => void;
}

export const EvidenceContext = createContext<IEvidenceContext | null>(null);

interface EvidenceProviderProps {
  children: React.ReactNode;
}

export const EvidenceProvider: React.FC<EvidenceProviderProps> = ({
  children,
}) => {
  const [evidenceList, setEvidenceList] = useState<IEvidence[]>([]);
  const [evidenceIdsDefendant, setEvidenceIdsDefendant] = useState<
    (string | undefined)[]
  >([]);
  const [evidenceIdsPlaintiff, setEvidenceIdsPlaintiff] = useState<
    (string | undefined)[]
  >([]);

  const addNewEvidenceIdDefendant = (evidence: IEvidence) => {
    let emptySpace = false;
    for (let i = 0; i < evidenceIdsDefendant.length; i++) {
      if (evidenceIdsDefendant[i] === undefined) {
        // set initial attachmentId value
        evidence.attachmentId = "B" + (i + 1);
        evidenceIdsDefendant[i] = evidence.id;
        emptySpace = true;
      }
    }
    if (emptySpace === false) {
      // set initial attachmentId value
      evidence.attachmentId =
        "B" + (evidenceIdsDefendant.length + 1).toString();
      evidenceIdsDefendant.push(evidence.id);
    }
    updateEvidenceList(evidence);
  };

  const addNewEvidenceIdPlaintiff = (evidence: IEvidence) => {
    let emptySpace = false;
    for (let i = 0; i < evidenceIdsPlaintiff.length; i++) {
      if (evidenceIdsPlaintiff[i] === undefined) {
        // set initial attachmentId value
        evidence.attachmentId = "K" + (i + 1);
        evidenceIdsPlaintiff[i] = evidence.id;
        emptySpace = true;
      }
    }
    if (emptySpace === false) {
      // set initial attachmentId value
      evidence.attachmentId =
        "K" + (evidenceIdsPlaintiff.length + 1).toString();
      evidenceIdsPlaintiff.push(evidence.id);
    }
    updateEvidenceList(evidence);
  };

  const updateEvidenceList = (evidence: IEvidence) => {
    let updatedEvidences: IEvidence[] = [];
    let evidenceUpdated: boolean = false;
    for (let i = 0; i < evidenceList.length; i++) {
      if (evidenceList[i].id === evidence.id) {
        updatedEvidences.push(evidence);
        evidenceUpdated = true;
      } else {
        updatedEvidences.push(evidenceList[i]);
      }
    }
    if (evidenceUpdated === false) {
      updatedEvidences.push(evidence);
    }
    setEvidenceList(updatedEvidences);
  };

  const removeFromEvidenceList = (evidenceId: string) => {
    setEvidenceList(evidenceList.filter((ev) => ev.id !== evidenceId));
  };

  const updateEvidenceIdsDefendant = (evidenceId: string) => {
    setEvidenceIdsDefendant(
      evidenceIdsDefendant.map((evId) =>
        evId === evidenceId ? evidenceId : evId
      )
    );
  };

  const updateEvidenceIdsPlaintiff = (evidenceId: string) => {
    setEvidenceIdsPlaintiff(
      evidenceIdsPlaintiff.map((evId) =>
        evId === evidenceId ? evidenceId : evId
      )
    );
  };

  const removeEvidenceIdDefendant = (evidenceId: string) => {
    setEvidenceIdsDefendant(
      evidenceIdsDefendant.map((evId) =>
        evId === evidenceId ? undefined : evId
      )
    );
    removeLast(evidenceIdsDefendant);
  };

  const removeEvidenceIdPlaintiff = (evidenceId: string) => {
    setEvidenceIdsPlaintiff(
      evidenceIdsPlaintiff.map((evId) =>
        evId === evidenceId ? undefined : evId
      )
    );
    removeLast(evidenceIdsPlaintiff);
  };

  const removeLast = (evidenceIds: (string | undefined)[]) => {
    if (evidenceIds[evidenceIds.length - 1] === undefined) {
      evidenceIds.pop();
    }
  };

  return (
    <EvidenceContext.Provider
      value={{
        evidenceList,
        setEvidenceList,
        updateEvidenceList,
        removeFromEvidenceList,
        evidenceIdsDefendant,
        setEvidenceIdsDefendant,
        addNewEvidenceIdDefendant,
        updateEvidenceIdsDefendant,
        removeEvidenceIdDefendant,
        evidenceIdsPlaintiff,
        setEvidenceIdsPlaintiff,
        addNewEvidenceIdPlaintiff,
        updateEvidenceIdsPlaintiff,
        removeEvidenceIdPlaintiff,
      }}>
      {children}
    </EvidenceContext.Provider>
  );
};

export const useEvidence = () => {
  const context = useContext(EvidenceContext);
  if (context === null) {
    throw new Error("useEvidence must be used within a EvidenceProvider");
  }
  return context;
};
