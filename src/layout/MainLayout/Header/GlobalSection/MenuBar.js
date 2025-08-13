import React, { useState, useRef } from 'react';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ActionButton from 'utils/ActionButton';
import Transitions from 'ui-component/extended/Transitions';
import { useTheme } from '@mui/material/styles';
import { Box, Paper, Popper, useMediaQuery, Grid, IconButton, Tooltip, Dialog } from '@mui/material';
import { FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const apps = [
  {
    id: 'ocr',
    title: 'OCR',
    type: 'group',
    url: '/Finance/Tools/OCR',
    icon: FiFileText
  }
];

const MenuBar = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const [showMenu, setShowMenu] = useState(false);
  const anchorRef = useRef(null);
  const navigate = useNavigate();

  const handleMenuList = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    <Box>
      {/* Action Button */}
      <Box ref={anchorRef} display="inline-block">
        <ActionButton title="Menu List" icon={MenuOutlinedIcon} onClick={handleMenuList} />
      </Box>

      {/* Popper Dropdown */}
      <Popper
        open={showMenu}
        anchorEl={anchorRef.current}
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        transition
        disablePortal
        popperOptions={{
          modifiers: [{ name: 'offset', options: { offset: [0, 10] } }]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={showMenu} {...TransitionProps} position={matchesXs ? 'top' : 'top-right'}>
            <Paper sx={{ width: 360, p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Grid container spacing={2}>
                {apps.map((app) => {
                  const Icon = app.icon;
                  return (
                    <Grid item xs={3} key={app.id} textAlign="center">
                      <Tooltip title={app.title} arrow>
                        <IconButton
                          onClick={() => {
                            navigate(app.url);
                            setShowMenu(false);
                          }}
                          sx={{ display: 'flex', flexDirection: 'column', p: 1 }}
                        >
                          <Icon size={30} color="green" />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default MenuBar;
