import { createTheme, Theme } from "@mui/material/styles";

import { roboto } from "./roboto";

export function createLightTheme(): Theme {
  return createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#88c0d0",
      },
      secondary: {
        main: "#81A1C1",
      },
      error: {
        main: "#BF616A",
      },
      warning: {
        main: "#EBCB8B",
      },
      success: {
        main: "#A3BE8C",
      },
      info: {
        main: "#5E81AC",
      },
      background: {
        default: "#eceff4",
        paper: "#d8dee9",
      },
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
  });
}

export default createLightTheme();
