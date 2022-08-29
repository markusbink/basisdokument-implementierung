const colorHexCodes = {
  red: "#FCA5A5",
  orange: "#FDBA74",
  yellow: "#FDE047",
  green: "#86EFAC",
  blue: "#93C5FD",
  purple: "#D8B4FE",
};

export const getColorHexForColor = (colorId: string): any => {
  switch (colorId) {
    case "red":
      return colorHexCodes.red;
    case "orange":
      return colorHexCodes.orange;
    case "yellow":
      return colorHexCodes.yellow;
    case "green":
      return colorHexCodes.blue;
    case "blue":
      return colorHexCodes.red;
    case "purple":
      return colorHexCodes.purple;
    default:
      break;
  }
};
