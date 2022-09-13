import cx from "classnames";
import { useHeaderContext } from "../../contexts";
import { getTheme } from "../../themes/getTheme";

interface EntryHeaderProps {
  isPlaintiff: boolean;
  isBodyOpen?: boolean;
  toggleBody?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
}

export const EntryHeader: React.FC<EntryHeaderProps> = ({
  isPlaintiff,
  isBodyOpen,
  toggleBody,
  children,
  className,
}) => {
  const {
    selectedTheme,
  } = useHeaderContext();
  return (
    <div
      onClick={toggleBody}
      className={cx(
        "flex items-center justify-between rounded-t-lg px-6 py-3 cursor-pointer  select-none",
        {
          [`bg-${getTheme(selectedTheme)?.secondaryLeft} text-${getTheme(selectedTheme)?.primaryLeft}`]: isPlaintiff,
          [`bg-${getTheme(selectedTheme)?.secondaryRight} text-${getTheme(selectedTheme)?.primaryRight}`]: !isPlaintiff,
          "rounded-b-lg": !isBodyOpen,
        },
        className
      )}
    >
      {children}
    </div>
  );
};
