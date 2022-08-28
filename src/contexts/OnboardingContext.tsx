import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface IOnboardingContext {
  onboardingIsVisible: boolean;
  setOnboardingIsVisible: Dispatch<SetStateAction<boolean>>;
}

export const OnboardingContext = createContext<IOnboardingContext | null>(null);

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [onboardingIsVisible, setOnboardingIsVisible] = useState<boolean>(false);

  return (
    <OnboardingContext.Provider
      value={{
        onboardingIsVisible,
        setOnboardingIsVisible,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === null) {
    throw new Error("useHints must be used within an HintProvider");
  }
  return context;
};
