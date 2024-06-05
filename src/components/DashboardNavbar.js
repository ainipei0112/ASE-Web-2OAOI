import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
  Tooltip,
  Fade
} from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from './Logo';

const DashboardNavbar = ({ onMobileNavOpen }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <AppBar elevation={0} color="primary">
      <Toolbar>
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          title="跳轉到首頁"
          arrow
        >
          <RouterLink to="/app/chart">
            <Logo />
          </RouterLink>
        </Tooltip>
        <div style={{ flexGrow: 1 }} />
        {!isSmallScreen && (
          <>
            <IconButton color="inherit">
              <RouterLink to="/login">
                <InputIcon />
              </RouterLink>
            </IconButton>
          </>
        )}
        {isSmallScreen && (
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default DashboardNavbar;
