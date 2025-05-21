import DownloadIcon from '@mui/icons-material/Download';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useReactToPrint } from "react-to-print";
import apiCalls from 'apicall';
import React, { useRef, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
} from '@mui/material';
const dummyImageURL = 'https://t3.ftcdn.net/jpg/04/62/93/66/240_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';

const MIMpdf = ({ row, callBackFunction, modalClose }) => {
  const [open, setOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [bankDetails, setBankDetails] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
const componentRef = useRef();
  const styles = {
    container: {
      textAlign: 'center',
      margin: '10px 0',
      position: 'relative',
      fontFamily: 'Arial, sans-serif'
    },
    beforeAfter: {
      content: '""',
      position: 'absolute',
      top: '50%',
      width: '40%',
      height: '2px',
      backgroundColor: '#333'
    },
    before: {
      left: '0'
    },
    after: {
      right: '0'
    },
    text: {
      display: 'inline-block',
      padding: '0 10px',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#000000',
      borderRadius: '2px'
    }
  };

  const styles1 = {
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: '20px',
      fontSize: '10px'
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '3px'
    },
    label: {
      fontWeight: 'bold'
    },
    value: {
      marginLeft: '5px'
    }
  };

  const styles2 = {
    container: {
      fontSize: '12px',
      margin: '10px 0'
    },
    heading: {
      marginBottom: '5px',
      textDecoration: 'underline',
      fontSize: '14px'
    },
    item: {
      margin: '3px 0'
    },
    label: {
      fontWeight: 'bold'
    }
  };

  // Function to open the dialog
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };
const handleDownloadPdf = async () => {
  const input = document.getElementById('main-content');
  if (!input) {
    console.error('Main content element not found!');
    return;
  }

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#fff'
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

  const padding = 5; // mm margin
  const contentWidth = pdfWidth - 2 * padding;

  const imgProps = pdf.getImageProperties(imgData);
  const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, 'PNG', padding, position + padding, contentWidth, imgHeight);
  heightLeft -= (pdfHeight - 2 * padding);
  position = -pdfHeight;

  // Additional pages
  while (heightLeft > 0) {
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', padding, position + padding, contentWidth, imgHeight);
    heightLeft -= (pdfHeight - 2 * padding);
    position -= pdfHeight;
  }

  pdf.save(`${row.transactionNo || 'MIM'}.pdf`);
};

