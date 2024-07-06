import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { TabContext } from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Avatar, ButtonBase, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import { useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import CommonTable from 'views/basicMaster/CommonTable';
import GstTable from './GstTable';
import TableComponent from './TableComponent';

const CreditNoteDetails = () => {
  const [tabIndex, setTabIndex] = useState(0);
  // const buttonStyle = {
  //   fontSize: '20px' // Adjust the font size as needed
  // };

  const theme = useTheme();
  const anchorRef = useRef(null);
  const [value, setValue] = useState('1');
  const [listView, setListView] = useState(false);
  const [data, setData] = useState([]);

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleListView = () => {
    setListView(!listView);
    getAllCreditNote();
  };

  const columns = [
    { accessorKey: 'cityName', header: 'Party Name', size: 140 },
    { accessorKey: 'cityCode', header: 'Code', size: 140 },
    { accessorKey: 'state', header: 'Type', size: 140 },
    { accessorKey: 'country', header: 'Address Type', size: 140 },
    { accessorKey: 'active', header: 'active', size: 140 }
    // { accessorKey: 'active', header: 'Recipient', size: 140 }
  ];

  const getAllCreditNote = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transaction/getIrnCreditByActive`);
      console.log('API Response:', response);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.taxInvoiceVO);
      } else {
        // Handle error
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
      <div className="">
        <div className="row">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
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
                  <FormatListBulletedTwoToneIcon size="1.3rem" stroke={1.5} onClick={handleListView} />
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

          {!listView && (
            <div className="row d-flex flex-wrap justify-content-start">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField label="Party Name" size="small" required inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField label="Party Code" size="small" required inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Party Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    required
                    // value={age}
                    label="Party Type"
                    // onChange={handleChange}
                  >
                    <MenuItem value={20}>Customer</MenuItem>
                    <MenuItem value={10}>Vendor</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Address Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    required
                    // value={age}
                    label="Address Type"
                    // onChange={handleChange}
                  >
                    <MenuItem value={20}>Customer</MenuItem>
                    <MenuItem value={10}>Vendor</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField label="Recipient GSTIN" size="small" required inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Place of Supply
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    required
                    // value={age}
                    label="Address Type"
                    // onChange={handleChange}
                  >
                    <MenuItem value={20}>Customer</MenuItem>
                    <MenuItem value={10}>Vendor</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField label="Address" size="small" required multiline inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField label="Pincode" size="small" required inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    required
                    // value={age}
                    label="Status"
                    // onChange={handleChange}
                  >
                    <MenuItem value={20}>Tax</MenuItem>
                    <MenuItem value={10}>Tax</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <TextField label="Orgin Bill" size="small" required inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    GST Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    required
                    // value={age}
                    label="Status"
                    // onChange={handleChange}
                  >
                    <MenuItem value={20}>Inter</MenuItem>
                    <MenuItem value={10}>Intra</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Due Date"
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
                  <InputLabel id="demo-simple-select-label" required>
                    Bill Curr
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    required
                    // value={age}
                    label="Bill Curr"
                    // onChange={handleChange}
                  >
                    <MenuItem value={20}>Inter</MenuItem>
                    <MenuItem value={10}>Intra</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" required>
                    Sales Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    required
                    // value={age}
                    label="Sales Type"
                    // onChange={handleChange}
                  >
                    <MenuItem value={20}>Inter</MenuItem>
                    <MenuItem value={10}>Intra</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          )}
        </div>
        {/* <div className="d-flex flex-row mt-4">
          <button type="button" className="btn btn-primary" style={{ marginRight: '10px' }}>
            Save
          </button>
          <button type="button" className="btn btn-primary">
            Cancel
          </button>
        </div> */}
      </div>
      {/* <div className="card w-full p-6 bg-base-100 shadow-xl mt-2" style={{ padding: '20px' }}>
        <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
          <TabList style={{ marginBottom: 0 }}>
            <Tab>Charge Particulars</Tab>
            <Tab>Summary</Tab>
            <Tab>GST</Tab>
          </TabList>
          <TabPanel>
            <TableComponent />
          </TabPanel>
          <TabPanel>
            <TableComponent />
            <div className="row d-flex mt-3">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField label="Tot. Charge Amt.(LC)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField label="Tot. Tax Amt.(LC)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField label="Tot. Inv Amt.(LC)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField label="Round Off Amt.(LC)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField label="Tot Charge Amt.(Bill Curr.)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField label="Tot Tax Amt.(Bill Curr.)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField label="Tot Inv Amt.(Bill Curr.)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField label="Tot Taxable Amt.(Bill Curr.)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-6 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField label="Amount In Words" size="small" inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
              <div className="col-md-6 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField label="Billing Remarks" size="small" inputProps={{ maxLength: 30 }} />
                </FormControl>
              </div>
            </div>
          </TabPanel>
          <TabPanel></TabPanel>
        </Tabs>
      </div> */}
      <br></br>
      {!listView && (
        <div className="card w-full p-6 bg-base-100 shadow-xl mb-3">
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="lab API tabs example">
                  <Tab label="Charge Particulars" value="1" />
                  <Tab label="Summary" value="2" />
                  <Tab label="GST" value="3">
                    {' '}
                  </Tab>
                </TabList>
              </Box>
              <TabPanel value="1">
                <TableComponent />
              </TabPanel>
              <TabPanel value="2">
                <div className="row d-flex mt-3">
                  <div className="col-md-3 mb-3">
                    <FormControl fullWidth variant="filled">
                      <TextField label="Tot. Charge Amt.(LC)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                    </FormControl>
                  </div>
                  <div className="col-md-3 mb-3">
                    <FormControl fullWidth variant="filled">
                      <TextField label="Tot. Tax Amt.(LC)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                    </FormControl>
                  </div>
                  <div className="col-md-3 mb-3">
                    <FormControl fullWidth variant="filled">
                      <TextField label="Tot. Inv Amt.(LC)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                    </FormControl>
                  </div>
                  <div className="col-md-3 mb-3">
                    <FormControl fullWidth variant="filled">
                      <TextField label="Round Off Amt.(LC)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                    </FormControl>
                  </div>
                  <div className="col-md-3 mb-3">
                    <FormControl fullWidth variant="filled">
                      <TextField label="Tot Charge Amt.(Bill Curr.)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                    </FormControl>
                  </div>
                  <div className="col-md-3 mb-3">
                    <FormControl fullWidth variant="filled">
                      <TextField label="Tot Tax Amt.(Bill Curr.)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                    </FormControl>
                  </div>
                  <div className="col-md-3 mb-3">
                    <FormControl fullWidth variant="filled">
                      <TextField label="Tot Inv Amt.(Bill Curr.)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                    </FormControl>
                  </div>
                  <div className="col-md-3 mb-3">
                    <FormControl fullWidth variant="filled">
                      <TextField label="Tot Taxable Amt.(Bill Curr.)" size="small" placeholder="0.00" inputProps={{ maxLength: 30 }} />
                    </FormControl>
                  </div>
                  <div className="col-md-6 mb-3">
                    <FormControl fullWidth variant="filled">
                      <TextField label="Amount In Words" size="small" inputProps={{ maxLength: 30 }} />
                    </FormControl>
                  </div>
                  <div className="col-md-6 mb-3">
                    <FormControl fullWidth variant="filled">
                      <TextField label="Billing Remarks" size="small" inputProps={{ maxLength: 30 }} />
                    </FormControl>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="3">
                {' '}
                <GstTable />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      )}

      {listView && (
        <div>
          {' '}
          <CommonTable columns={columns} data={data} />{' '}
        </div>
      )}
    </div>
  );
};

export default CreditNoteDetails;
