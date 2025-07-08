import React, { useState, useEffect } from 'react';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CommonReportTable from '../../../utils/CommonReportTable';
import dayjs from 'dayjs';
import {
  TextField, Checkbox, Box, Typography, Button,
  FormControlLabel, FormHelperText, FormControl,
  InputLabel, MenuItem, Select, ButtonGroup,
  Dialog, DialogContent, IconButton, DialogTitle
} from '@mui/material';
import CostInvoice from '../costInvoice/CostInvoice';
import CostDebitNote from '../costDebitNote/CostDebitNote';
import Payment from '../payment/Payment';
import RCostInvoicegna from '../costInvoice/RCostInvoicegna';
import UrCostInvoicegna from '../costInvoice/UrCostInvoicegna';
import TaxInvoiceDetails from '../taxInvoice/taxInvoiceDetail';
import IrnCreditNote from '../creditNote/CreditNoteDetail';
import Receipt from '../receipt/Receipt';
import FancyLoader from 'utils/FancyLoader';

const PendingRegister = () => {
  const [groupedData, setGroupedData] = useState({});
  const [partyTypeList, setPartyTypeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [dialogBoxData, setDialogBoxData] = useState([]);
  const [headerFields, setHeaderFields] = useState([]);
  const [currentScreenCode, setCurrentScreenCode] = useState('');
  const [orgId] = useState(localStorage.getItem('orgId'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));

  const [formData, setFormData] = useState({
    partyType: 'All',
    partyName: 'All',
    screenName: 'All'
  });

  const [fieldErrors, setFieldErrors] = useState({
    partyType: '',
    partyName: '',
    screenName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
    // if(name === 'partyType'){

    // }
  };

  const handleClear = () => {
    setFormData({
      partyType: 'All',
      partyName: 'All',
      screenName: 'All'
    });
    setPartyNameList([]);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllPartyMasterByOrgId();
  }, []);

  useEffect(() => {
    if (formData.partyType && formData.partyType !== 'All') {
      getPartyName();
    } else {
      setPartyNameList([{ id: 0, partyName: 'All' }]);
    }
  }, [formData.partyType]);

  const getAllPartyMasterByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllPartyTypeByOrgId?orgid=${orgId}`);
      const partyTypes = result.paramObjectsMap.partyTypeVO || [];
      setPartyTypeList([{ id: 0, partyType: 'All' }, ...partyTypes]);
    } catch (err) {
      console.error('Error fetching party types:', err);
    }
  };

  const getPartyName = async () => {
    try {
      const response = await apiCalls('get', `/taxInvoice/getPartyNameByPartyType?orgId=${orgId}&partyType=${formData.partyType}`);
      const partyNames = response.paramObjectsMap.partyMasterVO || [];
      setPartyNameList([{ id: 0, partyName: 'All' }, ...partyNames]);
    } catch (error) {
      console.error('Error fetching party names:', error);
    }
  };
  const handleDocClick = async (docId, screenCode) => {
    setSalesOpen(!salesOpen);
    setCurrentScreenCode(screenCode);
    try {
      let response;
      if (screenCode === 'TI') {
        response = await apiCalls(
          'get',
          `/taxInvoice/getTaxInvoiceByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`
        );
      }
      else if (screenCode === 'ICN') {
        response = await apiCalls(
          'get',
          `/taxInvoice/getCreditNoteByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`
        );
      }
      else if (screenCode === 'CDN') {
        response = await apiCalls(
          'get',
          `/costInvoice/getDebitNoteByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`
        );
      }
      else if (screenCode === 'CI') {
        response = await apiCalls(
          'get',
          `/costInvoice/getCostByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`
        );
      }
      else if (screenCode === 'RT') {
        response = await apiCalls(
          'get',
          `/arreceivable/getReceiptByDocIdAndScreenCode?docId=${docId}`
        );
      }
      else if (screenCode === 'URCI') {
        response = await apiCalls(
          'get',
          `/UrCostInvoiceGna/getUrCostInvoiceByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`
        );
      }
      else if (screenCode === 'RCI') {
        response = await apiCalls(
          'get',
          `/rCostInvoiceGna/getRCostInvoiceGnaByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`
        );
      }
      else {
        response = await apiCalls(
          'get',
          `/payable/getPaymentByDocId?docId=${docId}&orgId=${orgId}`
        );
      }

      if (response.status === true) {
        // const dataKey = screenCode === 'TI' ? 'taxIn
        {
          screenCode === 'TI' ? setDialogBoxData(response.paramObjectsMap.taxInvoiceVO) :
            (screenCode === 'CI') ? setDialogBoxData(response.paramObjectsMap.costInvoiceVO) :
              (screenCode === 'CDN') ? setDialogBoxData(response.paramObjectsMap.costDebitNoteVO) :
                (screenCode === 'ICN') ? setDialogBoxData(response.paramObjectsMap.IrnCreditNoteVO) :
                  (screenCode === 'RCI') ? setDialogBoxData(response.paramObjectsMap.rCostInvoiceGnaVO) :
                    (screenCode === 'URCI') ? setDialogBoxData(response.paramObjectsMap.urCostInvoiceGnaVO) :
                      (screenCode === 'RT') ? setDialogBoxData(response.paramObjectsMap.receiptVO) :
                        setDialogBoxData(response.paramObjectsMap.PaymentVO);
        }
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const reportColumns = [
    {
      accessorKey: 'docid',
      header: 'Doc Id',
      size: 100,
      Cell: ({ row }) => {
        const docId = row.original.docid;
        const screenCode = row.original.screencode;

        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleDocClick(docId, screenCode);
            }}
            style={{
              color: 'crimson',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s, text-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'red';
              // e.target.style.textShadow = '0 0 2px rgba(255, 0, 0, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'crimson';
              e.target.style.textShadow = 'none';
            }}
          >
            {docId}
          </a>
        );
      }
    },
    { accessorKey: 'docdate', header: 'Date', size: 100 },
    { accessorKey: 'vid', header: '# Invoice', size: 100 },
    { accessorKey: 'vdate', header: 'Date', size: 100 },
    { accessorKey: 'partyname', header: 'Party Name', size: 100, },
    {
      accessorKey: 'amount',
      header: 'Amount',
      size: 80,
      Cell: ({ cell }) => (
        <div style={{ textAlign: 'right', width: '100%', color: 'black' }}>
          {cell.getValue() !== undefined && cell.getValue() !== null ? Number(cell.getValue()).toLocaleString('en-IN') : '-'}
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'right'
      }
    },
  ];
  const handleGo = async () => {
    try {
      setIsLoading(true);
      const response = await apiCalls(
        'get',
        `/arapAdjustments/GetPendingRegisterDetails?orgId=${orgId}&PartyName=${formData.partyName}&Partytype=${formData.partyType}&ScreenName=${formData.screenName}&finYear=${finYear}`
      );
      console.log('Response:', response);
      if (response.status === true) {
        // setRowData(response.paramObjectsMap.mapp || []);
        const data = response.paramObjectsMap.mapp || [];
        setRowData(data);
        setGroupedData(groupByScreenName(data));
        setIsLoading(false);
        setOpen(true);
        const newHeaderFields = [];
        if (formData.partyType) {
          newHeaderFields.push({
            label: 'Party Type',
            value: formData.partyType
          });
        }
        // if (selectedSections.branchCode) {
        newHeaderFields.push({
          label: 'Party Name',
          value: formData.partyName
        });
        // }
        // if (selectedSections.customer) {
        newHeaderFields.push({
          label: 'Screen Name',
          value: formData.screenName
        });
        // }
        setHeaderFields(newHeaderFields)
      } else {
        showToast('error', response.paramObjectsMap.message);
        setIsLoading(false);
      }
      // showToast('success', 'Data fetched successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', 'Error fetching data');
    }
  };
  // const groupByScreenName = (data) => {
  //   const grouped = {};
  //   data.forEach((item) => {
  //     const key = item.screenname || 'Others';
  //     if (!grouped[key]) grouped[key] = [];
  //     grouped[key].push(item);
  //   });
  //   return grouped;
  // };
  const groupByScreenName = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const screen = item.screenname?.trim();
      if (!screen) return; // Skip records with empty or missing screenname

      if (!grouped[screen]) grouped[screen] = [];
      grouped[screen].push(item);
    });
    return grouped;
  };

  return (
    <>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row mb-2">
          {/* Party Type */}
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.screenName}>
              <InputLabel id="screenName-label">Screen Name</InputLabel>
              <Select
                labelId="screenName-label"
                label="screenName"
                value={formData.screenName}
                onChange={handleInputChange}
                name="screenName"
              >
                <MenuItem value="All">
                  All
                </MenuItem>
                {/* {(formData.partyType === 'All' || formData.partyType === 'CUSTOMER') && (
                  <> */}
                <MenuItem value="TAX INVOICE">TAX INVOICE</MenuItem>
                <MenuItem value="COST DEBIT NOTE">DEBIT NOTE</MenuItem>
                <MenuItem value="RECEIPT">RECEIPT</MenuItem>
                {/* </>
                )} */}
                {/* {(formData.partyType === 'All' || formData.partyType === 'VENDOR') && (
                  <> */}
                <MenuItem value="COST INVOICE">COST INVOICE</MenuItem>
                <MenuItem value="INR CREDIT NOTE">CREDIT NOTE</MenuItem>
                <MenuItem value="PAYMENT">PAYMENT</MenuItem>
                <MenuItem value="REGISTER COSTINVOICE GNA">R COSTINVOICE</MenuItem>
                <MenuItem value="UR COSTINVOICE GNA">UR COSTINVOICE</MenuItem>
                {/* </>
                )} */}
              </Select>
              {fieldErrors.screenName && <FormHelperText>{fieldErrors.screenName}</FormHelperText>}
            </FormControl>
          </div>
          {formData.screenName === 'All' && <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.partyType}>
              <InputLabel id="partyType-label">Party Type</InputLabel>
              <Select labelId="partyType-label" label="Party Type" value={formData.partyType} onChange={handleInputChange} name="partyType">
                {partyTypeList.map((row) => (
                  <MenuItem key={row.id} value={row.partyType}>
                    {row.partyType}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.partyType && <FormHelperText>{fieldErrors.partyType}</FormHelperText>}
            </FormControl>
          </div>}
          {/* Party Name */}
          <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.partyName}>
              <InputLabel id="partyName-label">Party Name</InputLabel>
              <Select labelId="partyName-label" label="Party Name" value={formData.partyName} onChange={handleInputChange} name="partyName">
                {partyNameList.map((row) => (
                  <MenuItem key={row.id} value={row.partyName}>
                    {row.partyName}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.partyName && <FormHelperText>{fieldErrors.partyName}</FormHelperText>}
            </FormControl>
          </div>
          {/* Buttons */}
          <div className="col-md-3 mb-2">
            <div className="d-flex flex-wrap justify-content-start mb-4 mt-1">
              <ActionButton title="Search" icon={SearchIcon} onClick={handleGo} />
              <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            </div>
          </div>
        </div>
        <>
          {isLoading ? (
            <FancyLoader open={true} text="Loading Invoice Details..." />
          ) : (
            <Dialog
              open={open}
              onClose={handleCloseModal}
              fullWidth
              maxWidth="xl"
              sx={{
                '& .MuiDialog-paper': {
                  borderRadius: '12px',
                  overflow: 'hidden'
                }
              }}
            >
              <DialogTitle sx={{
                m: 0,
                p: 1,
                backgroundColor: '#34449B',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>UnApproval Register
                <Box>
                  <IconButton
                    aria-label="close"
                    onClick={handleCloseModal}
                    sx={{
                      color: 'white',
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                {/* </Box> */}
              </DialogTitle>
              <DialogContent>
                {Object.entries(groupedData).map(([screen, records]) => (
                  <Box key={screen} sx={{ marginBottom: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        marginBottom: 1,
                        color: '#34449B',
                        borderBottom: '2px solid #ccc',
                        paddingBottom: '4px',
                      }}
                    >
                      {screen}
                    </Typography>
                    <CommonReportTable
                      columns={reportColumns}
                      data={records}
                      fileName={`${screen} Register`}
                      headerFields={headerFields}
                    />
                  </Box>
                ))}
              </DialogContent>
            </Dialog>
          )}
        </>
        <>
          <Dialog
            open={salesOpen}
            onClose={() => {
              setSalesOpen(!salesOpen)
              handleGo();
              setDialogBoxData(null);
              setCurrentScreenCode('');
            }}
            fullWidth
            maxWidth="xl"
            sx={{
              '& .MuiDialog-paper': {
                borderRadius: '12px',
                overflow: 'hidden'
              }
            }}
          >
            <DialogTitle sx={{
              m: 0,
              p: 1,
              backgroundColor: '#34449B',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              Cost Invoice
              <Box>
                <IconButton aria-label="close" onClick={() => setSalesOpen(!salesOpen)} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              {dialogBoxData && (
                <>
                  {isLoading ? (
                    <FancyLoader open={true} />
                  ) : (
                    currentScreenCode === 'TI' && (
                      <TaxInvoiceDetails selectedRow={dialogBoxData} />
                    )
                  )}
                  {isLoading ? (
                    <FancyLoader open={true} />
                  ) : (currentScreenCode === 'CI' && <CostInvoice selectedRow={dialogBoxData} open={true} />)}
                  {isLoading ? (
                    <FancyLoader open={true} />
                  ) : (currentScreenCode === 'CDN' && <CostDebitNote selectedRow={dialogBoxData} />)}
                  {isLoading ? (
                    <FancyLoader open={true} />
                  ) : (currentScreenCode === 'ICN' && <IrnCreditNote selectedRow={dialogBoxData} />)}
                  {isLoading ? (
                    <FancyLoader open={true} />
                  ) : (currentScreenCode === 'RT' && <Receipt selectedRow={dialogBoxData} />)}
                  {isLoading ? (
                    <FancyLoader open={true} />
                  ) : (currentScreenCode === 'PT' && <Payment selectedRow={dialogBoxData} />)}
                  {isLoading ? (
                    <FancyLoader open={true} />
                  ) : (currentScreenCode === 'RCI' && <RCostInvoicegna selectedRow={dialogBoxData} />)}
                  {isLoading ? (
                    <FancyLoader open={true} />
                  ) : (currentScreenCode === 'URCI' && <UrCostInvoicegna selectedRow={dialogBoxData} />)}
                  {/* {(currentScreenCode === 'RCI' || currentScreenCode === 'URCI') && (
                    <IrnCreditNote selectedRow={dialogBoxData} />
                  )} */}
                </>
              )}
            </DialogContent>
          </Dialog>
        </>
      </div>
    </>
  );
};

export default PendingRegister;
