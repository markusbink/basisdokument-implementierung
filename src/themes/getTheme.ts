import { themeData } from "./theme-data";

export const getTheme = (id: string) => {
  return themeData.find((theme) => {
    if (theme.id === id) {
      return true;
    } else {
      return false;
    }
  });
};
