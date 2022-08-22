import { useState } from "react";
import { Button } from "./Button";
import { OnboardingSwiper } from "./OnboardingSwiper";

export const Onboarding = () => {

    const [isOnboardingVisible, setOnboarding] = useState(true);

    const toggleOnboarding = () => {
        setOnboarding(!isOnboardingVisible)
    }

    if (isOnboardingVisible) {
        document.body.classList.add("overflow-y-hidden")
    } else {
        document.body.classList.remove('overflow-y-hidden')
    }
    return (
        <>
            {isOnboardingVisible && (
                <div className="z-10 fixed">
                    <div className="w-screen h-screen  inset-0 fixed opacity-75 bg-darkGrey"
                        onClick={toggleOnboarding}>
                    </div>

                    <div
                        className="container mx-auto my-3 relative bg-white max-w-5xl min-w-4xl px-14 py-3 rounded">
                        <button className="absolute top-0 right-0 p-3 select-all" onClick={toggleOnboarding}><img src="/closeIcon.png" alt="close Button" className="rounded-full w-8 h-8"/></button>

                        <OnboardingSwiper />

                        <div className="flex justify-center">
                            <Button onClick={toggleOnboarding} size="sm">Loslegen</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}