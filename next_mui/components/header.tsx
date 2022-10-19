import DarkModeIcon from "@mui/icons-material/DarkMode";
import HomeIcon from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightMode";
import {
  AppBar,
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";

interface HeaderProps {
  isDarkTheme?: boolean;
  changeTheme: Function;
}

const Header: React.FC<HeaderProps> = ({ isDarkTheme, changeTheme }) => {
  return (
    <AppBar component="nav">
      <Container maxWidth="lg">
        <Toolbar variant="dense">
          <HomeIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component="a"
            href="/"
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
