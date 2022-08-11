import { ReactNode } from "react";

interface MainProps {
  children: ReactNode;
}

export const Main: React.FC<MainProps> = ({ children }) => {
  return <main>{children}</main>;
};
