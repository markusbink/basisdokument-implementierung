import cx from "classnames";

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
  return (
    <div
      onClick={onClick}
      className={cx(
        "rounded-md p-1 cursor-pointer",
        {
          "hover:bg-darkPurple hover:text-lightPurple": isPlaintiff,
          "hover:bg-darkPetrol hover:text-lightPetrol": !isPlaintiff,
        },
        className
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};
