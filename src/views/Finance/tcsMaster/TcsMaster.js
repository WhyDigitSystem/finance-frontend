import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';
import TableComponent from './TableComponent';
import { useTheme } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase } from '@mui/material';
import { useRef } from 'react';
import { Tooltip } from '@mui/material';
import 'react-tabs/style/react-tabs.css';

const TcsMaster = () => {
  // const buttonStyle = {
  //   fontSize: '20px' // Adjust the font size as needed
  // };

  const theme = useTheme();
  const anchorRef = useRef(null);

  return (
    <div>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        {/* <div className="d-flex flex-wrap justify-content-start mb-3">
            <button className="btn btn-ghost btn-sm normal-case col-xs-2">
              <AiOutlineWallet style={buttonStyle} />
              <span className="ml-1">New</span>
            </button>
            <button className="btn btn-ghost btn-sm normal-case col-xs-2">
              <AiOutlineSearch style={buttonStyle} />
              <span className="ml-1">Search</span>
            </button>
            <button className="btn btn-ghost btn-sm normal-case col-xs-2">
              <BsListTask style={buttonStyle} />
              <span className="ml-1">List View</span>
            </button>
          </div> */}
        <div className="d-flex flex-wrap justify-content-start mb-4">
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
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="account"
                label="Section"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="account"
                label="Section Name"
                size="small"
                required
                //placeholder="accountcode"
                inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
          <div className="col-md-4 mb-3">
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }} />} label="Active" />
            </FormGroup>
          </div>
        </div>

        <TableComponent />
        {/* <div className="d-flex flex-row mt-3">
          <button
            type="button"
            //onClick={handleCustomer}
            className="btn btn-primary"
            style={{ marginRight: '10px' }}
          >
            Save
          </button>
          <button
            type="button"
            //onClick={handleCustomerClose}
            className="btn btn-primary"
          >
            Cancel
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default TcsMaster;
