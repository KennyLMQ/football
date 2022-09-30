import {
  AppBar,
  FormControlLabel,
  FormGroup,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface HeaderProps {
  isDarkTheme?: boolean;
  changeTheme: Function;
}

const Header: React.FC<HeaderProps> = ({ isDarkTheme, changeTheme }) => {
  return (
    <AppBar component="nav">
      <Container maxWidth="lg">
        <Toolbar variant="dense">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Home
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch checked={isDarkTheme} onClick={() => changeTheme()} />
              }
              label={isDarkTheme ? <DarkModeIcon/> : <LightModeIcon/>}
            />
          </FormGroup>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
