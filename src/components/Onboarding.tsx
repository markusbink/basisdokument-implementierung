import { useState } from "react";
import { Button } from "./Button";
import { OnboardingSwiper } from "./OnboardingSwiper";
import { XCircle } from "phosphor-react";

export const Onboarding = () => {
  const [isOnboardingVisible, setOnboarding] = useState(true);

  const toggleOnboarding = () => {
    setOnboarding(!isOnboardingVisible);
  };

  if (isOnboardingVisible) {
    document.body.classList.add("overflow-y-hidden");
  } else {
    document.body.classList.remove("overflow-y-hidden");
  }

  return (
    <>
      {isOnboardingVisible && (
        <div className="z-30 fixed">
          <div className="w-screen h-screen inset-0 fixed opacity-75 bg-darkGrey" />
          <div className="w-screen h-screen inset-0 fixed flex items-center justify-center p-4">
            <div className="relative bg-white max-w-5xl w-auto rounded-xl max-h-[750px] h-full overflow-hidden">
              <button
                className="absolute top-0 right-0 p-3 select-all z-10"
                onClick={toggleOnboarding}
              >
                <XCircle size={32} className="fill-darkGrey" weight="fill" />
              </button>
              <div className="h-full overflow-y-auto">
                <OnboardingSwiper />
                <div className="flex justify-center py-8">
                  <Button onClick={toggleOnboarding} size="sm">
                    Loslegen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
