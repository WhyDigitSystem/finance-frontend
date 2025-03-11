import DownloadIcon from '@mui/icons-material/Download';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import apiCalls from 'apicall';

const GeneratePdfTemp = ({ row, callBackFunction, modalClose }) => {
  const [open, setOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [bankDetails, setBankDetails] = useState([]);
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

  // Function to generate and download the PDF
  // const handleDownloadPdf = async () => {
  //   const input = document.getElementById('pdf-content');
  //   if (input) {
  //     const canvas = await html2canvas(input);
  //     const imgData = canvas.toDataURL('image/png');

  //     const pdf = new jsPDF();
  //     pdf.addImage(imgData, 'PNG', 0, 0);
  //     pdf.save(`Tax-Invoice_${row.docId}.pdf`);
  //     modalClose();
  //     // handleClose();
  //   } else {
  //     console.error("Element not found: 'pdf-content'");
  //   }
  // };

  // const handleDownloadPdf = async () => {
  //   const input = document.getElementById('pdf-content');
  //   if (!input) {
  //     console.error("Element not found: 'pdf-content'");
  //     return;
  //   }

  //   const canvas = await html2canvas(input, { scale: 2 });
  //   const imgData = canvas.toDataURL('image/png');

  //   const pdf = new jsPDF({
  //     orientation: 'p',
  //     unit: 'px',
  //     format: [canvas.width, canvas.height]
  //   });

  //   pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  //   pdf.save(`Tax-Invoice_${row.docId}.pdf`);
  //   modalClose();
  // };

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
    doc.save(`Tax-Invoice_${row.vid}.pdf`);
  };

  // Automatically open the dialog when the component is rendered
  useEffect(() => {
    if ((row && row.approveStatus === 'Approved') || (row && row.approveStatus === 'Rejected')) {
      handleOpen();
      getBankDetailsByOrgId();
    } else {
      setOpen(false);
    }
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
            backgroundColor: '#f9f9f9',
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
            <div>{localStorage.getItem('companyName')}</div>
            <div>
              <strong>Tax Invoice</strong>
            </div>
            <div>{localStorage.getItem('branch')}</div>
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
              <div>
                Invoice No
                <strong className="ms-3">: {row.vid}</strong>
              </div>
              <div>
                Invoice Date
                <strong> : {row.vdate ? dayjs(row.vdate).format('DD-MM-YYYY') : 'N/A'}</strong>
              </div>
            </div>
            <div>
              <div>
                Due date
                <strong style={{ textAlign: 'right' }}> : {row.dueDate ? dayjs(row.dueDate).format('DD-MM-YYYY') : 'N/A'}</strong>
              </div>
              <div>
                Place Of Supply
                <strong> : {row.stateNo}</strong>
              </div>
            </div>
          </div>
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
              <div>Bill To</div>
              <div>
                <strong>{row.partyName}</strong>
              </div>
              <div style={{ width: 300, marginBottom: 4 }}>
                <span style={{ textWrap: 'auto', textOverflow: 'ellipsis' }}>{row.address}</span>
              </div>
              <div>
                <strong className="mb-2">Reg IN:</strong> {row.recipientGSTIN}
              </div>
            </div>
          </div>

          <div style={styles.container}>
            <div style={{ ...styles.beforeAfter, ...styles.before }} />
            <span style={styles.text}>{row.gstType === 'INTRA' ? 'Intra State GST' : 'Inter State GST'}</span>

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
                <th style={{ border: '1px solid #000000', padding: '10px' }}>HSN/SAC</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Description</th>
                {/* <th style={{ border: '1px solid #000000', padding: '10px' }}>Cur</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Ex.Rt</th> */}
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Qty</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Rate</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>FC Amount</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Tax %</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Tax Amount</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {row.taxInvoiceDetailsVO?.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.govChargeCode}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.description}</td>
                  {/* <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.currency}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.exRate || ''}</td> */}
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.qty}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>
                    {parseFloat(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>
                    {parseFloat(item.fcAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.gstpercent}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>
                    {parseFloat(item.gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>
                    {parseFloat(item.lcAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
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
            className="d-flex justify-content-end mb-2"
          >
            <div className="d-flex flex-column">
              <div
              // style={{
              //   fontStyle: 'italic'
              // }}
              >
                Sub Total:{' '}
                <span
                  style={{
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: '14px',
                    color: '#333',
                    marginLeft: 3
                  }}
                >
                  {parseFloat(row.totalChargeAmountLc).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div
              // style={{
              //   fontStyle: 'italic'
              // }}
              >
                Total Taxable Amount:{' '}
                <span
                  style={{
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: '14px',
                    color: '#333',
                    marginLeft: 10
                  }}
                >
                  {parseFloat(row.totalTaxAmountLc).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              // textAlign: 'right',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#333'
            }}
            className="d-flex justify-content-between mb-2"
          >
            <div
              style={{
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#333'
              }}
            >
              Amount in words:{' '}
              <span
                style={{
                  fontWeight: 'normal',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  color: '#333'
                }}
              >
                {row.amountInWords.toUpperCase()}
              </span>
            </div>
            <div>
              Total:{' '}
              <span
                style={{
                  // fontWeight: 'normal',
                  fontSize: '14px',
                  color: '#333'
                }}
              >
                {parseFloat(row.totalInvAmountLc).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          {row.remarks ? (
            <div
              style={{
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#555'
              }}
            >
              <div>
                <strong>Remarks :</strong> {row.remarks}
              </div>
            </div>
          ) : (
            ''
          )}

          <div style={{ fontSize: '12px' }}>
            <strong>Terms & Conditions :</strong>
            <ol style={{ lineHeight: '1.6' }}>
              <li>
                The payment should be made by way of Account Payee Cheque / Demand Draft / NEFT / RTGS in the name of "
                {localStorage.getItem('companyName')}".
              </li>
              <li>Any Discrepancy in the invoice shall be informed within 7 days of the invoice submission.</li>
              <li>Interest at 2% p.m. or part thereof will be charged if the bill is not paid on the due date.</li>
              <li>Any dispute is subject to Bangalore Jurisdiction</li>
            </ol>
          </div>

          <div style={styles2.container}>
            <h6 style={styles2.heading}>Bank Details:</h6>
            <p style={styles2.item}>
              <span style={styles2.label}>BANK NAME:</span> {bankDetails.bankName ? bankDetails.bankName : ''}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>BRANCH:</span> {bankDetails.branch ? bankDetails.branch : ''}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>IFSC:</span> {bankDetails.ifsc ? bankDetails.ifsc : ''}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>BENEFICIARY NAME:</span> {bankDetails.beneficiaryName ? bankDetails.beneficiaryName : ''}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>ACCOUNT NO:</span> {bankDetails.accountNo ? bankDetails.accountNo : ''}
            </p>
          </div>

          <div
            style={{
              textAlign: 'Left',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#333',
              marginTop: '10%'
            }}
          >
            Authorized Signatory
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
        {row.taxInvoiceAnnexureVO?.length > 0 && (
          <div id="annexure-content" className="mt-5">
            <div className="d-flex justify-content-center">
              <div className="d-flex justify-content-between mb-3">
                <div className="me-3">
                  <strong>Invoice No : {row.vid}</strong>
                </div>
                <div>
                  <strong>Invoice Date : {row.vdate ? dayjs(row.vdate).format('DD-MM-YYYY') : 'N/A'}</strong>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <strong className="text-decoration-underline mb-3">ANNEXURE - A</strong>
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
                <tr>
                  <th style={{ border: '1px solid #000000', padding: '10px', width: 96 }}>Date</th>
                  <th style={{ border: '1px solid #000000', padding: '10px', width: 116 }}>Transaction No</th>
                  <th style={{ border: '1px solid #000000', padding: '10px', width: 57 }}>KIT Id</th>
                  <th style={{ border: '1px solid #000000', padding: '10px', width: 256 }}>Kit Description</th>
                  <th style={{ border: '1px solid #000000', padding: '10px', width: 110 }}>SKU Type</th>
                  <th style={{ border: '1px solid #000000', padding: '10px', width: 44 }}>Qty</th>
                  <th style={{ border: '1px solid #000000', padding: '10px', width: 68 }}>Rate</th>
                  <th style={{ border: '1px solid #000000', padding: '10px', width: 86 }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {row.taxInvoiceAnnexureVO?.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #000000' }}>
                    <td style={{ border: '1px solid #000000', padding: '10px' }}>
                      {item.transDate ? dayjs(item.transDate).format('DD-MM-YYYY') : 'N/A'}
                    </td>
                    <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.transNo}</td>
                    <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.kitId}</td>
                    <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.dsec}</td>
                    <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.skuType}</td>
                    <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.qty}</td>
                    <td style={{ border: '1px solid #000000', padding: '10px' }}>
                      {parseFloat(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ border: '1px solid #000000', padding: '10px' }}>
                      {parseFloat(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-end">
              <div>
                <strong>
                  Sub Total{' '}
                  {parseFloat(row.annexureSubTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
            </div>
          </div>
        )}
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

export default GeneratePdfTemp;
