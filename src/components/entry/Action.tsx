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
          [`hover-bg-${getTheme(selectedTheme)?.primaryLeft} hover-text-${
            getTheme(selectedTheme)?.secondaryLeft
          }`]: isPlaintiff,
          [`hover-bg-${getTheme(selectedTheme)?.primaryRight} hover-text-${
            getTheme(selectedTheme)?.secondaryLeft
          }`]: !isPlaintiff,
        },
        className
      )}
      {...restProps}>
      {children}
    </div>
  );
};
