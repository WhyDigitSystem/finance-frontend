import React, { forwardRef, useEffect, useRef, useState } from 'react';
// import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Add as AddIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import dayjs from 'dayjs';
import numberToWords from 'number-to-words';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import PoList from './PoList';

// Constants
const COMPANY_ADDRESS = [
  'SCM AI-PACKS Private Limited',
  '#23/1,TC Palyam Main road, Hoysala Nagar, Bangalore',
  'GSTIN: 29ABMCS1982P1ZA'
].join('\n');
const DEFAULT_TERMS = `1. Delivery Period: All the material must be delivered from your works within 1 week from the date of the purchase order.
2. Payment Terms: 30 days from invoice submission through NEFT or check.
3. Inspection & Testing: Inspection and quality check to be carried out by AI-PACKS designated executives during material dispatch.
4. Statutory Requirements: NA`;

// Styled Components
const StyledTableCell = styled(TableCell)({
  backgroundColor: 'white',
  color: 'black',
  fontWeight: 'bold',
  border: '1px solid black',
  '@media print': { border: '1px solid black' }
});

const StyledTableCellActions = styled(StyledTableCell)({
  '@media print': { display: 'none' }
});

const StyledTableRow = styled(TableRow)({
  '@media print': { border: '1px solid black' }
});

const StyledTable = styled(Table)({
  '@media print': { borderCollapse: 'collapse' }
});

const StyledTextField = styled(TextField)({
  [`@media print`]: {
    border: 'none',
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiInputBase-input': { padding: 0 }
  }
});

const StyledIconButton = styled(IconButton)({
  '@media print': { display: 'none' }
});

const StyledButton = styled(Button)({
  '@media print': { display: 'none' }
});

const StyledTableContainer = styled(TableContainer)({
  '@media print': {
    border: '1px solid black',
    boxShadow: 'none'
  }
});

