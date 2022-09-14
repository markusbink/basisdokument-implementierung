interface OnboardingSwiperItemProps {
  imageSrc: string;
  //imageAlt: string;
  title: string;
  desc: string;
}

export const OnboardingSliderItem = ({
  imageSrc,
 //imageAlt,
  title,
  desc,
}: OnboardingSwiperItemProps) => {
  return (
    <div>
      <div className="bg-gradient-to-tr from-lightPetrol to-lightPurple lg:p-8 p-4">
        <video
        autoPlay
        loop
          className="overflow-hidden rounded-md shadow-xl w-full max-w-xl h-auto mx-auto"
          src={`${process.env.PUBLIC_URL}/${imageSrc}`}
          //alt={imageAlt}
        />
      </div>
      <div className="p-4 max-w-[800px] m-auto">
        <h3 className="leading-loose text-xl text-center text-darkGrey font-semibold mt-8 mb-2">
          {title}
        </h3>
        <p className="text-center text-mediumGrey">{desc}</p>
      </div>
    </div>
  );
};
