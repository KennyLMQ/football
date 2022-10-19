import { createTheme, Theme } from "@mui/material/styles";

export function createDarkTheme(): Theme {
  return createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#88C0D0",
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
        default: "#2E3440",
        paper: "#3B4252",
      },
    },
  });
}

export default createDarkTheme();
