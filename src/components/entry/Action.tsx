import cx from "classnames";
import { useHeaderContext } from "../../contexts";
import { themeData } from "../../themes/theme-data";

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
  const {
    selectedTheme,
  } = useHeaderContext();
  const getTheme = (id: string) => {
    return themeData.find((theme) => {
      if (theme.id === id) {
        return true;
      } else {
        return false;
      }
    });
  };
  return (
    <div
      onClick={onClick}
      className={cx(
        "rounded-md p-1 cursor-pointer",
        {
          [`hover-bg-${getTheme(selectedTheme)?.primaryLeft}`]: isPlaintiff,
          [`hover-bg-${getTheme(selectedTheme)?.primaryRight}`]: !isPlaintiff,
        },
        className
      )}
      {...restProps}>
      {children}
    </div>
  );
};
