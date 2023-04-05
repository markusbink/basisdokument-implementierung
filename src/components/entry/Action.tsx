import cx from "classnames";
import { useHeaderContext } from "../../contexts";
import { getTheme } from "../../themes/getTheme";

interface ActionProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: (e: React.MouseEvent) => void;
  isPlaintiff: boolean;
  children: React.ReactNode;
}

export const Action: React.FC<ActionProps> = ({
  onClick,
  isPlaintiff,
  children,
  className,
  ...restProps
}) => {
  const { selectedTheme } = useHeaderContext();
  return (
    <div
      onClick={onClick}
      className={cx(
        "rounded-md p-1 cursor-pointer",
        {
          [`hover-bg-${getTheme(selectedTheme)?.primaryPlaintiff} hover-text-${
            getTheme(selectedTheme)?.secondaryPlaintiff
          }`]: isPlaintiff,
          [`hover-bg-${getTheme(selectedTheme)?.primaryDefendant} hover-text-${
            getTheme(selectedTheme)?.secondaryDefendant
          }`]: !isPlaintiff,
        },
        className
      )}
      {...restProps}>
      {children}
    </div>
  );
};
