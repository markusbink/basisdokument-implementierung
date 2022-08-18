/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        'width': 'width'
      }
    },
    colors: {
      white: "#fff",
      offWhite: "#F5F5F5",
      lightGrey: "#E4E4E4",
      mediumGrey: "#565656",
      darkGrey: "#3A4342",
      black: "#000",
      darkPurple: "#3F3F67",
      lightPurple: "#DDDDE6",
      darkPetrol: "#375C62",
      lightPetrol: "#C2E3E9",
      vibrantRed: "#FF3939",
      darkRed: "#810000",
      lightRed: "#FFEDED",
      darkOrange: "#894200",
      lightOrange: "#FFF1E3",
      vibrantGreen: "#64E08E",
      darkGreen: "#007552",
      lightGreen: "#E6EAD5",
      marker: {
        red: "#FCA5A5",
        orange: "#FDBA74",
        yellow: "#FDE047",
        green: "#86EFAC",
        blue: "#93C5FD",
        purple: "#D8B4FE",
      },
    },
  },
  plugins: [],
};
