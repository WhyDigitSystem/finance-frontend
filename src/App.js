import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import NavigationScroll from 'layout/NavigationScroll';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Routes from 'routes';
import themes from 'themes';

import SessionExpiredPopup from 'utils/SessionExpiredPopup';
import { handleSessionExpiration } from 'utils/sessionUtils';
import ToastComponent from './utils/toast-component';

const App = () => {
  const customization = useSelector((state) => state.customization);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Expose the handleSessionExpiration function globally
  window.handleSessionExpiration = () => handleSessionExpiration(setSessionExpired);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <Routes />
          <ToastComponent />
          {sessionExpired && <SessionExpiredPopup open={true} onClose={() => setSessionExpired(false)} />}
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