useEffect(() => {
  setOpen(true);
  getBankDetailsByOrgId();
  getCompanyDetails();

  console.log("RowData =>", row);
  console.log("callback =>", callBackFunction);

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-GB');
  const formattedTime = now.toLocaleTimeString('en-GB');
  setCurrentDateTime(`${formattedDate} ${formattedTime}`);

  // ✅ Ensure the content is mounted before passing handleDownloadPdf
  if (callBackFunction) {
    setTimeout(() => {
      if (componentRef.current) {
        callBackFunction(handleDownloadPdf);
      }
    }, 500);
  }
}, [row, callBackFunction]);

  const getBankDetailsByOrgId = async () => {
    try {
      const response = await apiCalls('get', `/commonmaster/getBankDetailsByOrgId?orgId=${orgId}`);
      setBankDetails(response.paramObjectsMap.bankDetailsVO[0]);
      console.log('setBankDetails =>', response.paramObjectsMap.bankDetailsVO);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  const getCompanyDetails = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);

      if (response.status === true) {
        setCompanyDetails(response.paramObjectsMap.companyVO[0]);
        console.log('getCompanyDetails:', response.paramObjectsMap.companyVO[0]);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
const groupedData = (row.issueManifestProviderDetailsVOs || []).reduce((acc, row) => {
  const kitKey = row.kitId;
  if (!acc[kitKey]) acc[kitKey] = [];
  acc[kitKey].push(row);
  return acc;
}, {});
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      keepMounted 
      // onClick={handleDownloadPdf}
      onEntered={() => setTimeout(handleDownloadPdf, 500)}
    >
      <DialogTitle>PDF Preview</DialogTitle>
      <DialogContent>
        <div
          id="main-content"
          style={{
            padding: '10px',
            width: '210mm',
            height: 'auto',
            margin: '0 auto',
            fontFamily: 'Roboto, Arial, sans-serif',
            position: 'relative'
          }}
        >
          {/* <!-- Header Section --> */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              marginBottom: '10px',
              borderBottom: '2px solid #000000',
              paddingBottom: '5px',
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
                  <strong style={{fontSize: '13px'}}>{localStorage.getItem('companyName')}</strong>
                  {companyDetails.cin && (
                    <div className="d-flex flex-row" style={{ fontSize: '10px' }}>
                      CIN: {companyDetails.cin}
                    </div>
                  )}
                  <div style={{ width: 198 }}>
                    <p style={{ textWrap: 'auto', textOverflow: 'ellipsis', fontSize: '10px', lineHeight: '1.6', marginBottom: 0 }}>
                      {companyDetails.address}
                    </p>
                  </div>
                  {companyDetails.city && (
                    <div className="d-flex flex-row" style={{ fontSize: '10px' }}>
                      {companyDetails.city} - {companyDetails.zip}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div style={{ marginRight: '100px' }}>
              <strong style={{ fontSize: '13px' }}>MIM</strong>
            </div>
            <div>
              <div className="mb-1" style={{fontSize: '11px'}}>
                Transaction No <strong className="">: {row.transactionNo}</strong>
              </div>
              <div className="mb-1" style={{fontSize: '11px'}}>
                Transaction Date
                <strong> : {row.transactionDate ? dayjs(row.transactionDate).format('DD-MM-YYYY') : 'N/A'}</strong>
              </div>
              <div className="mb-1" style={{fontSize: '11px'}}>
                Dispatch Date
                <strong> : {row.dispatchDate ? dayjs(row.dispatchDate).format('DD-MM-YYYY') : 'N/A'}</strong>
              </div>
              <div className="mb-1" style={{fontSize: '11px'}}>
                Transaction Type <strong className="">: {row.transactionType}</strong>
              </div>
            </div>
          </div>

          {/* <!-- Details Section --> */}
          <div
            style={{
              marginBottom: '0px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#555'
            }}
          >
            <div>
              <strong style={{fontSize: '12px'}} className="">Sender : {row.sender}</strong>
              <div style={{ width: 250, marginBottom: 4, display: 'flex', alignItems: 'flex-start' }}>
                <strong style={{ marginRight: 4, whiteSpace: 'nowrap',fontSize: '12px' }}>WHS Address:</strong>
                <p style={{ margin: 0, fontSize: '10px', lineHeight: '1.6', wordBreak: 'break-word', flex: 1 }}>
                    {row.warehouseAddress}
                </p>
              </div>
            </div>
            <div>
                <strong style={{fontSize: '12px'}} className="">Receiver: {row.receiver}</strong>
                {row.receiverAddress && <div style={{ width: 250, marginBottom: 4, display: 'flex', alignItems: 'flex-start' }}>
                <strong style={{ marginRight: 4, whiteSpace: 'nowrap',fontSize: '12px' }}>Address:</strong>
                <p style={{ margin: 0, fontSize: '10px', lineHeight: '1.6', wordBreak: 'break-word', flex: 1 }}>
                    {row.receiverAddress}
                </p>
                </div>}
              <div>
                <strong className="">Reg In: </strong>{row.receiverGst}
              </div>
            </div>
          </div>

          <div style={styles.container}>
            <div style={{ ...styles.beforeAfter, ...styles.before }} />
            <span style={styles.text}>MIM Details</span>
            <div style={{ ...styles.beforeAfter, ...styles.after }} />
          </div>
                          <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 0}}>
                              <Table size="small" sx={{ '& td, & th': { padding: '1px', fontSize: '10px' } }}>
                              <TableHead>
                                    <TableRow sx={{ 
                                      backgroundColor: '#1976d2', 
                                      borderBottom: '2px solidrgb(0, 0, 0)',
                                      '& th': { 
                                        color: 'white', 
                                        fontWeight: '600',
                                        borderRight: '1px solid rgba(0, 0, 0, 0.5)',
                                        '&:last-child': {
                                          borderRight: 'none'
                                        }
                                      }
                                    }}>
                                  <TableCell style={{textAlign: 'center'}}>S.No</TableCell>
                                  <TableCell style={{textAlign: 'center'}}>Kit No</TableCell>
                                  <TableCell style={{textAlign: 'center'}}>Kit Name</TableCell>
                                  <TableCell style={{textAlign: 'center'}}>Kit Qty</TableCell>
                                  <TableCell style={{textAlign: 'center'}}>HSN/SAC</TableCell>
                                  <TableCell style={{textAlign: 'center'}}>Product Code</TableCell>
                                  <TableCell style={{textAlign: 'center'}}>Product Name</TableCell>
                                  <TableCell style={{textAlign: 'center'}}>Product Qty</TableCell>
                                </TableRow>
                              </TableHead>
                                <TableBody>
                                  {Object.entries(groupedData).map(([kitId, kitRows], kitIndex, kitArray) => (
                                    <React.Fragment key={kitId}>
                                      {kitRows.map((row, rowIndex) => (
                                        <TableRow key={row.id}>
                                          {rowIndex === 0 && (
                                            <>
                                              <TableCell rowSpan={kitRows.length}>{kitIndex + 1}</TableCell>
                                              <TableCell rowSpan={kitRows.length}>{row.kitId}</TableCell>
                                              <TableCell rowSpan={kitRows.length}>{row.kitName}</TableCell>
                                              <TableCell rowSpan={kitRows.length}>{row.kitQty}</TableCell>
                                              <TableCell rowSpan={kitRows.length}>{row.hsnCode}</TableCell>
                                            </>
                                          )}

                                          {rowIndex !== 0 && null}

                                          <TableCell>{row.assetCode}</TableCell>
                                          <TableCell>{row.asset}</TableCell>
                                          <TableCell>{row.assetQty}</TableCell>
                                        </TableRow>
                                      ))}

                                      {/* horizontal line */}
                                      {kitIndex !== kitArray.length - 1 && (
                                        <TableRow>
                                          <TableCell colSpan={8} sx={{ borderBottom: '1px solid #ddd', padding: 0 }} />
                                        </TableRow>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </TableBody>
                            </Table>
                          </TableContainer>
          {/* <!-- Total Section --> */}
          <div
            style={{
              textAlign: 'right',
              // fontWeight: 'bold',
              fontSize: '12px',
              color: '#333'
            }}
            className="d-flex justify-content-between mb-2"
          >
            <div
              style={{
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '12px',
                color: '#333'
              }}
            >
              <div style={{ width: '500px', marginBottom: '3px' }}>
                Amount in words:{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    fontStyle: 'italic',
                    color: '#333',
                    fontSize: '11px'
                  }}
                >
                  {row.amountInWords}
                </span>
              </div>
              <div style={{ width: '500px', marginBottom: '3px' }}>
                Transporter:{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    color: '#333',
                    fontSize: '11px'
                  }}
                >
                  {row.transporterName}
                </span>
              </div>
              {row.vehicleNo &&<div style={{ width: '500px', marginBottom: '3px' }}>
                Vehicle No:{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    color: '#333',
                    fontSize: '11px'
                  }}
                >
                  {row.vehicleNo}
                </span>
              </div>}
              {row.driverPhoneNo &&<div style={{ width: '500px', marginBottom: '3px' }}>
                Driver No:{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    color: '#333',
                    fontSize: '11px'
                  }}
                >
                  {row.driverPhoneNo}
                </span>
              </div>}
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column me-2">
                <p
                  className="mb-1"
                  style={{
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#333',
                    marginBottom: 0
                  }}
                >
                  Amount:
                </p>
              </div>
              <div className="d-flex flex-column">
                <div>
                  <span
                    style={{
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      fontSize: '10px',
                      color: '#333',
                      marginLeft: 3
                    }}
                  >
                    ₹{parseFloat(row.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <hr />
                    {/* Declaration */}
                    <div className="row mt-3 mb-2">
                      <div className="col-lg-2">
                        <strong style={{ width: 225, fontSize: '12px' }}>Declaration:</strong>
                      </div>
                      <div className="col-lg-10">
                        <p style={{fontSize: '11px'}}>
                          The packaging products given on hire shall always remain
                      the property of SCM AI-PACKS Private Limited and shall not
                      be used for the purpose otherwise agreed upon. The same
                      shall be returned at the address notified by SCM AI-PACKS
                      Private Limited.
                        </p>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-lg-2">
                        <strong style={{ width: 225, fontSize: '12px' }}>Note:</strong>
                      </div>
                      <div className="col-lg-10">
                        <p style={{fontSize: '11px'}}>
                          1.The goods listed in the above manifest are used empty
                      packaging issued to customer on a daily hire basis. The
                      service is packaging on{" "}
                      <strong>rental model and not sale to customer.</strong>
                          <br />
                          2. No E-Way Bill is required for Empty Cargo Containers.
                      Refer, Rule 14 of Central Goods and Services Tax (Second
                      Amendment) Rules, 2018.
                        </p>
                      </div>
                    </div>
                    <hr />
                    {/* Signatures */}
                    <div className="d-flex justify-content-between mt-4 mb-5">
                      <div className="ms-5">
                        <strong style={{fontSize: '12px'}} className="size">For Sending Location:</strong>
                      </div>
                      <div className="me-5">
                        <strong style={{fontSize: '12px'}} className="size">
                          For Receiving Location :
                        </strong>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-5 mb-5">
                      <div className="d-flex flex-column">
                        <div className="ms-5">
                          <strong style={{fontSize: '12px'}} className="size">
                            Authorized Signature:
                          </strong>
                        </div>
                        <div style={{fontSize: '12px'}} className="ms-4">(Company Seal & Signature)</div>
                      </div>
                      <div className="d-flex flex-column">
                        <div className="ms-4">
                          <strong style={{fontSize: '12px'}} className="size">
                            Authorized Signature:
                          </strong>
                        </div>
                        <div style={{fontSize: '12px'}} className="me-5">(Company Seal & Signature)</div>
                      </div>
                    </div>

          {/* <!-- Footer Section --> */}
          <div
            style={{
              borderTop: '2px solid #000000',
              paddingTop: '1px',
              fontSize: '10px',
              color: '#777',
              textAlign: 'center',
              // position: 'absolute',
              bottom: '0',
              width: '100%',
              marginTop: '5%'
            }}
          >
            {/* <!-- Footer Section --> */}
            <div
              style={{
                marginBottom: '10px',
                textAlign: 'left',
                fontSize: '10px',
                color: '#777'
              }}
            >
              <div>{currentDateTime}</div>
              <div>Printed By: {localStorage.getItem('userName')}</div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDownloadPdf} color="primary" variant="contained" startIcon={<DownloadIcon />}>
          PDF
        </Button>
        <Button onClick={modalClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default MIMpdf;
