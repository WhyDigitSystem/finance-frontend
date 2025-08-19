// import React, { useState, useRef } from 'react';
// import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
// import ActionButton from 'utils/ActionButton';
// import Transitions from 'ui-component/extended/Transitions';
// import { useTheme } from '@mui/material/styles';
// import { Box, Paper, Popper, useMediaQuery, Grid, IconButton, Tooltip, ClickAwayListener } from '@mui/material';
// // import { FiFileText } from 'react-icons/fi';
// import OCR from '../../../../assets/images/ocr.png';
// // import { IoMdMail } from 'react-icons/io';
// import Email from '../../../../assets/images/email.png';
// import { useNavigate } from 'react-router-dom';

// const apps = [
//   {
//     id: 'ocr',
//     title: 'OCR',
//     type: 'group',
//     url: '/Finance/Tools/OCR',
//     icon: OCR
//   },
//   {
//     id: 'sendemail',
//     title: 'Email',
//     type: 'group',
//     url: '/Finance/Tools/SendEmail',
//     icon: Email
//   }
// ];

// const MenuBar = () => {
//   const theme = useTheme();
//   const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
//   const [showMenu, setShowMenu] = useState(false);
//   const anchorRef = useRef(null);
//   const navigate = useNavigate();

//   return (
//     <Box>
//       {/* Action Button */}
//       {/* <Box ref={anchorRef} display="inline-block">
//         <ActionButton title="Menu List" icon={MenuOutlinedIcon} onClick={handleMenuList} />
//       </Box> */}

//       <Box ref={anchorRef} display="inline-block">
//         <ActionButton title="Menu List" icon={MenuOutlinedIcon} />
//       </Box>

//       {/* Popper Dropdown */}
//       <Popper
//         open={showMenu}
//         anchorEl={anchorRef.current}
//         placement={matchesXs ? 'bottom' : 'bottom-end'}
//         transition
//         disablePortal
//         popperOptions={{
//           modifiers: [{ name: 'offset', options: { offset: [0, 10] } }]
//         }}
//       >
//         {({ TransitionProps }) => (
//           <Transitions in={showMenu} {...TransitionProps} position={matchesXs ? 'top' : 'top-right'}>
//             <Paper sx={{ width: 360, p: 1, borderRadius: 2, boxShadow: 3 }}>
//               <Grid container spacing={2}>
//                 {apps.map((app) => {
//                   const Icon = app.icon;
//                   return (
//                     <Grid item xs={2} key={app.id} textAlign="center">
//                       <Tooltip title={app.title} arrow>
//                         <IconButton
//                           onClick={() => {
//                             navigate(app.url);
//                             setShowMenu(false);
//                           }}
//                           sx={{ display: 'flex', flexDirection: 'column', p: 1 }}
//                         >
//                           {/* <Icon size={30} color="green" /> */}
//                           {typeof Icon === 'string' ? (
//                             <img src={Icon} alt={app.title} width={30} height={30} />
//                           ) : (
//                             <Icon size={30} color="green" />
//                           )}
//                         </IconButton>
//                       </Tooltip>
//                     </Grid>
//                   );
//                 })}
//               </Grid>
//             </Paper>
//           </Transitions>
//         )}
//       </Popper>
//     </Box>
//   );
// };

// export default MenuBar;

import React, { useState, useRef } from 'react';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ActionButton from 'utils/ActionButton';
import Transitions from 'ui-component/extended/Transitions';
import { useTheme } from '@mui/material/styles';
import { Box, Paper, Popper, useMediaQuery, Grid, IconButton, Tooltip, ClickAwayListener } from '@mui/material';
import OCR from '../../../../assets/images/ocr.png';
import Email from '../../../../assets/images/email.png';
import { useNavigate } from 'react-router-dom';
import { LinearGradient } from '@react-pdf/renderer';

const apps = [
  {
    id: 'ocr',
    title: 'OCR',
    type: 'group',
    url: '/Finance/Tools/OCR',
    icon: OCR
  },
  {
    id: 'sendemail',
    title: 'Email',
    type: 'group',
    url: '/Finance/Tools/SendEmail',
    icon: Email
  }
];

const MenuBar = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const navigate = useNavigate();

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Box>
      {/* Action Button */}
      <ClickAwayListener onClickAway={handleClose}>
        <Box ref={anchorRef} display="inline-block">
          <ActionButton title="" icon={MenuOutlinedIcon} onClick={handleToggle} />
        </Box>
      </ClickAwayListener>

      {/* Popper Dropdown */}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        transition
        disablePortal
        popperOptions={{
          modifiers: [{ name: 'offset', options: { offset: [0, 10] } }]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps} position={matchesXs ? 'top' : 'top-right'}>
            {/* <Paper
              sx={{
                width: 325,
                p: 1,
                // background: 'linear-gradient(to  right, #3C3B3F ,#605C3C)',
                borderRadius: 2,
                boxShadow: 3
              }}
              onMouseLeave={() => setOpen(false)} // leave-ல் close
            > */}
            <Paper
              sx={{
                width: 325,
                p: 1,
                borderRadius: 2,
                boxShadow: 3,
                background: `
      linear-gradient(#fff, #fff) padding-box,
      linear-gradient(to bottom, #743ad5, #d53a9d) left/3px 100% no-repeat border-box,
      linear-gradient(to right,  #743ad5, #d53a9d) top/100% 3px no-repeat border-box
    `,
                border: '3px solid transparent'
              }}
            >
              <Grid container spacing={2}>
                {apps.map((app) => {
                  const Icon = app.icon;
                  return (
                    <Grid item xs={2} key={app.id} textAlign="center">
                      {/* <Tooltip title={app.title} arrow> */}
                      <IconButton
                        onClick={() => {
                          navigate(app.url);
                          setOpen(false);
                        }}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          p: 1
                        }}
                      >
                        {typeof Icon === 'string' ? (
                          <img src={Icon} alt={app.title} width={30} height={30} />
                        ) : (
                          <Icon size={30} color="green" />
                        )}
                        <span style={{ fontSize: '12px', color: '#4D4A4A' }}>{app.title}</span>
                      </IconButton>
                      {/* </Tooltip> */}
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
