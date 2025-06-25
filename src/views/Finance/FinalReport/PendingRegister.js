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
const PendingRegister = () => {
  const [partyTypeList, setPartyTypeList] = useState([]);
  const [partyNameList, setPartyNameList] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [dialogBoxData, setDialogBoxData] = useState([]);
  const [headerFields, setHeaderFields] = useState([]);
  const [orgId] = useState(localStorage.getItem('orgId'));

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
  };

  const handleClear = () => {
    setFormData({
      partyType: 'All',
      partyName: 'All',
      screenName: ''
    });
    setPartyNameList([]);
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
    setOpen(true);
    try {
      let response;
      if (screenCode === 'TI') {
        response = await apiCalls(
          'get',
          `/taxInvoice/getTaxInvoiceByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`
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
          `/taxInvoice/getCreditNoteByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`
        );
      }
      else if (screenCode === 'RCI') {
        response = await apiCalls(
          'get',
          `/taxInvoice/getCreditNoteByDocIdandScreenCode?docId=${docId}&ScreenCode=${screenCode}`
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
              (screenCode === 'RCI') ? setDialogBoxData(response.paramObjectsMap.irnCreditNoteVO) :
                (screenCode === 'URCI') ? setDialogBoxData(response.paramObjectsMap.irnCreditNoteVO) :
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
    { accessorKey: 'screencode', header: 'Screen', size: 100 },
    { accessorKey: 'vid', header: '# Invoice', size: 100 },
    { accessorKey: 'vdate', header: 'Date', size: 100 },
    { accessorKey: 'partytype', header: 'Party Type', size: 80 },
    { accessorKey: 'partyname', header: 'Party Name', size: 100 },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 100,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return (
          <span
            style={{
              textAlign: 'center'
            }}
          >
            {value}
          </span>
        );
      },
    },
  ];
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dayjs(dateString).format('DD-MM-YYYY');
  };
  const handleGo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/arapAdjustments/GetPendingRegisterDetails?orgId=${orgId}&PartyName=${formData.partyName}&Partytype=${formData.partyType}&ScreenName=${formData.screenName}`
      );
      console.log('Response:', response);
      if (response.status === true) {
        setRowData(response.paramObjectsMap.mapp || []);
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

  return (
    <>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row mb-2">
          {/* Party Type */}
          <div className="col-md-3 mb-3">
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
          </div>

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
          {/* Screen Name */}
          {/* <div className="col-md-3 mb-3">
            <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.screenName}>
              <InputLabel id="screenName-label">Screen Name</InputLabel>
              <Select
                labelId="screenName-label"
                label="screenName"
                value={formData.screenName}
                onChange={handleInputChange}
                name="screenName"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {(formData.partyType === 'All' || formData.partyType === 'CUSTOMER') && (
                  <>
                    <MenuItem value="TAX INVOICE"><em>TAX INVOICE</em></MenuItem>
                    <MenuItem value="RECEIPT">RECEIPT</MenuItem>
                  </>
                )}

                {(formData.partyType === 'All' || formData.partyType === 'VENDOR') && (
                  <>
                    <MenuItem value="COST INVOICE">COST INVOICE</MenuItem>
                    <MenuItem value="PAYMENT">PAYMENT</MenuItem>
                    <MenuItem value="R COSTINVOICE">R COSTINVOICE</MenuItem>
                    <MenuItem value="UR COSTINVOICE">UR COSTINVOICE</MenuItem>
                  </>
                )}
              </Select>
              {fieldErrors.screenName && <FormHelperText>{fieldErrors.screenName}</FormHelperText>}
            </FormControl>
          </div> */}
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
                <MenuItem value="RECEIPT">RECEIPT</MenuItem>
                {/* </>
                )} */}
                {/* {(formData.partyType === 'All' || formData.partyType === 'VENDOR') && (
                  <> */}
                <MenuItem value="COST INVOICE">COST INVOICE</MenuItem>
                <MenuItem value="PAYMENT">PAYMENT</MenuItem>
                <MenuItem value="R COSTINVOICE">R COSTINVOICE</MenuItem>
                <MenuItem value="UR COSTINVOICE">UR COSTINVOICE</MenuItem>
                {/* </>
                )} */}
              </Select>
              {fieldErrors.screenName && <FormHelperText>{fieldErrors.screenName}</FormHelperText>}
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
            }}>
              {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6"> */}
              {formData.viewMode === 'details' ? 'Detailed Sales Report' : 'Summary Sales Report'}
              {/* </Typography>*/}
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
              {rowData.length > 0 && (
                <CommonReportTable
                  columns={reportColumns}
                  data={rowData}
                  fileName={'Pending Report'}
                  // handleDownloadExcel={handleDownloadExcel}
                  // sumFields={getSumFields()}
                  headerFields={headerFields}
                />
              )}
            </DialogContent>
          </Dialog>
        </>
        {/* <>
        
          <Dialog
            open={modalOpen}
            maxWidth={'xl'}
            fullWidth={true}
            onClose={handleCloseModal}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <h6 style={{ margin: 0, textAlign: "center" }}>Report Details</h6>
                <IconButton onClick={handleCloseModal} color="error">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent className="pb-0">
              <div className="row mb-2 mb-1">
                <div className="col-md-3 mb-1"><strong>Doc ID:</strong> {fillGridData.docId}</div>
                <div className="col-md-3 mb-1"><strong>Doc Date:</strong> {fillGridData.docDate ? dayjs(fillGridData.docDate).format('DD-MM-YYYY') : ''}</div>
                <div className="col-md-3 mb-1"><strong>Invoice No:</strong> {fillGridData.vid}</div>
                <div className="col-md-3 mb-1"><strong>Invoice Date:</strong> {fillGridData.vdate ? dayjs(fillGridData.vdate).format('DD-MM-YYYY') : ''}</div>
                <div className="col-md-3 mb-1"><strong>Customer:</strong> {fillGridData.supplierName}</div>
                <div className="col-md-3 mb-1"><strong>Gst In:</strong> {fillGridData.supplierGstIn}</div>
                <div className="col-md-3 mb-1"><strong>Tax Type:</strong> {fillGridData.gstType}</div>
                <div className="col-md-3 mb-1"><strong>Charge Amount:</strong> ₹{Number(fillGridData.totChargesLcAmt || 0).toLocaleString('en-IN')}</div>
                <div className="col-md-3 mb-1"><strong>Tax Amount:</strong> ₹{Number(fillGridData.gstInputLcAmt || 0).toLocaleString('en-IN')}</div>
                <div className="col-md-3 mb-1"><strong>Amount:</strong> ₹{Number(fillGridData.netBillLcAmt || 0).toLocaleString('en-IN')}</div>
              </div>
              <div className="card w-full p-6 bg-base-100 shadow-xl mb-3">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="lab API tabs example">
                        <Tab label="Charge Particulars" value="1" />
                        <Tab label="TDS" value="2" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="table-header">Job Order No</th>
                                  <th className="table-header">Charge Name</th>
                                  <th className="table-header">Charge Code</th>
                                  <th className="table-header">SAC Code</th>
                                  <th className="table-header">Vendor</th>
                                  <th className="table-header">Qty</th>
                                  <th className="table-header">Rate</th>
                                  <th className="table-header">Currency</th>
                                  <th className="table-header">Ex Rate</th>
                                  <th className="table-header">GST Amount</th>
                                  <th className="table-header">FC Amount</th>
                                  <th className="table-header">LC Amount</th>
                                  <th className="table-header">Bill Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fillGridData.chargerCostInvoiceVO && fillGridData.chargerCostInvoiceVO.length > 0 ? (
                                  fillGridData.chargerCostInvoiceVO.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="text-center">{index + 1}</td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.jobNo || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.chargeName || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.chargeCode || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.govChargeCode || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.party || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.qty || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.rate || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.currency || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.exRate || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.gstAmount || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.fcAmt || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.lcAmt || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.billAmt || 0}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  fillGridData.chargerCostDebitNoteVO?.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="text-center">{index + 1}</td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.jobNo || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.chargeName || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.chargeCode || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.govChargeCode || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.party || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.qty || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.rate || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.currency || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.exRate || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.gstpercent || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.fcAmt || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.lcAmt || 0}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.billAmt || 0}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value="2">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="table-header">Section</th>
                                  <th className="table-header">TDS</th>
                                  <th className="table-header">TDS Percent</th>
                                  <th className="table-header">TDS Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fillGridData.tdsCostInvoiceVO && fillGridData.tdsCostInvoiceVO.length > 0 ? (
                                  fillGridData.tdsCostInvoiceVO.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="text-center">{index + 1}</td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.section || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.totTdsWhAmnt || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.tdsWithHoldingPer || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.tdsWithHolding || ''}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  fillGridData.taxInvoiceGstVO?.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="text-center">{index + 1}</td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.tdsWithHolding || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.tdsWithHoldingPer || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.section || ''}
                                      </td>
                                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.totTdsWhAmnt || ''}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  </TabContext>
                </Box>
              </div>
            </DialogContent>
          </Dialog>
        </> */}

      </div>
    </>
  );
};

export default PendingRegister;
