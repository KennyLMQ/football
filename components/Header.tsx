import DarkModeIcon from "@mui/icons-material/DarkMode";
import HomeIcon from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightMode";
import {
  AppBar,
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { useRouter } from "next/router";
import { useState } from "react";

import { NextLinkComposed } from "./Link";

interface HeaderProps {
  isDarkTheme?: boolean;
  changeTheme: Function;
}

const Header: React.FC<HeaderProps> = ({ isDarkTheme, changeTheme }) => {
  const { pathname } = useRouter();

  return (
    <AppBar component="nav">
      <Container maxWidth="lg">
        <Toolbar variant="dense">
          <HomeIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={NextLinkComposed}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Home
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch checked={isDarkTheme} onClick={() => changeTheme()} />
              }
              label={isDarkTheme ? <DarkModeIcon /> : <LightModeIcon />}
            />
          </FormGroup>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