// Main Components
const PurchaseOrderForm = forwardRef(
  (
    {
      poNumber,
      setPoNumber,
      vendorAddress,
      setVendorAddress,
      deliveryAddress,
      setDeliveryAddress,
      items,
      handleItemChange,
      handleAddRow,
      handleDeleteRow,
      subtotal,
      sgst,
      cgst,
      igst,
      total,
      gstType,
      handleGstCalculation,
      termsAndConditions,
      setTermsAndConditions,
      companyAddress,
      setCompanyAddress,
      poDate,
      setPoDate
    },
    ref
  ) => {
    const formatIndianCurrency = (number) => {
      if (number === 0) return 'Zero';

      const crore = Math.floor(number / 10000000);
      const lakh = Math.floor((number % 10000000) / 100000);
      const thousand = Math.floor((number % 100000) / 1000);
      const remainder = number % 1000;

      let formatted = '';

      if (crore > 0) formatted += `${numberToWords.toWords(crore)} crore`;
      if (lakh > 0) formatted += ` ${numberToWords.toWords(lakh)} lakh`;
      if (thousand > 0) formatted += ` ${numberToWords.toWords(thousand)} thousand`;
      if (remainder > 0) formatted += ` ${numberToWords.toWords(remainder)}`;

      return formatted.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()).trim();
    };

    const handleDateChange = (date) => {
      setPoDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
    };

    return (
      <div ref={ref}>
        <ToastContainer />
        <Paper elevation={3} sx={{ padding: 5, fontFamily: 'Segoe UI, sans-serif', borderRadius: 4, backgroundColor: '#fcfcfc' }}>
          <Container>
            {/* Header Section */}
            <Box sx={{ backgroundColor: '#fff', padding: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={2}>
                  <img src="/AI_Packs.png" style={{ width: '100%', maxWidth: '100px' }} alt="Company Logo" />
                </Grid>

                {/* <Grid item xs={6}>
                  <StyledTextField
                    sx={{
                      whiteSpace: 'pre-line',
                      '@media print': {
                        whiteSpace: 'pre-line',
                        lineHeight: '1.5'
                      }
                    }}
                    fullWidth
                    multiline
                    minRows={3}
                    variant="outlined"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Company Address"
                  />
                </Grid> */}
                <Grid item xs={6}>
                  <Typography variant="h5" sx={{ mt: 1, width: '80%', backgroundColor: '#fff', padding: 2, borderRadius: 3, boxShadow: 2 }}>
                    SCM AI-PACKS Private Limited, #23/1,TC Palyam Main road, Hoysala Nagar, Bangalore, GSTIN: 29ABMCS1982P1ZA
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  {/* <Typography variant="h5" sx={{ fontWeight: 'bold', pb: 1 }}>
                    PURCHASE ORDER
                  </Typography> */}
                  <StyledTextField
                    size="small"
                    variant="outlined"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    placeholder="PO Number"
                    sx={{ width: '100%', maxWidth: 180, mb: 1, mt: 1 }}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="PO Date"
                      format="DD-MM-YYYY"
                      value={poDate ? dayjs(poDate, 'YYYY-MM-DD') : null}
                      onChange={handleDateChange}
                      slotProps={{ textField: { size: 'small', fullWidth: true, sx: { maxWidth: 180 } } }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>

            {/* Address Section */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Vendor Address:</Typography>
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  multiline
                  value={vendorAddress}
                  onChange={(e) => setVendorAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Deliver To:</Typography>
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  multiline
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Items Table */}
            <TableContainer sx={{ backgroundColor: '#fff', padding: 1, borderRadius: 3, boxShadow: 2 }}>
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>S.No</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>Item & Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Qty</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Rate</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '80px' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '4px',
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '4px',
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '4px',
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleDeleteRow(index)} sx={{ color: '#f44336' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <StyledButton variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />} onClick={handleAddRow} sx={{ mt: 1 }}>
              Add Row
            </StyledButton>

            {/* Calculation Section */}
            <Box sx={{ textAlign: 'right' }}>
              <Box sx={{ mb: 0 }}>
                <FormControlLabel
                  control={<Checkbox checked={gstType === 'inter'} onChange={() => handleGstCalculation('inter')} />}
                  label="Inter GST"
                />
                <FormControlLabel
                  control={<Checkbox checked={gstType === 'intra'} onChange={() => handleGstCalculation('intra')} />}
                  label="Intra GST"
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={{ fontWeight: 'bold', mt: 10 }}>Total in Words: ₹ {formatIndianCurrency(total)} Only</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ fontWeight: 'bold' }}>Subtotal: ₹ {subtotal.toFixed(2)}</Typography>
                  {gstType === 'intra' && (
                    <>
                      <Typography sx={{ fontWeight: 'bold' }}>SGST (9%): ₹ {sgst.toFixed(2)}</Typography>
                      <Typography sx={{ fontWeight: 'bold' }}>CGST (9%): ₹ {cgst.toFixed(2)}</Typography>
                    </>
                  )}
                  {gstType === 'inter' && <Typography sx={{ fontWeight: 'bold' }}>IGST (18%): ₹ {igst.toFixed(2)}</Typography>}
                  <Typography sx={{ fontWeight: 'bold' }}>Total: ₹ {total.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Terms & Conditions */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                TERMS & CONDITIONS:
              </Typography>

              <Typography
                variant="h5"
                sx={{ mt: 1, width: '100%', border: '1px solid', borderColor: 'grey.400', padding: 2, borderRadius: 1 }}
              >
                1. Delivery Period: All the material must be delivered from your works within 1 week from the date of the purchase order.{' '}
                <br /> 2. Payment Terms: 30 days from invoice submission through NEFT or check. <br /> 3. Inspection & Testing: Inspection
                and quality check to be carried out by AI-PACKS designated executives during material dispatch. <br /> 4. Statutory
                Requirements: NA
              </Typography>
              {/* <StyledTextField
                fullWidth
                multiline
                minRows={4}
                variant="outlined"
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                placeholder="Enter terms and conditions"
              /> */}
            </Box>

            <Box sx={{ textAlign: 'left', mt: 10 }}>
              <Typography variant="body1">Authorized Signature: ________________________________</Typography>
            </Box>
          </Container>
        </Paper>
      </div>
    );
  }
);

const PurchaseOrder = () => {
  const componentRef = useRef();
  const [state, setState] = useState({
    vendorAddress: '',
    deliveryAddress: '',
    companyAddress: COMPANY_ADDRESS,
    poNumber: '',
    poVo: [],
    poDate: null,
    items: [{ description: '', quantity: 0, rate: 0, amount: 0 }],
    editMode: false,
    termsAndConditions: DEFAULT_TERMS,
    subtotal: 0,
    sgst: 0,
    cgst: 0,
    total: 0,
    orgId: parseInt(window.localStorage.getItem('orgId')),
    gstType: '',
    igst: 0,
    poData: [],
    listView: false
  });

  const handleGstCalculation = (type) => {
    const gstRate = 0.18;
    const halfGstRate = gstRate / 2;
    let calculatedIgst = 0,
      calculatedCgst = 0,
      calculatedSgst = 0;

    if (type === 'inter') {
      calculatedIgst = state.subtotal * gstRate;
    } else if (type === 'intra') {
      calculatedCgst = state.subtotal * halfGstRate;
      calculatedSgst = state.subtotal * halfGstRate;
    }

    setState((prev) => ({
      ...prev,
      gstType: type,
      igst: calculatedIgst,
      cgst: calculatedCgst,
      sgst: calculatedSgst,
      total: prev.subtotal + calculatedIgst + calculatedCgst + calculatedSgst
    }));
  };

  // const handlePrint = async () => {
  //   if (!componentRef.current) return;
  //   const canvas = await html2canvas(componentRef.current, {
  //     scale: 2,
  //     useCORS: true
  //   });
  //   const imgData = canvas.toDataURL('image/png');
  //   const pdf = new jsPDF({
  //     orientation: 'portrait',
  //     unit: 'px',
  //     format: 'a4'
  //   });

  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const imgProps = pdf.getImageProperties(imgData);
  //   const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

  //   pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
  //   pdf.save(`Purchase_Order_${state.poNumber || 'New'}.pdf`);
  // };

  const handlePrint = async () => {
    if (!componentRef.current) return;

    const canvas = await html2canvas(componentRef.current, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // More pages if needed
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Purchase_Order_${state.poNumber || 'New'}.pdf`);
  };

  const handleSave = async () => {
    try {
      const formData = {
        vendorAddress: state.vendorAddress,
        deliveryAddress: state.deliveryAddress,
        companyAddress: state.companyAddress,
        poNumber: state.poNumber,
        poDate: state.poDate,
        items: state.items,
        termsAndConditions: state.termsAndConditions,
        subtotal: state.subtotal,
        sgst: state.sgst,
        cgst: state.cgst,
        total: state.total,
        gstType: state.gstType,
        igst: state.igst,
        orgId: state.orgId,
        ...(state.editMode && { id: state.poVo?.id })
      };

      if (!formData.poNumber?.trim()) {
        showErrorToast('PO Number is a mandatory field.');
        return;
      }

      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/reportController/createUpdateInvoice`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.statusFlag === 'Error') {
        showErrorToast(response.data.paramObjectsMap?.errorMessage || 'Unknown error occurred.');
      } else {
        showSuccessToast(state.editMode ? 'PO Updated Successfully' : response.data.paramObjectsMap?.message);
        getInvoiceData();
        handleNew();
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorToast(error.message || 'An error occurred while posting the invoice.');
    }
  };

  const getInvoiceData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reportController/getAllInvoiceByOrgId?orgId=${state.orgId}`);
      if (response.status === 200) {
        setState((prev) => ({ ...prev, poData: response.data.paramObjectsMap.invoiceVO.reverse() }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddRow = () => {
    setState((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 0, rate: 0, amount: 0 }]
    }));
  };

  const handleDeleteRow = (index) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setState((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === 'quantity' || field === 'rate') {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate;
      }
      return { ...prev, items: newItems };
    });
  };

  const handleNew = () => {
    setState((prev) => ({
      ...prev,
      vendorAddress: '',
      deliveryAddress: '',
      poNumber: '',
      poDate: null,
      items: [{ description: '', quantity: 0, rate: 0, amount: 0 }],
      subtotal: 0,
      sgst: 0,
      cgst: 0,
      total: 0,
      gstType: '',
      igst: 0,
      editMode: false
    }));
  };

  const handleListView = () => {
    setState((prev) => ({
      ...prev,
      listView: !prev.listView
    }));
    handleNew();
  };

  useEffect(() => {
    const subtotal = state.items.reduce((acc, item) => acc + item.amount, 0);
    setState((prev) => ({ ...prev, subtotal }));
  }, [state.items]);

  useEffect(() => {
    getInvoiceData();
  }, []);

  useEffect(() => {
    if (state.poVo && state.editMode) {
      setState((prev) => ({
        ...prev,
        vendorAddress: state.poVo.vendorAddress || '',
        deliveryAddress: state.poVo.deliveryAddress || '',
        companyAddress: state.poVo.companyAddress || COMPANY_ADDRESS,
        poNumber: state.poVo.poNumber || '',
        poDate: state.poVo.poDate || null,
        items: state.poVo.productLines || [{ description: '', quantity: 0, rate: 0, amount: 0 }],
        termsAndConditions: state.poVo.termsAndConditions || DEFAULT_TERMS,
        subtotal: state.poVo.subtotal || 0,
        sgst: state.poVo.sgst || 0,
        cgst: state.poVo.cgst || 0,
        total: state.poVo.total || 0,
        gstType: state.poVo.gstType || '',
        igst: state.poVo.igst || 0
      }));
    }
  }, [state.poVo, state.editMode]);

  return (
    <Container style={{ maxWidth: 1060 }}>
      <Box sx={{ textAlign: 'right', mb: 3, gap: 2 }}>
        {!state.listView && (
          <>
            <Button variant="contained" color="primary" onClick={handlePrint} startIcon={<PrintIcon />}>
              Print
            </Button>
            <Button sx={{ ml: 1 }} variant="contained" color="primary" onClick={handleSave} startIcon={<SaveIcon />}>
              Save
            </Button>
          </>
        )}
        <Button
          sx={{ ml: 1 }}
          variant="contained"
          color="primary"
          onClick={handleListView}
          startIcon={state.listView ? <AddIcon /> : <VisibilityIcon />}
        >
          {state.listView ? 'New' : 'View'}
        </Button>
        {!state.listView && (
          <Button sx={{ ml: 1 }} variant="contained" color="primary" onClick={handleNew} startIcon={<AddIcon />}>
            New
          </Button>
        )}
      </Box>

      {state.listView ? (
        <PoList
          poData={state.poData}
          onListView={() => setState((prev) => ({ ...prev, listView: !prev.listView }))}
          setPoVo={(poVo) => setState((prev) => ({ ...prev, poVo, editMode: true, listView: false }))}
        />
      ) : (
        <PurchaseOrderForm
          ref={componentRef}
          {...state}
          setPoNumber={(poNumber) => setState((prev) => ({ ...prev, poNumber }))}
          setVendorAddress={(vendorAddress) => setState((prev) => ({ ...prev, vendorAddress }))}
          setDeliveryAddress={(deliveryAddress) => setState((prev) => ({ ...prev, deliveryAddress }))}
          setCompanyAddress={(companyAddress) => setState((prev) => ({ ...prev, companyAddress }))}
          setPoDate={(poDate) => setState((prev) => ({ ...prev, poDate }))}
          setTermsAndConditions={(termsAndConditions) => setState((prev) => ({ ...prev, termsAndConditions }))}
          handleItemChange={handleItemChange}
          handleAddRow={handleAddRow}
          handleDeleteRow={handleDeleteRow}
          handleGstCalculation={handleGstCalculation}
        />
      )}
    </Container>
  );
};

export default PurchaseOrder;
