import cx from "classnames";

interface EntryHeaderProps {
  isPlaintiff: boolean;
  isExpanded?: boolean;
  toggleBody?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
}

export const EntryHeader: React.FC<EntryHeaderProps> = ({
  isPlaintiff,
  isExpanded,
  toggleBody,
  children,
  className,
}) => {
  return (
    <div
      onClick={toggleBody}
      className={cx(
        "flex items-center justify-between rounded-t-lg px-6 py-3 cursor-pointer  select-none",
        {
          "bg-lightPurple text-darkPurple": isPlaintiff,
          "bg-lightPetrol text-darkPetrol": !isPlaintiff,
          "rounded-b-lg": !isExpanded,
        },
        className
      )}
    >
      {children}
    </div>
  );
};
