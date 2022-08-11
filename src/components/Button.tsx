interface ButtonProps {
  icon?: any;
  bgColor?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  icon,
  bgColor = "bg-darkGrey",
  textColor = "text-white",
  size = "md",
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center ${
        icon && "gap-3"
      } ${size} ${bgColor} ${textColor} ${disabled && "disabled"} font`}
    >
      <span>{icon}</span>
      {children}
    </button>
  );
};
