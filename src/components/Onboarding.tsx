import { useState } from "react";
import { Button } from "./Button";
import { OnboardingSwiper } from "./OnboardingSwiper";


export const Onboarding = () => {

    const [onboarding, setOnboarding] = useState(false);

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
            <Button onClick={toggleOnboarding}>
                ?
            </Button>
            {onboarding && (
                <div>
                    <div className="w-screen h-screen  inset-0 fixed opacity-75  bg-darkGrey"
                        onClick={toggleOnboarding}>

                    </div>
                    <div
                        className="top-1/2 left-1/4 relative bg-white max-w-5xl min-w-4xl px-14 py-3 rounded" >

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