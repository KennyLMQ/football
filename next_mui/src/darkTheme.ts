import { createTheme, Theme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export function createDarkTheme(): Theme {
  return createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#556cd6",
      },
      secondary: {
        main: "#19857b",
      },
      error: {
        main: red.A400,
      },
    },
  });
}

export default createDarkTheme();
