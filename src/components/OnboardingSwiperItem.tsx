interface OnboardingSliderItemProps {
    imageSrc: string;
    imageAlt: string;
    title: string;
    desc: string;
};

export const OnboardingSliderItem = ({ imageSrc, imageAlt, title, desc }: OnboardingSliderItemProps) => {

    return (
        <div>
            <img className="px-10 w-auto h-auto flex item-center drop-shadow-xl"
                src={imageSrc}
                alt={imageAlt}>
            </img>
            <h1 className="leading-loose pt-5 text-xl font-bold text-center">{title}</h1>
            <p className="text-justify p-3">{desc}</p>
        </div>
    );
}