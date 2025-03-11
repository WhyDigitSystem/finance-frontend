import DownloadIcon from '@mui/icons-material/Download';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toWords } from 'number-to-words';
import { useEffect, useState } from 'react';
import apiCalls from 'apicall';

const GeneratePdfTempIRN = ({ row, callBackFunction }) => {
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownloadPdf = async () => {
    const input = document.getElementById('pdf-content');
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save(`Tax-Invoice_${row.docId}.pdf`);

      handleClose();
    } else {
      console.error("Element not found: 'pdf-content'");
    }
  };

  // Automatically open the dialog when the component is rendered
  useEffect(() => {
    if (row) {
      handleOpen();
      getBankDetailsByOrgId();
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
          id="pdf-content"
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
              <strong>Credit Note</strong>
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
                <strong>Invoice No:</strong>
                {row.voucherNo}
              </div>
              <div>
                <strong>Invoice Date: </strong>
                {row.voucherDate ? dayjs(row.voucherDate).format('DD-MM-YYYY') : 'N/A'}
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
              <div>
                <strong>Bill To</strong>
              </div>
              <div>{row.partyName}</div>
              <div>
                <strong className="mb-2">Reg IN:</strong> {row.recipientGSTIN}
              </div>
              {/* <div>{row.address}</div> */}
              <div style={{ width: 300 }}>
                <strong>Place of address:</strong>
                <br />
                <span style={{ textWrap: 'auto', textOverflow: 'ellipsis' }}>{row.address}</span>
              </div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div>
                <strong>Due Date:</strong> {row.dueDate ? dayjs(row.dueDate).format('DD-MM-YYYY') : 'N/A'}
              </div>
              <div>
                <strong>Place Of Supply:</strong> {row.placeOfSupply}
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
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Cur</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Ex.Rt</th>
                {/* <th style={{ border: '1px solid #000000', padding: '10px' }}>Apply On</th> */}
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Qty</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Rate</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>FC Amount</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Tax %</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Tax Amount</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {row.irnCreditNoteDetailsVO?.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.govChargeCode}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.description}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.currency}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.exRate || ''}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.qty}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.rate}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.fcAmount}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.gstpercent}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.gstAmount}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.lcAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
                  color: '#333'
                }}
              >
                {toWords(parseFloat(row.totalInvAmountLc)).toUpperCase()}
              </span>
            </div>
            <div>
              Total:{' '}
              <span
                style={{
                  fontWeight: 'normal',
                  fontSize: '14px',
                  color: '#333'
                }}
              >
                {row.totalInvAmountLc}
              </span>
            </div>
          </div>
          {row.remarks ? (
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
              <strong>Remarks :</strong>
            </div>
            {/* <div> 
              <strong>Shipment Ref No :</strong> {row.recipientGSTIN}
            </div>*/}
          </div>
                    ) : (
                      ''
                    )}

          <div style={{ fontSize: '12px' }}>
            <strong>Terms And Conditions :</strong>
            <ol style={{ lineHeight: '1.6' }}>
              <li>
                OUR LIABILITY IS RESTRICTED AND LIMITED TO STANDARD TRADING CONDITIONS OF FEDERATIONS OF FREIGHT FORWARDERS ASSOCIATIONS IN
                INDIA OF WHICH WE ARE MEMBERS, COPIES OF STANDARD TRADING CONDITIONS ARE AVAILABLE ON REQUEST.
              </li>
              <li>INTEREST WILL BE CHARGED @ 16% PER ANNUM FOR ALL PAYMENT RECEIVED ON OR AFTER DUE DATE AS MENTIONED ABOVE.</li>
              <li>CHEQUE / DD SHOULD BE IN FAVOUR OF XYZ LOGISTICS PRIVATE LIMITED.</li>
            </ol>
          </div>

          <div style={styles2.container}>
            <h6 style={styles2.heading}>Bank Details:</h6>
            <p style={styles2.item}>
              <span style={styles2.label}>BANK NAME:</span> {bankDetails.bankName}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>ACCOUNT CODE:</span> {bankDetails.accountCode}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>BENEFICIARY NAME:</span> {bankDetails.beneficiaryName}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>BRANCH:</span> {bankDetails.branch}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>IFSC:</span> {bankDetails.ifsc}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>ACCOUNT NO:</span> {bankDetails.accountNo}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>ACCOUNT TYPE:</span> {bankDetails.accountType}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDownloadPdf} color="primary" variant="contained" startIcon={<DownloadIcon />}>
          PDF
        </Button>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GeneratePdfTempIRN;
