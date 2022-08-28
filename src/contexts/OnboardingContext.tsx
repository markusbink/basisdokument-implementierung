import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface IOnboardingContext {
  isOnboardingVisible: boolean;
  setIsOnboardingVisible: Dispatch<SetStateAction<boolean>>;
}

export const OnboardingContext = createContext<IOnboardingContext | null>(null);

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [isOnboardingVisible, setIsOnboardingVisible] = useState<boolean>(false);

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingVisible,
        setIsOnboardingVisible,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === null) {
    throw new Error("useContext must be used within an OnboardingProvider");
  }
  return context;
};
