import cx from "classnames";

interface MetaDataBodyProps {
  isPlaintiff: boolean;
  children?: React.ReactNode;
}

export const MetaDataBody: React.FC<MetaDataBodyProps> = ({
  isPlaintiff,
  children,
}) => {
  return (
    <div
      className={cx("p-6 border-t", {
        "border-darkPurple/25": isPlaintiff,
        "border-darkPetrol/25": !isPlaintiff,
      })}
    >
      <p dangerouslySetInnerHTML={{ __html: children as string }}></p>
    </div>
  );
};
