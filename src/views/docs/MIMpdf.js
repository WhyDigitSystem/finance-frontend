import DownloadIcon from '@mui/icons-material/Download';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import apiCalls from 'apicall';
import React from 'react';

const dummyImageURL = 'https://t3.ftcdn.net/jpg/04/62/93/66/240_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';

const MIMpdf = ({ row, callBackFunction, modalClose }) => {
  const [open, setOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [bankDetails, setBankDetails] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));

  const styles = {
    container: {
      textAlign: 'center',
      margin: '20px 0',
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
      padding: '0 15px',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#000000',
      borderRadius: '5px'
    }
  };

  const styles1 = {
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: '20px',
      fontSize: '12px'
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px'
    },
    label: {
      fontWeight: 'bold'
    },
    value: {
      marginLeft: '10px'
    }
  };

  const styles2 = {
    container: {
      fontSize: '12px',
      margin: '20px 0'
    },
    heading: {
      marginBottom: '10px',
      textDecoration: 'underline',
      fontSize: '14px'
    },
    item: {
      margin: '5px 0'
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
    const doc = new jsPDF('p', 'mm', 'a4');

    const contentDiv = document.getElementById('main-content');
    const annexureDiv = document.getElementById('annexure-content');

    if (!contentDiv) {
      console.error('Main content element not found!');
      return;
    }

    // Convert main content to an image
    const contentCanvas = await html2canvas(contentDiv);
    const contentImgData = contentCanvas.toDataURL('image/png');

    // Add main content to PDF
    doc.addImage(contentImgData, 'PNG', 10, 10, 190, 0);

    // Only add ANNEXURE - A if taxInvoiceAnnexureVO has values
    if (row.taxInvoiceAnnexureVO?.length > 0 && annexureDiv) {
      doc.addPage();

      // Convert ANNEXURE - A to an image
      const annexureCanvas = await html2canvas(annexureDiv);
      const annexureImgData = annexureCanvas.toDataURL('image/png');

      // Add ANNEXURE - A to the last page
      doc.addImage(annexureImgData, 'PNG', 10, 10, 190, 0);
    }

    // Save the PDF
    doc.save(`${row.transactionNo}.pdf`);
  };

  // Automatically open the dialog when the component is rendered
  useEffect(() => {
    // if ((row && row.approveStatus === 'Approved') || (row && row.approveStatus === 'Rejected')) {
      handleOpen();
      getBankDetailsByOrgId();
      getCompanyDetails();
    // } else {
    //   setOpen(false);
    // }
    console.log('RowData =>', row);

    // Call the callback function to pass handleDownloadPdf if needed
    if (callBackFunction) {
      callBackFunction(handleDownloadPdf);
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB'); // Format date as DD/MM/YYYY
    const formattedTime = now.toLocaleTimeString('en-GB'); // Format time as HH:MM:SS
    setCurrentDateTime(`${formattedDate} ${formattedTime}`);
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      onEntered={handleDownloadPdf} // Ensure content is fully rendered before generating PDF
    >
      <DialogTitle>PDF Preview</DialogTitle>
      <DialogContent>
        <div
          id="main-content"
          style={{
            padding: '20px',
            // backgroundColor: '#f9f9f9',
            width: '210mm',
            height: 'auto',
            margin: 'auto',
            fontFamily: 'Roboto, Arial, sans-serif',
            position: 'relative'
          }}
        >
          {/* <!-- Header Section --> */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '16px',
              marginBottom: '20px',
              borderBottom: '2px solid #000000',
              paddingBottom: '10px',
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
                  <strong>{localStorage.getItem('companyName')}</strong>
                  {companyDetails.cin && (
                    <div className="d-flex flex-row" style={{ fontSize: '13px' }}>
                      CIN: {companyDetails.cin}
                    </div>
                  )}
                  {companyDetails.gst && (
                    <div className="d-flex flex-row" style={{ fontSize: '13px' }}>
                      REG IN: {companyDetails.gst}
                    </div>
                  )}
                  <div style={{ width: 198 }}>
                    <p style={{ textWrap: 'auto', textOverflow: 'ellipsis', fontSize: '10px', lineHeight: '1.6', marginBottom: 0 }}>
                      {companyDetails.address}
                    </p>
                  </div>
                  {companyDetails.city && (
                    <div className="d-flex flex-row" style={{ fontSize: '13px' }}>
                      {companyDetails.city} - {companyDetails.zip}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div style={{ marginRight: '100px' }}>
              <strong style={{ fontSize: '20px' }}>MIM</strong>
            </div>
            <div>
              <div className="mb-2">
                Transaction No <strong className="">: {row.transactionNo}</strong>
              </div>
              <div className="mb-2">
                Transaction Date
                <strong> : {row.transactionDate ? dayjs(row.transactionDate).format('DD-MM-YYYY') : 'N/A'}</strong>
              </div>
              <div className="mb-2">
                Dispatch Date
                <strong> : {row.dispatchDate ? dayjs(row.dispatchDate).format('DD-MM-YYYY') : 'N/A'}</strong>
              </div>
              <div className="mb-2">
                Transaction Type <strong className="">: {row.transactionType}</strong>
              </div>
            </div>
          </div>

          {/* <!-- Details Section --> */}
          <div
            style={{
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              color: '#555'
            }}
          >
            <div>
              <strong className="">Sender : {row.sender}</strong>
              {/* <div style={{ width: 250, marginBottom: 4, display: 'flex', alignItems: 'flex-start' }}>
                <strong style={{ marginRight: 4, whiteSpace: 'nowrap' }}>Warehouse:</strong>
                <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.6', wordBreak: 'break-word', flex: 1 }}>
                    {row.fromWarehouse}
                </p>
              </div> */}
              <div style={{ width: 250, marginBottom: 4, display: 'flex', alignItems: 'flex-start' }}>
                <strong style={{ marginRight: 4, whiteSpace: 'nowrap' }}>WHS Address:</strong>
                <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.6', wordBreak: 'break-word', flex: 1 }}>
                    {row.warehouseAddress}
                </p>
              </div>
            </div>
            <div>
                <strong className="">Receiver: {row.receiver}</strong>
                {row.receiverAddress && <div style={{ width: 250, marginBottom: 4, display: 'flex', alignItems: 'flex-start' }}>
                <strong style={{ marginRight: 4, whiteSpace: 'nowrap' }}>Address:</strong>
                <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.6', wordBreak: 'break-word', flex: 1 }}>
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

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '12px',
              border: '1px solid #000000'
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#673ab7', color: '#fff' }}>
                <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'center' }}>Kit Id</th>
                <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'center' }}>Kit Name</th>
                <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'center' }}>Kit Qty</th>
                <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'center' }}>HSN/SAC</th>
                <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'center' }}>Product</th>
                <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'center' }}>Product Code</th>
                <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'center' }}>Product Qty</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                (row.issueManifestProviderDetailsVOs || []).reduce((acc, item) => {
                  if (!acc[item.kitId]) acc[item.kitId] = [];
                  acc[item.kitId].push(item);
                  return acc;
                }, {})
              ).map(([kitId, kitRows], index) => (
                <React.Fragment key={kitId}>
                  {kitRows.map((item, i) => (
                    <tr key={`${kitId}-${i}`} style={{ borderBottom: '1px solid #000000' }}>
                      {i === 0 && (
                        <>
                          <td rowSpan={kitRows.length} style={{ border: '1px solid #000000', padding: '10px' }}>{item.kitId}</td>
                          <td rowSpan={kitRows.length} style={{ border: '1px solid #000000', padding: '10px' }}>{item.kitName}</td>
                          <td rowSpan={kitRows.length} style={{ border: '1px solid #000000', padding: '10px' }}>{item.kitQty}</td>
                          <td rowSpan={kitRows.length} style={{ border: '1px solid #000000', padding: '10px' }}>{item.hsnCode}</td>
                        </>
                      )}
                      <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.asset}</td>
                      <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.assetCode}</td>
                      <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.assetQty}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {/* <!-- Total Section --> */}
          <div
            style={{
              textAlign: 'right',
              // fontWeight: 'bold',
              fontSize: '14px',
              color: '#333'
            }}
            className="d-flex justify-content-between mb-2"
          >
            <div
              style={{
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#333'
              }}
            >
              <div style={{ width: '500px', marginBottom: '3px' }}>
                Amount in words:{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    color: '#333'
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
                    fontSize: '14px',
                    color: '#333'
                  }}
                >
                  {row.transporterName}
                </span>
              </div>
              <div style={{ width: '500px', marginBottom: '3px' }}>
                Vehicle No:{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    fontSize: '14px',
                    color: '#333'
                  }}
                >
                  {row.vehicleNo}
                </span>
              </div>
              <div style={{ width: '500px', marginBottom: '3px' }}>
                Driver No:{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    fontSize: '14px',
                    color: '#333'
                  }}
                >
                  {row.driverPhoneNo}
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column me-2">
                <p
                  className="mb-1"
                  style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
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
                      fontSize: '14px',
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
                        <strong style={{ width: 225 }}>Declaration:</strong>
                      </div>
                      <div className="col-lg-10">
                        <p>
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
                        <strong style={{ width: 225 }}>Note:</strong>
                      </div>
                      <div className="col-lg-10">
                        <p>
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
                        <strong className="size">For Sending Location:</strong>
                      </div>
                      <div className="me-5">
                        <strong className="size">
                          For Receiving Location :
                        </strong>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-5 mb-5">
                      <div className="d-flex flex-column">
                        <div className="ms-5">
                          <strong className="size">
                            Authorized Signature:
                          </strong>
                        </div>
                        <div className="ms-4">(Company Seal & Signature)</div>
                      </div>
                      <div className="d-flex flex-column">
                        <div className="ms-4">
                          <strong className="size">
                            Authorized Signature:
                          </strong>
                        </div>
                        <div className="me-5">(Company Seal & Signature)</div>
                      </div>
                    </div>

          {/* <!-- Footer Section --> */}
          <div
            style={{
              borderTop: '2px solid #000000',
              paddingTop: '10px',
              fontSize: '12px',
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
                marginBottom: '20px',
                textAlign: 'left',
                fontSize: '12px',
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
