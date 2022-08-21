import cx from "classnames";

interface EntryBodyProps {
  isPlaintiff: boolean;
  children: React.ReactNode;
}

export const EntryBody: React.FC<EntryBodyProps> = ({
  isPlaintiff,
  children,
}) => {
  return (
    <div
      className={cx("p-6 bg-white rounded-b-lg border border-t-0", {
        "border-lightPurple": isPlaintiff,
        "border-lightPetrol": !isPlaintiff,
      })}
    >
      <p dangerouslySetInnerHTML={{ __html: children as string }}></p>
    </div>
  );
};
