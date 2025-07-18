import React, { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import apiCalls from 'apicall';

const dummyImageURL = 'https://t3.ftcdn.net/jpg/04/62/93/66/240_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';

const Quotationpdf = ({ row, callBackFunction, modalClose }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [companyDetails, setCompanyDetails] = useState({});
  const orgId = localStorage.getItem('orgId');
  // const componentRef = useRef();

  const styles = {
    container: {
      textAlign: 'center',
      margin: '0px 0',
      position: 'relative',
      fontFamily: 'Arial, sans-serif'
    },
    beforeAfter: {
      content: '""',
      position: 'absolute',
      top: '40%',
      width: '42%',
      height: '1px',
      backgroundColor: 'rgba'
    },
    before: {
      left: '0'
    },
    after: {
      right: '0'
    },
    text: {
      display: 'inline-block',
      padding: '0 5px',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#000000',
      borderRadius: '1px'
    }
  };

  // Group product lines by kitId
  const groupedData = (row.quotationDetailsVO || []).reduce((acc, item) => {
    const key = item.kitId || 'default';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  useEffect(() => {
    setOpen(true);
    setCurrentDateTime(dayjs().format('DD-MM-YYYY HH:mm:ss'));
    getCompanyDetails();

    if (callBackFunction) {
      setTimeout(() => {
        callBackFunction(handleDownloadPdf);
      }, 500);
    }
  }, [row, callBackFunction]);

  const getCompanyDetails = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      if (response.status === true) {
        setCompanyDetails(response.paramObjectsMap.companyVO[0] || {});
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (modalClose) modalClose();
  };

  const handleDownloadPdf = async () => {
    setLoading(true);
    const input = document.getElementById('main-content');
    if (!input) {
      console.error('Main content element not found!');
      return;
    }
    //  else {
    //    handleClose();
    //  }

    const canvas = await html2canvas(input, { scale: 2, useCORS: true, backgroundColor: '#fff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const padding = 5;
    const contentWidth = pdfWidth - 2 * padding;

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    const addFooter = () => {
      const footerY = pdfHeight - 8;
      pdf.setFontSize(8);
      pdf.text(`${currentDateTime} | Printed By: ${localStorage.getItem('userName') || 'Unknown User'}`, padding, footerY);
    };

    // Add first page
    pdf.addImage(imgData, 'PNG', padding, position + padding, contentWidth, imgHeight);
    addFooter();
    heightLeft -= pdfHeight - 2 * padding;
    position -= pdfHeight;

    // Add more pages if needed
    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', padding, position + padding, contentWidth, imgHeight);
      addFooter();
      heightLeft -= pdfHeight - 2 * padding;
      position -= pdfHeight;
    }

    pdf.save(`${row.quotationNo || 'Quotation_No'}.pdf`);
    handleClose();
    setLoading(false);
  };
  //
  // const allItems = Object.values(groupedData).flat();
  // const Amount = rate * quantity;
  // const grandTotal = allItems.reduce((acc, curr) => acc + (Number(curr.Amount) || 0), 0).toFixed(2);
  // const total = item.igst + grandTotal;
  const allItems = Object.values(groupedData).flat();

  const grandTotal = allItems.reduce((acc, curr) => {
    const rate = Number(curr.rate) || 0;
    const quantity = Number(curr.quantity) || 0;
    const amount = rate * quantity;
    return acc + amount;
  }, 0);

  const igstRate = Number(allItems[0]?.tax) || 0;
  const totalIGST = (grandTotal * igstRate) / 100;
  const total = (grandTotal + totalIGST).toFixed(2);

  // const grandTotal = allItems.reduce((acc, curr) => {
  //   const rate = Number(curr.rate) || 0;
  //   const quantity = Number(curr.quantity) || 0;
  //   const amount = rate * quantity;
  //   return acc + amount;
  // }, 0);

  // // Optional: if each item has `igst`, you can sum it like this
  // const totalIGST = allItems.reduce((acc, curr) => acc + (Number(curr.igst) || 0), 0);
  // const total = (parseFloat(grandTotal) + totalIGST).toFixed(2);

  //

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth keepMounted onEntered={() => setTimeout(handleDownloadPdf, 500)}>
      <DialogTitle>PDF Preview</DialogTitle>
      <DialogContent>
        <div
          id="main-content"
          style={{
            padding: '10px',
            width: '210mm',
            height: 'auto',
            margin: '0 auto',
            fontFamily: 'Roboto, Arial, sans-serif'
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              marginBottom: '5px',
              borderBottom: '2px solid #000000',
              paddingBottom: '3px',
              color: '#333'
            }}
          >
            {companyDetails.companyLogo && (
              <div className="d-flex flex-row">
                <img
                  src={`data:image/jpeg;base64,${companyDetails.companyLogo}`}
                  alt="Logo"
                  style={{ width: '80px', height: '97px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.src = dummyImageURL;
                  }}
                />
                <div className="ms-2">
                  <strong style={{ fontSize: '13px' }}>{localStorage.getItem('companyName')}</strong>
                  <div style={{ width: 198 }}>
                    <p style={{ textWrap: 'auto', textOverflow: 'ellipsis', fontSize: '8px', lineHeight: '1.6', marginBottom: 0 }}>
                      {companyDetails.address}
                    </p>
                  </div>
                  {companyDetails.city && (
                    <div className="d-flex flex-row" style={{ fontSize: '10px' }}>
                      {companyDetails.city} - {companyDetails.zip}
                    </div>
                  )}
                  {companyDetails.cin && (
                    <div className="d-flex flex-row" style={{ fontSize: '12px', margin: '0px' }}>
                      CIN: {companyDetails.cin}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/*  */}
            <div style={{ marginRight: '100px' }}>
              <strong style={{ fontSize: '15px' }}>Quotation</strong>
            </div>
            <div>
              <div className="mb-0" style={{ fontSize: '10px' }}>
                Quotation No<strong className="">: {row.quotationNo}</strong>
              </div>
              <div className="mb-0" style={{ fontSize: '10px' }}>
                Quotation Date<strong> : {row.quotationDate ? dayjs(row.quotationDate).format('DD-MM-YYYY') : 'N/A'}</strong>
              </div>
            </div>
          </div>

          {/* Vendor and Delivery */}
          {/*  */}
          {/* <div
            style={{
              marginBottom: '0px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#555'
            }}
          >
            <div>
              <strong style={{ fontSize: '10px' }} className="">
                Vendor Name: {row.vendorName}
              </strong>
              <div style={{ width: 250, marginBottom: 3, display: 'flex', alignItems: 'flex-start' }}>
                <strong style={{ marginRight: 3, whiteSpace: 'nowrap', fontSize: '10px' }}>Bill Address:</strong>
                <p style={{ margin: 0, fontSize: '8px', lineHeight: '1.6', wordBreak: 'break-word', flex: 1 }}>{row.companyAddress}</p>
              </div>
            </div>
            <div>
              <div style={{ width: 250, marginBottom: 3, display: 'flex', alignItems: 'flex-start' }}>
                <strong style={{ marginRight: 3, whiteSpace: 'nowrap', fontSize: '10px' }}>Delivery Address:</strong>
                <p style={{ margin: 0, fontSize: '8px', lineHeight: '1.6', wordBreak: 'break-word', flex: 1 }}>{row.deliveryAddress}</p>
              </div>
            </div>
          </div> */}
          <div
            style={{
              marginBottom: '0px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#555',
              alignItems: 'flex-start',
              gap: '20px'
            }}
          >
            {/* Left Side - Vendor Name & Bill Address */}
            <div style={{ width: '50%' }}>
              <div>
                <strong style={{ fontSize: '10px' }}>Customer Name: {row.customerName}</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginTop: 3
                }}
              >
                <strong style={{ marginRight: 3, whiteSpace: 'nowrap', fontSize: '10px' }}>Bill Address:</strong>
                <p
                  style={{
                    margin: '2px',
                    fontSize: '8px',
                    lineHeight: '1.6',
                    wordBreak: 'break-word',
                    flex: 1
                  }}
                >
                  {row.customerAddress}
                </p>
              </div>
            </div>

            {/* Right Side - Delivery Address */}
            <div style={{ width: '50%' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginTop: 16
                }}
              >
                <strong style={{ marginRight: 3, whiteSpace: 'nowrap', fontSize: '10px' }}>Delivery Address:</strong>
                <p
                  style={{
                    marginTop: '2px',
                    fontSize: '8px',
                    lineHeight: '1.6',
                    wordBreak: 'break-word',
                    flex: 1
                  }}
                >
                  {row.deliveryAddress}
                </p>
              </div>
            </div>
          </div>

          {/*  */}
          {/* Details Header */}
          <div style={styles.container}>
            <div style={{ ...styles.beforeAfter, ...styles.before }} />
            <span style={styles.text}>Details</span>
            <div style={{ ...styles.beforeAfter, ...styles.after }} />
          </div>

          {/* Details Table */}
          <TableContainer component={Paper} sx={{ mt: 1, borderRadius: 0, border: '1px groove #000' }}>
            <Table
              size="small"
              sx={{
                '& td, & th': {
                  padding: '0.5px',
                  fontSize: '10px',
                  borderRight: '1px groove #000',
                  borderBottom: '1px groove #000',
                  '&:last-child': {
                    borderRight: 'none'
                  }
                }
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    borderBottom: '1px groove #000',
                    '& th, & td': {
                      padding: '2px',
                      borderRight: '1px groove rgba(0, 0, 0, 0.5)',
                      '&:last-child': {
                        borderRight: 'none'
                      }
                    },
                    '& th': {
                      background: 'rgba(189, 186, 186, 0.74)',
                      color: 'black',
                      fontWeight: '600'
                    }
                  }}
                >
                  <TableCell align="right" component="th">
                    #
                  </TableCell>
                  <TableCell align="left" component="th">
                    Item
                  </TableCell>
                  <TableCell align="right" component="th">
                    Qty
                  </TableCell>
                  {/* {gstType === ''} */}
                  {/* <TableCell align="center">IGST%</TableCell>
                  <TableCell align="center">CGST%</TableCell>
                  <TableCell align="center">SGST%</TableCell> */}
                  <TableCell align="right" component="th">
                    Rate
                  </TableCell>
                  <TableCell align="right" component="th">
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedData).map(([kitId, items], kitIndex, arr) => (
                  <React.Fragment key={kitId}>
                    {items.map((item, idx) => {
                      const isLastItem = idx === items.length - 1;
                      return (
                        <TableRow
                          key={item.productCode || `${kitId}-${idx}`}
                          sx={{
                            backgroundColor: isLastItem && kitIndex !== arr.length - 1 ? '#e6e3e3' : 'inherit',
                            '& td': {
                              paddingLeft: '2px',
                              paddingRight: '2px',
                              borderBottom: '1px solid rgba(224, 224, 224, 0.5)'
                            }
                          }}
                        >
                          <TableCell align="right" marginleft="10px" rowSpan={isLastItem ? 2 : 1}>
                            {idx + 1}
                          </TableCell>
                          <TableCell align="left" width="500px">
                            {item.description}
                          </TableCell>

                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">{item.rate}</TableCell>
                          <TableCell align="right">{item.amount}</TableCell>
                        </TableRow>
                      );
                    })}
                    {/* Subtotal row after each group */}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <!-- Total Section --> */}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              marginTop: '8px',
              marginRight: '8px',
              fontWeight: 'bold',
              fontSize: '10px',
              color: '#333'
            }}
          >
            <div>Total: {grandTotal}</div>
            {/* {allItems.length > 0 && (
              <div>
                Tax {allItems[0].tax}%: ₹{totalIGST}
              </div>
            )} */}
            {/* <div>Total: {total}</div> */}
          </div>

          {/*  */}
          <hr style={{ margin: 0 }} />
          {/* Footer / Terms */}
          <div className="row mt-2 mb-0">
            <div className="col-lg-3">
              <strong style={{ fontSize: '9px' }}>Terms & Conditions:</strong>
            </div>
            <div className="col-lg-10">
              <p style={{ fontSize: '9px', margin: '0px' }}>
                1. Delivery Period: All the material must be delivered from your works within 1 week from the date of the purchase order.
              </p>
              <p style={{ fontSize: '9px', margin: '0px' }}>2. Payment Terms: 30 days from invoice submission through NEFT or check.</p>
              <p style={{ fontSize: '9px', margin: '0px' }}>
                3. Inspection & Testing: Inspection and quality check to be carried out by AI-PACKS designated executives during material
                dispatch.
              </p>
              <p style={{ fontSize: '9px', margin: '0px' }}>4. Statutory Requirements: NA</p>
              <p style={{ fontSize: '9px', margin: '0px' }}>5. Applicable GST will be charged as per statutory guidelines</p>
            </div>
          </div>
          {/*  */}
          {/* Footer Signature */}
          <div
            style={{
              marginTop: '20px',
              fontSize: '10px',
              textAlign: 'left',
              borderTop: '1px solid #000',
              paddingTop: '10px',
              position: 'relative'
            }}
          >
            <strong>Authorized Signature:</strong>
            <span style={{ display: 'inline-block', borderBottom: '1px solid #000', width: '220px', marginLeft: '5px' }}></span>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleDownloadPdf} startIcon={<DownloadIcon />} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'PDF'}
        </Button>
        <Button variant="contained" color="error" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Quotationpdf;
