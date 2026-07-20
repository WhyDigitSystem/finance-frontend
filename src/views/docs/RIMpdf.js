import DownloadIcon from '@mui/icons-material/Download';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import companySeal from '../../assets/images/users/aipta.png'
import accountantSign from '../../assets/images/icons/Sign.png'
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
import { margin } from '@mui/system';
const dummyImageURL = 'https://t3.ftcdn.net/jpg/04/62/93/66/240_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';

const RIMpdf = ({ row, callBackFunction, modalClose }) => {
  const [open, setOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [bankDetails, setBankDetails] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [userType, setUserType] = useState(localStorage.getItem('userType'));
  const [selectedCopy, setSelectedCopy] = useState('');
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const componentRef = useRef();
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
      backgroundColor: 'rgba',
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
      fontSize: '10px',
      margin: '10px 0'
    },
    heading: {
      marginBottom: '5px',
      textDecoration: 'underline',
      fontSize: '12px'
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
    if (!selectedCopy) return;

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

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const padding = 5;
    const contentWidth = pdfWidth - 2 * padding;
    const footerHeight = 10; // Space reserved for footer

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Function to add footer to each page
    const addFooter = () => {
      const footerY = pdfHeight - 8; // Position 8mm from bottom
      pdf.setFontSize(8);
      // Left-aligned footer: Date and Printed By
      pdf.text(
        `${currentDateTime} | Printed By: ${localStorage.getItem('userName')}`,
        padding,
        footerY
      );
      // Right-aligned footer: Selected Copy
      if (selectedCopy) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        const text = selectedCopy;
        const textWidth = pdf.getStringUnitWidth(text) * pdf.getFontSize() / pdf.internal.scaleFactor;
        pdf.text(text, pdfWidth - padding - textWidth, footerY);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
      }
    };

    // First page
    pdf.addImage(imgData, 'PNG', padding, position + padding, contentWidth, imgHeight);
    addFooter();
    heightLeft -= (pdfHeight - 2 * padding);
    position = -pdfHeight;

    // Additional pages
    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', padding, position + padding, contentWidth, imgHeight);
      addFooter();
      heightLeft -= (pdfHeight - 2 * padding);
      position -= pdfHeight;
    }

    pdf.save(`${row.refNo || 'RM'}_${row.code}_${selectedCopy}.pdf`);
    setSelectedCopy('');
  };
  // Trigger PDF download when selectedCopy changes
  useEffect(() => {
    if (selectedCopy) {
      handleDownloadPdf();
    }
  }, [selectedCopy]);
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
  const groupedData = (row.retrievalManifestProviderDetailsVOs || []).reduce((acc, row) => {
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
            <div style={{ marginRight: '100px' }}>
              <strong style={{ fontSize: '15px' }}>Retrieval Manifest</strong>
            </div>
            <div>
              <div className="mb-0" style={{ fontSize: '10px' }}>
                Docket No<strong className="">: {row.refNo}</strong>
              </div>
              <div className="mb-0" style={{ fontSize: '10px' }}>
                Date<strong> : {row.transactionDate ? dayjs(row.transactionDate).format('DD-MM-YYYY') : 'N/A'}</strong>
              </div>
              <div className="mb-0" style={{ fontSize: '10px' }}>
                Dispatch Date<strong> : {row.dispatchDate ? dayjs(row.dispatchDate).format('DD-MM-YYYY') : 'N/A'}</strong>
              </div>
              <div className="mb-0" style={{ fontSize: '10px' }}>
                Type<strong className="">: {row.transactionType}</strong>
              </div>
            </div>
          </div>

          {/* <!-- Details Section --> */}
          <div
            style={{
              marginBottom: '0px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#555'
            }}
          >
            <div>
              {/* <strong style={{fontSize: '10px'}} className="">Sender: {localStorage.getItem('companyName')}</strong> */}
              <strong style={{ fontSize: '10px' }} className="">Sender: C/O {row.sender}</strong>
              <div style={{ width: 250, marginBottom: 3, display: 'flex', alignItems: 'flex-start' }}>
                <strong style={{ marginRight: 3, whiteSpace: 'nowrap', fontSize: '10px' }}>Address:</strong>
                <p style={{ margin: 0, fontSize: '8px', lineHeight: '1.6', wordBreak: 'break-word', flex: 1 }}>
                  {row.senderAddress}
                </p>
              </div>
              <strong className="">GST In: </strong>{row.senderGst}
            </div>
            <div>
              <strong style={{ fontSize: '10px' }} className="">Receiver: {row.receiver}</strong>
              {row.receiverAddress && <div style={{ width: 250, marginBottom: 3, display: 'flex', alignItems: 'flex-start' }}>
                <strong style={{ marginRight: 3, whiteSpace: 'nowrap', fontSize: '10px' }}>Address:</strong>
                <p style={{ margin: 0, fontSize: '8px', lineHeight: '1.6', wordBreak: 'break-word', flex: 1 }}>
                  {row.receiverAddress}
                </p>
              </div>}
              <strong className="">GST In: </strong>{row.receiverGst}
              {/* </div> */}

            </div>
          </div>

          <div style={styles.container}>
            <div style={{ ...styles.beforeAfter, ...styles.before }} />
            <span style={styles.text}>KIT Details</span>
            <div style={{ ...styles.beforeAfter, ...styles.after }} />
          </div>
          <TableContainer component={Paper} sx={{ mt: 1, borderRadius: 0, border: '1px groove #000', }}>
            <Table size="small" sx={{
              '& td, & th': {
                padding: '0.5px', fontSize: '10px', borderRight: '1px groove #000', borderBottom: '1px groove #000', '&:last-child': {
                  borderRight: 'none'
                }
              }
            }}>
              <TableHead>
                <TableRow sx={{
                  borderBottom: '1px groove #000',
                  '& th': {
                    background: ' rgba(189, 186, 186, 0.74)',
                    color: 'black',
                    fontWeight: '600',
                    borderRight: '1px groove rgba(0, 0, 0, 0.5)',
                    '&:last-child': {
                      borderRight: 'none'
                    }
                  }
                }}>
                  <TableCell style={{ textAlign: 'center' }}>S.No</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Kit No</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Kit Name</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Kit Qty</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>HSN/SAC</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Product Code</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Product Name</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Product Qty</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedData).map(([kitId, kitRows], kitIndex, kitArray) => (
                  <React.Fragment key={kitId}>
                    {kitRows.map((row, rowIndex) => (
                      <TableRow key={row.id}>
                        {rowIndex === 0 && (
                          <>
                            <TableCell style={{ textAlign: 'center' }} rowSpan={kitRows.length}>{kitIndex + 1}</TableCell>
                            <TableCell style={{ textAlign: 'center' }} rowSpan={kitRows.length}>{row.kitId}</TableCell>
                            <TableCell style={{ textAlign: 'center' }} rowSpan={kitRows.length}>{row.kitName}</TableCell>
                            <TableCell style={{ textAlign: 'center' }} rowSpan={kitRows.length}>{row.kitQty}</TableCell>
                            <TableCell style={{ textAlign: 'center' }} rowSpan={kitRows.length}>{row.hsnCode}</TableCell>
                          </>
                        )}

                        {rowIndex !== 0 && null}

                        <TableCell style={{ textAlign: 'center' }}>{row.assetCode}</TableCell>
                        <TableCell>{row.asset}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{row.actualQty}</TableCell>
                      </TableRow>
                    ))}

                    {/* horizontal line */}
                    {kitIndex !== kitArray.length - 1 && (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ borderBottom: '1px groove #ddd', padding: 0 }} />
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
              fontSize: '10px',
              color: '#333'
            }}
            className="d-flex justify-content-between mb-2"
          >
            <div
              style={{
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '10px',
                color: '#333'
              }}
            >
              <div style={{ width: '500px', marginBottom: '2px' }}>
                Amount in words:{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    fontStyle: 'italic',
                    color: '#333',
                    fontSize: '10px'
                  }}
                >
                  {row.amountInWords}
                </span>
              </div>
              <div style={{ width: '500px', marginBottom: '2px' }}>
                Transporter:{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    color: '#333',
                    fontSize: '10px'
                  }}
                >
                  {row.transporterName}
                </span>
              </div>
              {/* {row.vehicleNo && */}
              <div style={{ width: '500px', marginBottom: '2px' }}>
                Vehicle No:{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    color: '#333',
                    fontSize: '10px'
                  }}
                >
                  {row.vehicleeNo}
                </span>
              </div>
              {/* } {row.driverPhoneNo && */}
              <div style={{ width: '500px', marginBottom: '2px' }}>
                Driver No:{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    color: '#333',
                    fontSize: '10px'
                  }}
                >
                  {row.driverPhoneNo}
                </span>
              </div>
              {/* } */}
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column me-2">
                <p
                  className="mb-1"
                  style={{
                    fontWeight: 'bold',
                    fontSize: '10px',
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
                      fontSize: '8px',
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
          <hr style={{ margin: 0 }} />
          {/* Declaration */}
          <div className="row mt-0 mb-0">
            <div className="col-lg-1">
              <strong style={{ width: 225, fontSize: '9px' }}>Declaration:</strong>
            </div>
            <div className="col-lg-10">
              <p style={{ fontSize: '9px', margin: '0px' }}>
                The packaging products given on hire shall always remain
                the property of SCM AI-PACKS Private Limited and shall not
                be used for the purpose otherwise agreed upon. The same
                shall be returned at the address notified by SCM AI-PACKS
                Private Limited.
              </p>
            </div>
          </div>
          <div className="row mb-1">
            <div className="col-lg-1">
              <strong style={{ width: 225, fontSize: '9px' }}>Note:</strong>
            </div>
            <div className="col-lg-10">
              <p style={{ fontSize: '9px' }}>
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
          <hr style={{ margin: 0 }} />
          {/* Signatures */}
          <div className="d-flex justify-content-between mt-1 mb-1">
            <div className="ms-5">
              <strong style={{ fontSize: '10px' }} className="size">For Sending Location:</strong>
            </div>
            <div className="me-5">
              <strong style={{ fontSize: '10px' }} className="size">
                For Receiving Location :
              </strong>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-0 mb-0">
            {row.sender?.startsWith("SHIP SECURE LOGISTICS") ? (
              <div style={{ height: "85px" }} />
            ) : (
              // Otherwise show seal + sign
              <div className="d-flex">
                <div className="me-3 ms-5">
                  <img
                    src={companySeal}
                    alt="Company Seal"
                    style={{ height: "85px", objectFit: "contain" }}
                  />
                </div>
                <div className="ms-3" style={{ height: "85px" }}>
                  <img
                    src={accountantSign}
                    alt="Accountant Sign"
                    style={{ height: "85px", objectFit: "contain" }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-between mt-1 mb-1">
            <div className="d-flex flex-column">
              <div className="ms-5">
                <strong style={{ fontSize: '10px' }} className="size">
                  Authorized Signature:
                </strong>
              </div>
              <div style={{ fontSize: '10px' }} className="ms-4">(Company Seal & Signature)</div>
            </div>
            <div className="d-flex flex-column">
              <div className="ms-4">
                <strong style={{ fontSize: '10px' }} className="size">
                  Authorized Signature:
                </strong>
              </div>
              <div style={{ fontSize: '10px' }} className="me-5">(Company Seal & Signature)</div>
            </div>
          </div>

          {/* <!-- Footer Section --> */}
          <div
            style={{
              borderTop: '1px outset',
              paddingTop: '1px',
              fontSize: '8px',
              color: '#777',
              textAlign: 'center',
              // position: 'absolute',
              bottom: '0',
              width: '100%',
              marginTop: '5%'
            }}
          >
            {/* <!-- Footer Section --> */}
            {/* <div
              style={{
                marginBottom: '10px',
                textAlign: 'left',
                fontSize: '8px',
                color: '#777'
              }}
            >
              <div>{currentDateTime}</div>
              <div>Printed By: {localStorage.getItem('userName')}</div>
            </div> */}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        {
          userType === 'FINANCE MANAGER' ?
            '' :
            <Button onClick={() => setCopyDialogOpen(true)} color="primary" variant="contained" startIcon={<DownloadIcon />}>
              PDF
            </Button>
        }
        <Button onClick={modalClose} color="secondary">
          Close
        </Button>
      </DialogActions>
      <Dialog open={copyDialogOpen} onClose={() => setCopyDialogOpen(false)}>
        <DialogTitle>Select Copy Type</DialogTitle>
        <DialogContent>
          <Button
            fullWidth
            onClick={() => {
              setSelectedCopy('Consignee Copy');
              setCopyDialogOpen(false);
            }}
            sx={{ mb: 1 }}
          >
            Consignee Copy
          </Button>
          <Button
            fullWidth
            onClick={() => {
              setSelectedCopy('Transporter Copy');
              setCopyDialogOpen(false);
            }}
            sx={{ mb: 1 }}
          >
            Transporter Copy
          </Button>
          <Button
            fullWidth
            onClick={() => {
              setSelectedCopy('Consigner Copy');
              setCopyDialogOpen(false);
            }}
          >
            Consigner Copy
          </Button>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};
export default RIMpdf;
