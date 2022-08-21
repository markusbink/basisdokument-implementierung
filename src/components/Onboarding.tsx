import { useState } from "react";
import { Button } from "./Button";
import { OnboardingSwiper } from "./OnboardingSwiper";

export const Onboarding = () => {

    const [onboarding, setOnboarding] = useState(true);

    const toggleOnboarding = () => {
        setOnboarding(!onboarding)
    }

    if (onboarding) {
        document.body.classList.add("overflow-y-hidden")
    } else {
        document.body.classList.remove('overflow-y-hidden')
    }
    return (
        <>
            {onboarding && (
                <div className="z-10 fixed container mx-auto my-3">
                    <div className="w-screen h-screen  inset-0 fixed opacity-75 bg-darkGrey"
                        onClick={toggleOnboarding}>
                    </div>
                    <div
                        className="container mx-auto my-3 relative bg-white max-w-5xl min-w-4xl px-14 py-3 rounded" >

                        <OnboardingSwiper></OnboardingSwiper>

                        <div className="flex justify-center">
                            <Button onClick={toggleOnboarding} size="sm">Loslegen</Button>
                        </div>
                    </div>
                </div>

            )}

        </>
    )
}