import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
// import { AiOutlineSearch, AiOutlineWallet } from "react-icons/ai";
// import { BsListTask } from "react-icons/bs";
import TableComponent from '../chequeBookMaster/TableComponent';

import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef } from 'react';

const ChequeBookMaster = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  //   const buttonStyle = {
  //     fontSize: '20px' // Adjust the font size as needed
  //   };

  //   const [openBankModal, setOpenBankModal] = React.useState(false);

  //   const handleBankOpen = () => {
  //     setOpenBankModal(true);
  //   };
  //   const handleBankClose = () => {
  //     setOpenBankModal(false);
  //   };
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="d-flex justify-content-between">{/* <h1 className="text-xl font-semibold mb-3">Group / Ledger</h1> */}</div>
        <div className="row d-flex mb-4">
          <div className="d-flex flex-wrap justify-content-start mb-4 " style={{ marginBottom: '20px' }}>
            <Tooltip title="Search" placement="top">
              <ButtonBase sx={{ borderRadius: '12px', marginRight: '10px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <SearchIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>

            <Tooltip title="Clear" placement="top">
              {' '}
              <ButtonBase sx={{ borderRadius: '12px', marginRight: '10px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <ClearIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>

            <Tooltip title="List View" placement="top">
              {' '}
              <ButtonBase sx={{ borderRadius: '12px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <FormatListBulletedTwoToneIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
            <Tooltip title="Save" placement="top">
              {' '}
              <ButtonBase sx={{ borderRadius: '12px', marginLeft: '10px' }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <SaveIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
          </div>

          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Branch/Location</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Branch/Location"
                // onChange={handleChange}
              >
                <MenuItem value={'Bangalore'}>Bangalore</MenuItem>
                <MenuItem value={'Chennai'}>Chennai</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mb-2">
            <FormControl fullWidth variant="filled">
              <TextField disabled label="Cheque Book ID" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-4 mb-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <TextField id="bank" label="Bank" size="small" required inputProps={{ maxLength: 30 }} />
              </FormControl>
            </Box>
          </div>
          <div className="col-md-4 mb-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <TextField id="checkprefix" label="Check Prefix" size="small" required inputProps={{ maxLength: 30 }} />
              </FormControl>
            </Box>
          </div>
          <div className="col-md-4 mb-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <TextField id="checkstartno" label="Check Start No" size="small" required inputProps={{ maxLength: 30 }} />
              </FormControl>
            </Box>
          </div>
          <div className="col-md-4 mb-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <TextField id="noofchequeleaves" label="No of Cheque Leaves" size="small" required inputProps={{ maxLength: 30 }} />
              </FormControl>
            </Box>
          </div>
        </div>
        <h5 className="text-sm font-semibold mb-3">Cheque Details</h5>

        <TableComponent />
      </div>
    </>
  );
};

export default ChequeBookMaster;
