import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { IEvidence } from "../types";

interface IEvidenceContext {
  evidencesPlaintiff: (IEvidence | undefined)[];
  setEvidencesPlaintiff: Dispatch<SetStateAction<(IEvidence | undefined)[]>>;
  addNewEvidencePlaintiff: (evidence: IEvidence) => void;
  updateEvidencesPlaintiff: (evidence: IEvidence) => void;
  removeEvidencePlaintiff: (evidence: IEvidence) => void;
  evidencesDefendant:  (IEvidence | undefined)[];
  setEvidencesDefendant: Dispatch<SetStateAction<(IEvidence | undefined)[]>>;
  addNewEvidenceDefendant: (evidence: IEvidence) => void;
  updateEvidencesDefendant: (evidence: IEvidence) => void;
  removeEvidenceDefendant: (evidence: IEvidence) => void;
}

export const EvidenceContext = createContext<IEvidenceContext | null>(null);

interface EvidenceProviderProps {
  children: React.ReactNode;
}

export const EvidenceProvider: React.FC<EvidenceProviderProps> = ({
  children,
}) => {
  const [evidencesDefendant, setEvidencesDefendant] = useState<(IEvidence | undefined)[]>([]);
  const [evidencesPlaintiff, setEvidencesPlaintiff] = useState<(IEvidence | undefined)[]>([]);

  const addNewEvidenceDefendant = (evidence: IEvidence) => {
    let emptySpace = false;
    for (let i=0; i<evidencesDefendant.length; i++) {
        if (evidencesDefendant[i] === undefined) {
            // set initial attachmentId value
            evidence.attachmentId = "B" + (i + 1);
            evidencesDefendant[i] = evidence;
            emptySpace = true;
        }
    }
    if (emptySpace === false) {
      // set initial attachmentId value
      evidence.attachmentId = "B" + (evidencesDefendant.length + 1).toString();
      evidencesDefendant.push(evidence);
    }
  };

  const addNewEvidencePlaintiff = (evidence: IEvidence) => {
    let emptySpace = false;
    for (let i=0; i<evidencesPlaintiff.length; i++) {
        if (evidencesPlaintiff[i] === undefined) {
            // set initial attachmentId value
            evidence.attachmentId = "K" + (i + 1);
            evidencesPlaintiff[i] = evidence;
            emptySpace = true;
        }
    }
    if (emptySpace === false) {
      // set initial attachmentId value
      evidence.attachmentId = "K" + (evidencesPlaintiff.length + 1).toString();
      evidencesPlaintiff.push(evidence);
    }
  };

  const updateEvidencesDefendant = (evidence: IEvidence) => {
    setEvidencesDefendant(
      evidencesDefendant.map((e) => (e!.id === evidence.id ? evidence : e))
    );
  };

  const updateEvidencesPlaintiff = (evidence: IEvidence) => {
    setEvidencesPlaintiff(
      evidencesPlaintiff.map((e) => (e!.id === evidence.id ? evidence : e))
    );
  };

  const removeEvidenceDefendant = (evidence: IEvidence) => {
    setEvidencesDefendant(
        evidencesDefendant.map((e) => (e!.id === evidence.id ? undefined : e))
    );
    removeLast(evidencesDefendant);
  }

  const removeEvidencePlaintiff = (evidence: IEvidence) => {
    setEvidencesPlaintiff(
        evidencesPlaintiff.map((e) => (e!.id === evidence.id ? undefined : e))
    );
    removeLast(evidencesPlaintiff);
  }

  const removeLast = (evidences: (IEvidence | undefined)[]) => {
    if (evidences[evidences.length - 1] === undefined) {
        evidences.pop();
    }
  };

  return (
    <EvidenceContext.Provider
      value={{
        evidencesDefendant,
        setEvidencesDefendant,
        addNewEvidenceDefendant,
        updateEvidencesDefendant,
        removeEvidenceDefendant,
        evidencesPlaintiff,
        setEvidencesPlaintiff,
        addNewEvidencePlaintiff,
        updateEvidencesPlaintiff,
        removeEvidencePlaintiff,
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
