import parse from "html-react-parser";

interface OnboardingSwiperItemProps {
  src: string;
  title: string;
  desc: string;
  alt?: string;
}

enum MediaType {
  IMAGE,
  VIDEO
}

export const OnboardingSliderItem = ({
  src,
  title,
  desc,
  alt
}: OnboardingSwiperItemProps) => {

  const mediaType = src.split(".")[src.split(".").length - 1] === "png" ? MediaType.IMAGE : MediaType.VIDEO;

  return (
    <div>
      <div className="bg-gradient-to-tr from-lightPetrol to-lightPurple lg:p-8 p-4">
        {mediaType === MediaType.VIDEO ? (
          <video
            autoPlay
            loop
            muted
            className="overflow-hidden rounded-md shadow-xl w-full max-w-xl h-auto mx-auto pointer-events-none"
            src={`${process.env.PUBLIC_URL}/${src}`}
          />
        ) : (
          <img className="overflow-hidden w-full max-w-xl h-auto mx-auto"
            src={src}
            alt={alt} />
        )}
      </div>
      <div className="p-4 max-w-[800px] m-auto">
        <h3 className="leading-loose text-xl text-center text-darkGrey font-semibold mt-8 mb-2">
          {title}
        </h3>
        <p className="text-center text-mediumGrey">{parse(desc)}</p>
      </div>
    </div>
  );
};