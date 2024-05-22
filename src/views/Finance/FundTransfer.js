// import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';

import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef } from 'react';

const FundTransfer = () => {
  // const buttonStyle = {
  //   fontSize: '20px' // Adjust the font size as needed
  // };

  const theme = useTheme();
  const anchorRef = useRef(null);

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
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
        <div className="row">
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label" required>
                Branch/Location
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                required
                // value={age}
                label="Branch/Location"
                // onChange={handleChange}
              >
                <MenuItem value={20}>HEAD OFFICE</MenuItem>
                <MenuItem value={10}>Branch</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Doc ID" size="small" disabled inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label" required>
                Payment Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                required
                // value={age}
                label="Payment Type"
                // onChange={handleChange}
              >
                <MenuItem value={20}>HEAD OFFICE</MenuItem>
                <MenuItem value={10}>Branch</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Doc Date"
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  //value={boDate}
                  //onChange={(newValue) => setBoDate(newValue)}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Reference No." size="small" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Reference Dt"
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  //value={boDate}
                  //onChange={(newValue) => setBoDate(newValue)}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="From Account" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField disabled label="Balance" size="small" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField disabled label="Currency" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Ex. Rate" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="To Branch/Location" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="To Bank" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Currency" size="small" disabled inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Ex. Rate" size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Cheque Book" size="small" inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Cheque No" size="small" disabled inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Cheque Date" size="small" disabled inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Payment Amt." size="small" required inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Conversion Rate" size="small" required disabled inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Receipt Amt." size="small" required disabled inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth size="small">
              <TextField label="Gain/Loss" size="small" disabled inputProps={{ maxLength: 30 }} />
            </FormControl>
          </div>
          <div className="col-md-8 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="remarks"
                label="Remarks"
                size="small"
                multiline
                minRows={2}
                //placeholder="accountcode"
                //   inputProps={{ maxLength: 30 }}
              />
            </FormControl>
          </div>
        </div>
      </div>
    </>
  );
};
export default FundTransfer;
