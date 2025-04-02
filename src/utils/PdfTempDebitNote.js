import DownloadIcon from '@mui/icons-material/Download';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toWords } from 'number-to-words';
import { useEffect, useState } from 'react';
import QRCodeComponent from './QRCode';
import apiCalls from 'apicall';

const GeneratePdfTempDN = ({ row, callBackFunction, modalClose }) => {
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
    const input = document.getElementById("pdf-content");
    if (input) {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 310;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yPosition = 0;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, yPosition, imgWidth, imgHeight);
      } else {
        let currentHeight = 0;

        while (currentHeight < imgHeight) {
          pdf.addImage(imgData, "PNG", 0, -currentHeight, imgWidth, imgHeight);
          currentHeight += pageHeight;

          if (currentHeight < imgHeight) {
            pdf.addPage();
          }
        }
      }
      pdf.save(`Tax-Invoice_${row.docId}.pdf`);
      handleClose();
    } else {
      console.error("Element not found: 'pdf-content'");
    }
  };

  // Automatically open the dialog when the component is rendered
  // useEffect(() => {
  //   if (row) {
  //     handleOpen();
  //     getBankDetailsByOrgId();
  //   }
  //   console.log('RowData =>', row);

  //   // Call the callback function to pass handleDownloadPdf if needed
  //   if (callBackFunction) {
  //     callBackFunction(handleDownloadPdf);
  //   }

  //   const now = new Date();
  //   const formattedDate = now.toLocaleDateString('en-GB'); // Format date as DD/MM/YYYY
  //   const formattedTime = now.toLocaleTimeString('en-GB'); // Format time as HH:MM:SS
  //   setCurrentDateTime(`${formattedDate} ${formattedTime}`);
  // }, [row, callBackFunction]);

  useEffect(() => {
    if (row && row.approveStatus === 'Approved' || row.approveStatus === 'Rejected') {
      handleOpen();
      getBankDetailsByOrgId();
    } else {
      setOpen(false);
    }

    console.log('RowData =>', row);

    if (callBackFunction) {
      callBackFunction(handleDownloadPdf);
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB');
    const formattedTime = now.toLocaleTimeString('en-GB');
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
      onEntered={handleDownloadPdf}
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
              <strong>Debit Note</strong>
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
              {/* <div>
                Invoice No:
                <strong>{row.purVoucherNo}</strong>
              </div> */}
              <div>
                Invoice No
                <strong className="ms-3">: {row.purVoucherNo}</strong>
              </div>
              <div>
                Invoice Date
                <strong className="ms-1">: {row.purVoucherDate ? dayjs(row.purVoucherDate).format('DD-MM-YYYY') : 'N/A'}
                </strong>

              </div>
              {/* <div>
                <strong>ACK No: </strong>
                {row.invoiceDate ? dayjs(row.invoiceDate).format('DD-MM-YYYY') : 'N/A'}
              </div>
              <div>
                <strong>IRN No: </strong>
                {row.invoiceDate ? dayjs(row.invoiceDate).format('DD-MM-YYYY') : 'N/A'}
              </div> */}
            </div>
            {/* <div style={{ textAlign: 'left' }}>
              <div>
                <strong>Client:</strong> {row.client}
              </div>
              <div>
                <strong>GRN No:</strong> {row.grnNo}
              </div>
              <div>
                <strong>GRN Date:</strong> {row.grnDate}
              </div>
            </div> */}
            {/* <QRCodeComponent text={'1234567'} /> */}
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
              <div><strong>{row.supplierName}</strong></div>
              <span style={{ textWrap: 'auto', textOverflow: 'ellipsis' }}>{row.address}</span>
              <div>
                <strong className="mb-2">Reg No:</strong> {row.supplierGstIn}
              </div>
              {/* <div>{row.address}</div> */}
              {/* <div style={{ width: 300 }}>
                <strong>Place of address:</strong>
                <br />
                <span style={{ textWrap: 'auto', textOverflow: 'ellipsis' }}>{row.address}</span>
              </div> */}
            </div>
            {/* <div style={{ textAlign: 'left' }}>
              <div>
                <strong>Due date:</strong> {row.dueDate}
              </div>
              <div>
                <strong>Place Of Supply:</strong> {row.supplierPlace}
              </div>
              <div>
                <strong>GRN Date:</strong> {row.grnDate}
              </div>
            </div> */}
          </div>

          <div style={styles.container}>
            <div style={{ ...styles.beforeAfter, ...styles.before }} />
            <span style={styles.text}>{row.gstType === 'INTRA' ? 'Intra State GST' : 'Inter State GST'}</span>

            <div style={{ ...styles.beforeAfter, ...styles.after }} />
          </div>

          {/* <div style={styles1.container}>
            <div>
              <div style={styles1.row}>
                <span style={styles1.label}>Job Number / Dt. :</span>
                <span style={styles1.value}>AHM24SOJ00030</span>
                <span style={styles1.value}>16/10/2024</span>
              </div>
              <div style={styles1.row}>
                <span style={styles1.label}>Master No / Dt. :</span>
                <span style={styles1.value}>MAEU245530351</span>
                <span style={styles1.value}>22/10/2024</span>
              </div>
              <div style={styles1.row}>
                <span style={styles1.label}>Currency :</span>
                <span style={styles1.value}>INR</span>
              </div>
              <div style={styles1.row}>
                <span style={styles1.label}>Ex. Rate :</span>
                <span style={styles1.value}>1</span>
              </div>
              <div style={styles1.row}>
                <span style={styles1.label}>Volume / Container No :</span>
                <span style={styles1.value}>3 X 20ft, PONU20921210, MSKU5519587, TCKU1124408</span>
              </div>
              <div style={styles1.row}>
                <span style={styles1.label}>IGM NO & Date :</span>
                <span style={styles1.value}></span>
              </div>
            </div>

            <div>
              <div style={styles1.row}>
                <span style={styles1.label}>House No / Dt. :</span>
                <span style={styles1.value}>AHM24HS00016</span>
                <span style={styles1.value}>16/10/2024</span>
              </div>
              <div style={styles1.row}>
                <span style={styles1.label}>Flight No./Vessel Name :</span>
                <span style={styles1.value}>CAP SAN VINCENT 442W</span>
              </div>
              <div style={styles1.row}>
                <span style={styles1.label}>ETD / ETA :</span>
                <span style={styles1.value}>22-OCT-24 / 22-NOV-24</span>
              </div>
              <div style={styles1.row}>
                <span style={styles1.label}>Assessable Value :</span>
                <span style={styles1.value}></span>
              </div>
              <div style={styles1.row}>
                <span style={styles1.label}>Pkgs/Ch.Wt/Gr.Wt (Kgs.):</span>
                <span style={styles1.value}>71 / 0 / 73769</span>
              </div>
              <div style={styles1.row}>
                <span style={styles1.label}>Bill of Entry/ S B No :</span>
                <span style={styles1.value}></span>
              </div>
              <div style={styles1.row}>
                <span style={styles1.label}>Goods Desc :</span>
                <span style={styles1.value}></span>
              </div>
            </div>
          </div> */}

          {/* <!-- Table Section --> */}
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
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Details</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Cur</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Ex.Rt</th>
                {/* <th style={{ border: '1px solid #000000', padding: '10px' }}>Apply On</th> */}
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Qty</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Rate</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>FC Amount</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>TAX</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {row.chargerCostDebitNoteVO?.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.govChargeCode}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.chargeName}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.currency}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.exRate || ''}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.qty}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>
                    {Number(item.rate).toLocaleString('en-IN')}
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>
                    {Number(item.fcAmt).toLocaleString('en-IN')}
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.gstpercent}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>
                    {Number(item.lcAmt).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <div
            style={{
              fontStyle: 'italic',
              textAlign: 'right',
            }}
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
              {parseFloat(row.gstInputLcAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div> */}

          <div className="d-flex flex-column">
            <div
            style={{
              // fontStyle: 'italic',
              textAlign: 'right'
            }}
            >
              Total Charges Amount:{' '}
              <span
                style={{
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: '14px',
                  color: '#333',
                  marginLeft: 3
                }}
              >
                {parseFloat(row.totChargesBillCurrAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div
            style={{
              // fontStyle: 'italic',
              textAlign: 'right'
            }}
            >
              Total Tax Amount:{' '}
              <span
                style={{
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: '14px',
                  color: '#333',
                  marginLeft: 10
                }}
              >
                {parseFloat(row.gstInputLcAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div
            style={{
              // fontStyle: 'italic',
              textAlign: 'right'
            }}
            >
              Total TDS Amount:{' '}
              <span
                style={{
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: '14px',
                  color: '#333',
                  marginLeft: 3
                }}
              >
                {parseFloat((row.sumLcAmt - row.netBillLcAmt)).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          </div>

          {/* <!-- Total Section --> */}
          <div
            style={{
              textAlign: 'right',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#333',
              marginTop: '8px'
            }}
          >
            Total:{' '}
            <span
              style={{
                fontWeight: 'normal',
                fontSize: '14px',
                color: '#333'
              }}
            >
              {Number(row.netBillLcAmt).toLocaleString('en-IN')}
            </span>
          </div>

          <div
            style={{
              textAlign: 'left',
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
              {toWords(parseFloat(row.netBillLcAmt)).toUpperCase()}
            </span>
          </div>

          {row.remarks ? (
            <div
              style={{
                marginBottom: '20px',
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#555'
              }}
            >
              <div>
                <strong>Remarks :</strong> {row.remarks}
              </div>
              {/* <div>
              <strong>Shipment Ref No :</strong> {row.recipientGSTIN}
            </div> */}
            </div>
          ) : (
            ''
          )}

          {/* <div
            style={{
              marginBottom: '20px',
              display: 'flex',
              fontSize: '14px',
              color: '#555'
            }}
          >
            <div>
              {' '}
              <strong>Shipper Inv No :</strong> {row.recipientGSTIN}
            </div>
            &nbsp;&nbsp;&nbsp;
            <div>
              {' '}
              <strong>Date :</strong> {row.recipientGSTIN}
            </div>
          </div> */}
          {/* <div>
            <strong>Other Information :</strong>
          </div> */}


          <div style={{ fontSize: '12px' }}>
            <strong>Terms And Conditions :</strong>
            <ol style={{ lineHeight: '1.6' }}>
              <li>
                The payment should be made by way of Account Payee Cheque / Demand Draft / NEFT / RTGS in the name of "SCM AI PACKS PVT LTD".
              </li>
              <li>Any Discrepancy in the invoice shall be informed within 7 days of the invoice submission.</li>
              <li>Interest at 2% p.m. or part thereof will be charged if the bill is not paid on the due date</li>
              <li>Any dispute is subject to Bangalore Jurisdiction</li>
            </ol>
          </div>

          {/* <div style={styles2.container}>
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
          </div> */}

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
        <Button onClick={modalClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GeneratePdfTempDN;
