import { themeData } from "./theme-data";

export const getTheme = (id: string) => {
  return themeData.find((theme) => theme.id === id);
};
