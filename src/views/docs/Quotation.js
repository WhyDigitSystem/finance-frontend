import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  Typography
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import numberToWords from 'number-to-words';
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import QuotationList from './QuotationList';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'white',
  color: 'black',
  fontWeight: 'bold',
  border: '1px solid black', // Ensure borders are applied to all sides
  '@media print': {
    border: '1px solid black' // Ensure borders are visible when printing
  }
}));

const StyledTableCellActions = styled(StyledTableCell)(({ theme }) => ({
  '@media print': {
    display: 'none' // hide Actions cell when printing
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  [`@media print`]: {
    border: 'none',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    },
    '& .MuiInputBase-input': {
      padding: 0
    }
  }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  '@media print': {
    display: 'none' // Hide the delete button when printing
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  '@media print': {
    display: 'none' // Hide the add row button when printing
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  '@media print': {
    border: '1px solid black', // Border around the entire table container when printing
    boxShadow: 'none' // Remove shadow when printing
  }
}));

const PurchaseOrder = React.forwardRef((props, ref) => {
  const {
    customerAddress,
    setCustomerAddress,
    subtotal,
    gstType,
    handleGstCalculation,
    sgst,
    cgst,
    igst,
    total,
    companyAddress,
    setCompanyAddress,
    quotationTo,
    setQuotationTo,
    shippingAddress,
    setShippingAddress,
    code,
    setCode
  } = props;

  const formatIndianCurrency = (number) => {
    if (number === 0) return 'Zero';

    const crore = Math.floor(number / 10000000);
    const lakh = Math.floor((number % 10000000) / 100000);
    const thousand = Math.floor((number % 100000) / 1000);
    const remainder = number % 1000;

    let formatted = '';

    if (crore > 0) {
      formatted += `${numberToWords.toWords(crore)} crore`;
    }

    if (lakh > 0) {
      if (formatted) formatted += ' ';
      formatted += `${numberToWords.toWords(lakh)} lakh`;
    }

    if (thousand > 0) {
      if (formatted) formatted += ' ';
      formatted += `${numberToWords.toWords(thousand)} thousand`;
    }

    if (remainder > 0) {
      if (formatted) formatted += ' ';
      formatted += `${numberToWords.toWords(remainder)}`;
    }

    // Convert to title case
    const toTitleCase = (str) => {
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };

    return toTitleCase(formatted.trim());
  };

  // Example usage:
  const totalInWordsIndianCurrency = formatIndianCurrency(total);

  return (
    <div>
      <div>
        <ToastContainer />
      </div>
      <Paper ref={ref} elevation={3} sx={{ padding: 4, fontFamily: 'Roboto, sans-serif' }}>
        <Container>
          <Box sx={{ mb: 1 }}>
            <Box sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                IT Services| Axpert | Software & Solutions |ERP | BI | Staffing | DB
              </Typography>
            </Box>
            <Grid
              container
              spacing={2}
              sx={{
                mt: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {/* Left Box */}
              <Grid item xs={2}>
                {/* <img src="/wds_logo.png" style={{ width: '100px' }}></img> */}
                <img src="/AI_Packs.png" style={{ width: '100%', maxWidth: '100px' }} alt="Company Logo" />
              </Grid>
              <Grid item xs={5}>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography
                    variant="h5"
                    sx={{ mt: 1, width: '100%', backgroundColor: '#fff', padding: 2, borderRadius: 3, boxShadow: 2 }}
                  >
                    Why Digit System Private Limited, 29/1, T.C Palya Main Road, Hoysala Nagar, Bangalore – 560016. &#10;GST-29AADCW3710D1ZK
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Grid
            container
            spacing={3}
            sx={{
              mb: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end'
            }}
          >
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 'bold', mb: 1 }}>TO:</Typography>
              <StyledTextField
                fullWidth
                variant="outlined"
                multiline
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                sx={{ mb: 0, mt: 0 }}
              />
            </Grid>

            <Grid item xs={4}>
              <StyledTextField
                fullWidth
                variant="outlined"
                multiline
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{
                  mb: 0,
                  mt: 0,
                  backgroundColor: '#2596be',
                  color: '#ffffff',
                  '& .MuiInputBase-input': {
                    color: '#ffffff'
                  }
                }}
              />
            </Grid>
          </Grid>

          {/* WHY DIGIT SYSTEM SOLUTION AND KEY BENEFIT */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              WHY DIGIT SYSTEM SOLUTION AND KEY BENEFIT
            </Typography>

            <Box sx={{ pl: 2 }}>
              <Typography>• Control Your Business from anywhere.</Typography>
              <Typography>• Manage Multiple Locations from a single Platform.</Typography>
              <Typography>• Integrate seamlessly with your vendor and customer.</Typography>
              <Typography>• Move from reactive to Pro-active management.</Typography>
              <Typography>• Customize to suit needs.</Typography>
              <Typography>
                • Efit ERP - Key Modules: Purchase, Sales, Inventory, Planning & Production, QC, and fully VAP-based customization in the
                selected modules.
              </Typography>
            </Box>
          </Box>

          {/* CONTROL MANAGEMENT */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              CONTROL MANAGEMENT
            </Typography>
            <Typography>
              It’s a very useful module for the top management to monitor and control men and machine behaviors effectively.
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography>• Schedule Tasks</Typography>
              <Typography>• Notification</Typography>
              <Typography>• Escalation</Typography>
            </Box>
          </Box>
          {/* Commercial */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            COMMERCIAL
          </Typography>

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
                {props.items.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '4px',
                            backgroundColor: '#fff'
                          }
                        }}
                        value={item.description}
                        onChange={(e) => props.handleItemChange(index, 'description', e.target.value)}
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '4px',
                            backgroundColor: '#fff'
                          }
                        }}
                        variant="outlined"
                        type="number"
                        value={item.unit}
                        onChange={(e) => props.handleItemChange(index, 'unit', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        type="number"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '4px',
                            backgroundColor: '#fff'
                          }
                        }}
                        size="small"
                        value={item.pricre}
                        onChange={(e) => props.handleItemChange(index, 'pricre', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>{item.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => props.handleDeleteRow(index)} sx={{ color: '#f44336' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={props.handleAddRow}
            sx={{ mb: 0, mt: 1 }}
          >
            Add Row
          </StyledButton>

          {/* Calculation Section */}
          <Box sx={{ textAlign: 'right', mb: 0 }}>
            {/* GST Type Selection */}
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
                <Box sx={{ textAlign: 'left', maxWidth: 500 }}>
                  <Typography sx={{ fontWeight: 'bold', mt: 1 }}>Total in Words: ₹ {totalInWordsIndianCurrency} Only</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'right', mb: 0 }}>
                  <Typography sx={{ fontWeight: 'bold' }}>Subtotal: ₹ {subtotal.toFixed(2)}</Typography>
                  {gstType === 'intra' && (
                    <>
                      <Typography sx={{ fontWeight: 'bold' }}>SGST (9%): ₹ {sgst.toFixed(2)}</Typography>
                      <Typography sx={{ fontWeight: 'bold' }}>CGST (9%): ₹ {cgst.toFixed(2)}</Typography>
                    </>
                  )}
                  {gstType === 'inter' && <Typography sx={{ fontWeight: 'bold' }}>IGST (18%): ₹ {igst.toFixed(2)}</Typography>}
                  <Typography sx={{ fontWeight: 'bold' }}>Total: ₹ {total.toFixed(2)}</Typography>
                </Box>
              </Grid>
            </Grid>

            {/* GST Calculation Result */}
          </Box>

          {/* TERMS OF CONTRACT */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              TERMS & CONDITIONS
            </Typography>

            <Box sx={{ pl: 2 }}>
              <Typography>• Post sign-off, any unique customization on request will be charged extra as per MM effort.</Typography>
              <Typography>• 3 Months free support from post-implementation.</Typography>
              <Typography>
                • One-time setup cost includes setting up the application on the server and providing full training sessions for each module
                to end users.
              </Typography>
              <Typography>
                • Onsite support will be provided on a need basis. Travel, conveyance, boarding & lodging will be charged extra as per
                actuals.
              </Typography>
              <Typography>
                • A support login ID is required for customers to log tickets with Why Digit System. A customer can log 2 tickets per day
                through one login ID.
              </Typography>
              <Typography>
                • Support includes resolving any problems related to software availability and providing knowledge on how to use the system.
                It does not include creating new forms or reports.
              </Typography>
              <Typography>• All the above-mentioned costs are exclusive of all regulatory taxes.</Typography>
              <Typography>• Taxes are extra and will be charged as applicable.</Typography>
              <Typography>• Payment Terms: As per the payment policy mentioned below.</Typography>
            </Box>
          </Box>
          {/* TERMS OF CONTRACT */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              TIMELINE
            </Typography>

            <Box sx={{ pl: 2 }}>
              <Typography>• 3 months after readiness of Customer specifications and prototype confirmation.</Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              PAYMENTS
            </Typography>
            <TableContainer sx={{ backgroundColor: '#fff', padding: 1, borderRadius: 3, boxShadow: 2 }}>
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>Payment Terms</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>Percentage</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableRow>
                  <TableCell>Advance Payment against PO /WO </TableCell>
                  <TableCell>50%</TableCell>
                  <TableCell>Of Total cost</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>On Completion of 1nd month</TableCell>
                  <TableCell>15%</TableCell>
                  <TableCell>Of Total cost</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>On Completion of 2nd month</TableCell>
                  <TableCell>15%</TableCell>
                  <TableCell>Of Total cost</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>On Completion of ERP Hosting</TableCell>
                  <TableCell>20%</TableCell>
                  <TableCell>Of Total cost</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>100%</TableCell>
                  <TableCell>Of Total cost</TableCell>
                </TableRow>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Thanks Note
            </Typography>
            <p>Thanks for the opportunities to work with VAP. Please let’s know if any query or clarification.</p>
            <TableContainer sx={{ backgroundColor: '#fff', padding: 1, borderRadius: 3, boxShadow: 2 }}>
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      multiline
                      value={quotationTo}
                      onChange={(e) => setQuotationTo(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
                          backgroundColor: '#fff'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {/* Company Name Editable Field */}
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      multiline
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
                          backgroundColor: '#fff'
                        }
                      }}
                    />
                  </TableCell>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Sign & Seal</TableCell>
                    <TableCell>Sign & Seal</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </Paper>
    </div>
  );
});

const Quotation = () => {
  const componentRef = useRef();

  const [companyAddress, setCompanyAddress] = useState(
    'Why Digit System Private Limited,29/1, T.C Palya Main Road,Hoysala Nagar Bangalore – 560016.'
  );
  const [quotationList, setQuotationList] = useState([]);
  const [quotationAdviceData, setQuotationAdviceData] = useState(null);
  const [items, setItems] = useState([
    {
      description: '',
      unit: 0,
      pricre: 0,
      total: 0
    }
  ]);

  const [editMode, setEditMode] = useState(false);
  const [customerAddress, setCustomerAddress] = useState('');
  const [quotationTo, setQuotationTo] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [code, setCode] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [total, setTotal] = useState(0);
  const [orgId, setOrgId] = useState(parseInt(window.localStorage.getItem('orgId')));
  const [gstType, setGstType] = useState(''); // "inter" or "intra"
  const [igst, setIgst] = useState(0);
  const [listView, setListView] = useState(false);

  // Function to handle GST calculation
  const handleGstCalculation = (type) => {
    setGstType(type);
    const gstRate = 0.18;
    const halfGstRate = gstRate / 2;

    let calculatedIgst = 0;
    let calculatedCgst = 0;
    let calculatedSgst = 0;

    if (type === 'inter') {
      calculatedIgst = subtotal * gstRate;
      calculatedCgst = 0;
      calculatedSgst = 0;
    } else if (type === 'intra') {
      calculatedIgst = 0;
      calculatedCgst = subtotal * halfGstRate;
      calculatedSgst = subtotal * halfGstRate;
    }

    setIgst(calculatedIgst);
    setCgst(calculatedCgst);
    setSgst(calculatedSgst);
    setTotal(subtotal + calculatedIgst + calculatedCgst + calculatedSgst);
  };

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: `Quotation`
  // });

  // const handlePrint = async () => {
  //   const element = componentRef.current;
  //   if (!element) return;

  //   const canvas = await html2canvas(element, {
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
  //   pdf.save('output.pdf');
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

    pdf.save('output.pdf');
  };

  const handleSave = () => {
    postInvoice();
  };

  const handleAddRow = () => {
    setItems([
      ...items,
      {
        description: '',
        unit: 0,
        pricre: 0,
        total: 0
      }
    ]);
  };

  const handleDeleteRow = (index) => {
    const newItems = items.filter((item, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'unit' || field === 'pricre') {
      newItems[index].total = newItems[index].unit * newItems[index].pricre;
    }
    setItems(newItems);
  };
  const [isPrintMode, setIsPrintMode] = useState(false);

  useEffect(() => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    setSubtotal(subtotal);

    if (gstType === 'inter') {
      const igst = subtotal * 0.18;
      setIgst(igst);
      setTotal(subtotal + igst);
    } else if (gstType === 'intra') {
      const cgst = subtotal * 0.09;
      const sgst = subtotal * 0.09;
      setCgst(cgst);
      setSgst(sgst);
      setTotal(subtotal + cgst + sgst);
    } else {
      setIgst(0);
      setCgst(0);
      setSgst(0);
      setTotal(subtotal);
    }
  }, [items, gstType]);

  useEffect(() => {
    getAllQutationById();
  }, []);

  const createFormData = () => {
    const currentYear = new Date().getFullYear();
    const data = {
      customerAddress,
      companyAddress,
      quotationTo,
      shippingAddress,
      code,
      quotationDetailsDTO: items?.length ? items : [],
      subtotal,
      sgst,
      cgst,
      total,
      gstType,
      finYear: currentYear,
      igst,
      ...(editMode && { id: quotationAdviceData?.id })
    };
    return data;
  };

  // Example usage:

  // You can now use `formData` to make an API request

  const postInvoice = () => {
    const formData = createFormData();

    if (formData) {
      const formDataWithOrgId = { ...formData, orgId };

      axios
        .put(`${process.env.REACT_APP_API_URL}/api/reportController/createUpdateQuotatio`, formDataWithOrgId)
        .then((response) => {
          console.log('Response:', response.data);
          console.log('Form Data:', formDataWithOrgId);

          if (response.data.statusFlag === 'Error') {
            // showErrorToast(response.data.paramObjectsMap.errorMessage);
          } else {
            showSuccessToast(editMode ? 'Quotation Updated Successfully' : response.data.paramObjectsMap.message);
            getAllQutationById();
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          showErrorToast('An error occurred while posting the invoice.');
        });
    } else {
      showErrorToast('No invoice data to post.');
    }
  };

  const getAllQutationById = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reportController/getQuotationByorgId?orgId=${orgId}`);
      if (response.status === 200) {
        setQuotationList(response.data.paramObjectsMap.quotationVO.reverse());
      } else {
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleListView = () => {
    setListView(!listView);
    handleNew();
  };
  useEffect(() => {
    if (quotationAdviceData && editMode) {
      setCustomerAddress(quotationAdviceData.customerAddress || '');
      setQuotationTo(quotationAdviceData.quotationTo || '');
      setShippingAddress(quotationAdviceData.shippingAddress || '');
      setCode(quotationAdviceData.code || '');
      setCompanyAddress(quotationAdviceData.companyAddress || '');
      setCompanyAddress(quotationAdviceData.quotationTo || '');
      setItems(quotationAdviceData.productLines || []);
      setSubtotal(quotationAdviceData.subtotal || 0);
      setSgst(quotationAdviceData.sgst || 0);
      setCgst(quotationAdviceData.cgst || 0);
      setTotal(quotationAdviceData.total || 0);
      setGstType(quotationAdviceData.gstType || '');
      setItems(quotationAdviceData.quotationDetailsVO || []);
      setIgst(quotationAdviceData.igst || 0);
    }
  }, [quotationAdviceData, editMode]);

  const handleNew = () => {
    setCustomerAddress('');
    setCode('');
    setQuotationTo('');
    setShippingAddress('');
    setItems([
      {
        description: '',
        unit: 0,
        pricre: 0,
        total: 0
      }
    ]);
    // setTermsAndConditions("");
    setSubtotal(0);
    setSgst(0);
    setCgst(0);
    setTotal(0);
    setGstType('');
    setIgst(0);
    setEditMode(false);
  };

  return (
    <Container style={{ maxWidth: 1060 }}>
      <Box sx={{ textAlign: 'right', mb: 3, gap: 2 }}>
        {!listView && (
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrint}
            startIcon={<PrintIcon />} // Add icon here
          >
            Print
          </Button>
        )}
        {!listView && (
          <Button
            sx={{ ml: 1 }}
            variant="contained"
            color="primary"
            onClick={handleSave}
            startIcon={<SaveIcon />} // Add icon here
          >
            Save
          </Button>
        )}
        <Button
          sx={{ ml: 1 }}
          variant="contained"
          color="primary"
          onClick={handleListView}
          startIcon={listView ? <AddIcon /> : <VisibilityIcon />} // Add icon here
        >
          {listView ? 'New' : ' View'}
        </Button>
        {!listView && (
          <Button
            sx={{ ml: 1 }}
            variant="contained"
            color="primary"
            onClick={handleNew}
            startIcon={<AddIcon />} // Add icon here
          >
            New
          </Button>
        )}
      </Box>
      {listView ? (
        <QuotationList
          quotationAdviceData={quotationList}
          onListView={setListView}
          setQuotationAdviceData={setQuotationAdviceData}
          setEditMode={setEditMode}
        />
      ) : (
        <div>
          <PurchaseOrder
            ref={componentRef}
            customerAddress={customerAddress}
            setCustomerAddress={setCustomerAddress}
            quotationTo={quotationTo}
            setQuotationTo={setQuotationTo}
            shippingAddress={shippingAddress}
            code={code}
            setCode={setCode}
            setShippingAddress={setShippingAddress}
            items={items}
            handleItemChange={handleItemChange}
            handleAddRow={handleAddRow}
            handleDeleteRow={handleDeleteRow}
            subtotal={subtotal}
            sgst={sgst}
            cgst={cgst}
            handleGstCalculation={handleGstCalculation}
            igst={igst}
            setSgst={setSgst}
            setCgst={setCgst}
            setIgst={setIgst}
            gstType={gstType}
            total={total}
            subTotal={subtotal}
            isPrintMode={isPrintMode}
            companyAddress={companyAddress}
            setCompanyAddress={setCompanyAddress}
            editMode={editMode}
          />
        </div>
      )}
    </Container>
  );
};
export default Quotation;
