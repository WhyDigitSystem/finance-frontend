import React, { useState } from 'react';
import ActionButton from 'utils/ActionButton'; // Assuming this is a custom button component
import { Box } from '@mui/material';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';

const FullScreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => { 
        setIsFullscreen(false);
      }).catch((err) => {
        console.error(`Error attempting to exit full-screen mode: ${err.message}`);
      });
    }
  };

  return (
    <Box display="inline-block">
      <ActionButton
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        icon={isFullscreen ? FullscreenExitOutlinedIcon : FullscreenOutlinedIcon}
        onClick={toggleFullScreen}
      />
    </Box>
  );
};
export default FullScreen;
