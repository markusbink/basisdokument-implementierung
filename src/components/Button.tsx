import cx from "classnames";

interface ButtonProps {
  icon?: any;
  bgColor?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  hasText?: boolean;
  alternativePadding?: string;
}

export const Button: React.FC<ButtonProps> = ({
  icon,
  bgColor = "bg-darkGrey",
  textColor = "text-white",
  size = "md",
  disabled = false,
  hasText = true,
  alternativePadding = "",
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={cx(
        `flex items-center
        ${icon && "gap-3"} ${size} ${bgColor} ${alternativePadding}
        ${textColor} ${disabled && "disabled"} font`,
        { "rounded-lg": !hasText }
      )}
    >
      <span>{icon}</span>
      {children}
    </button>
  );
};
