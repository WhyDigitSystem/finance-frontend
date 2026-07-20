import DownloadIcon from '@mui/icons-material/Download';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import apiCalls from 'apicall';

const dummyImageURL = 'https://t3.ftcdn.net/jpg/04/62/93/66/240_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';

const GeneratePdfTemp = ({ row, callBackFunction, modalClose }) => {
  // console.log("row value",row);
  const [open, setOpen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [userType, setUserType] = useState(localStorage.getItem('userType'));

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
    const input = document.getElementById('pdf-content');
    // Add PDF styles
    document.getElementById('bill-to-header')?.classList.add('pdf-bold-black');
    document.getElementById('gst-in-header')?.classList.add('pdf-bold-black');

    if (input) {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 2;
      const imgProps = pdf.getImageProperties(imgData);
      let pdfWidth = pageWidth - margin * 2;
      let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (pdfHeight > pageHeight - margin * 2) {
        pdfHeight = pageHeight - margin * 2;
        pdfWidth = (imgProps.width * pdfHeight) / imgProps.height;
      }

      pdf.addImage(
        imgData,
        'PNG',
        margin,
        margin,
        pdfWidth,
        pdfHeight,
        undefined,
        'FAST'
      );

      pdf.save(`Cost-Invoice_${row.vid}.pdf`);
    } else {
      console.error("Element not found: 'pdf-content'");
    }

    // Remove PDF styles
    document.getElementById('bill-to-header')?.classList.remove('pdf-bold-black');
    document.getElementById('gst-in-header')?.classList.remove('pdf-bold-black');
  };


  // Automatically open the dialog when the component is rendered
  useEffect(() => {
    if ((row && row.approveStatus === 'Approved') || (row && row.approveStatus === 'Rejected')) {
      handleOpen();
      getCompanyDetails();
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
          id="pdf-content"
          style={{
            padding: '20px',
            // backgroundColor: '#f9f9f9',
            width: '215mm',
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
                    <div className="d-flex flex-row" style={{ fontSize: '13px', fontWeight: 'bold' }}>
                      <strong>CIN</strong>
                      <div style={{ marginLeft: '27px' }}>{companyDetails.cin}</div>
                    </div>
                  )}
                  {companyDetails.gst && (
                    <div className="d-flex flex-row" style={{ fontSize: '13px', fontWeight: 'bold' }}>
                      GST IN
                      <div style={{ marginLeft: '8px' }}>{companyDetails.gst}</div>
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
            <div style={{ marginRight: '50px' }}>
              <strong style={{ fontSize: '20px' }}>COST INVOICE</strong>
            </div>
            {/* <div>{localStorage.getItem('branch')}</div> */}
            <div>
              <div className="mb-2">
                <strong>Invoice</strong> <span style={{ marginLeft: '8px', fontWeight: '' }}> {row.vid}</span>
              </div>
              <div>
                <strong>Date</strong>
                <span style={{ marginLeft: '25px', fontWeigh: '' }}> {row.vdate ? dayjs(row.vdate).format('DD-MM-YYYY') : ''}</span>
              </div>
            </div>
          </div>

          {/* <!-- Details Section --> */}
          {/* <div
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
              <div>
                <strong>ACK No: </strong>
                {row.invoiceDate ? dayjs(row.invoiceDate).format('DD-MM-YYYY') : 'N/A'}
              </div>
              <div>
                <strong>IRN No: </strong>
                {row.invoiceDate ? dayjs(row.invoiceDate).format('DD-MM-YYYY') : 'N/A'}
              </div> 
            </div>
            <div style={{ textAlign: 'left' }}>
              <div>
                <strong>Client:</strong> {row.client}
              </div>
              <div>
                <strong>GRN No:</strong> {row.grnNo}
              </div>
              <div>
                <strong>GRN Date:</strong> {row.grnDate}
              </div>
            </div>
            <QRCodeComponent text={qrText} /> 
            <div style={{ textAlign: 'left' }}>
              {/* <div>
                <strong>Due date:</strong> {row.dueDate}
              </div>
              <div>
                Place Of Supply
                <strong>
                  {' '}
                  : {row.supplierGstInCode}-{row.supplierPlace}
                </strong>
              </div>
              {/* <div>
                <strong>GRN Date:</strong> {row.grnDate}
              </div> 
            </div>
          </div>*/}
          <div
            style={{
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
            }}
          >
            <div>
              <div>
                <strong>Bill To</strong> <strong style={{ marginLeft: '20px' }}>{row.supplierName}</strong>
              </div>
              <div>
                <strong>GST IN</strong> <span style={{ marginLeft: '15px' }}>{row.supplierGstIn}</span>
              </div>
              {/* <div>Place Of Supply - {row.stateNo}</div> */}
              <div style={{ width: 300, marginBottom: 4 }}>
                <p style={{ textWrap: 'auto', textOverflow: 'ellipsis', fontSize: '12px', lineHeight: '1.6', marginBottom: 0 }}>
                  {row.address}
                </p>
              </div>
            </div>
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
                <th style={{ border: '1px solid #000000', padding: '10px', width: '368px' }}>Description</th>
                {/* <th style={{ border: '1px solid #000000', padding: '10px' }}>Cur</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Ex.Rt</th> */}
                {/* <th style={{ border: '1px solid #000000', padding: '10px' }}>Apply On</th> */}
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Qty</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Rate</th>
                {/* <th style={{ border: '1px solid #000000', padding: '10px' }}>FC Amount</th> */}
                <th style={{ border: '1px solid #000000', padding: '10px' }}>TAX</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {row.chargerCostInvoiceVO?.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.govChargeCode}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.description}</td>
                  {/* <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.currency}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.exRate || ''}</td> */}
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.qty}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>
                    {parseFloat(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  {/* <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.fcAmt}</td> */}
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.gstpercent}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>
                    {parseFloat(item.lcAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            className="d-flex justify-content-between mb-2"
          >
            <div
              style={{
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '18px',
                color: '#333'
              }}
            >
              <div style={{ width: '500px', marginBottom: '3px', fontSize: '12px' }}>
                Amount in words &nbsp;
                <span
                  style={{
                    fontWeight: 'normal',
                    fontSize: '12px',
                    color: '#333'
                  }}
                >
                  {row.amountInWords}
                </span>
              </div>
              {row.remarks ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    color: '#555'
                  }}
                >
                  <div style={{ width: '500px', fontWeight: 'normal' }}>
                    <strong>Remarks :</strong> {row.remarks}
                  </div>
                  {/* <div>
              <strong>Shipment Ref No :</strong> {row.recipientGSTIN}
            </div> */}
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column me-2">
                <p className="mb-0" style={{ fontSize: '13px', fontWeight: 'normal', color: '#555' }}>Total Charges:</p>
                <p className="mb-0" style={{ fontSize: '13px', fontWeight: 'normal', color: '#555' }}>Total Tax:</p>
                <p className="mb-1" style={{ fontSize: '13px', fontWeight: 'normal', color: '#555' }}>Total TDS:</p>
                <p
                  style={{
                    fontWeight: '600',
                    fontSize: '13px',
                    color: '#333',
                    marginBottom: 0
                  }}
                >
                  Total:
                </p>
              </div>
              <div className="d-flex flex-column">
                <div>
                  <span
                    style={{
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      fontSize: '14px',
                      color: '#333'
                    }}
                  >
                    {parseFloat(row.totChargesBillCurrAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      fontSize: '14px',
                      color: '#333'
                    }}
                  >
                    {parseFloat(row.gstInputLcAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="mb-1">
                  <span
                    style={{
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      fontSize: '14px',
                      color: '#333'
                    }}
                  >

                    {parseFloat(
                      (Number(row.actBillCurrAmt) - Number(row.actBillLcAmt)).toFixed(2)
                    ).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      color: '#333'
                    }}
                  >
                    ₹{parseFloat(row.netBillCurrAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

          </div>
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
          </div> 
          <div>
            <strong>Other Information :</strong>
          </div>
          <br></br>*/}

          <div style={{ fontSize: '12px' }}>
            <strong>Terms & Conditions :</strong>
            <ol style={{ lineHeight: '1.6' }}>
              {companyDetails.termsAndConditions?.split('\n').map((term, index) => (
                <li key={index}>{term}</li>
              ))}
              {/* <li>
                The payment should be made by way of Account Payee Cheque / Demand Draft / NEFT / RTGS in the name of "
                {localStorage.getItem('companyName')}".
              </li>
              <li>Any Discrepancy in the invoice shall be informed within 7 days of the invoice submission.</li>
              <li>Interest at 2% p.m. or part thereof will be charged if the bill is not paid on the due date.</li>
              <li>Any dispute is subject to Bangalore Jurisdiction</li> */}
            </ol>
          </div>

          {/* <div style={styles2.container}>
            <h6 style={styles2.heading}>Bank Details:</h6>
            <p style={styles2.item}>
              <span style={styles2.label}>BANK NAME:</span> {bankDetails.bankName ? bankDetails.bankName : ''}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>ACCOUNT CODE:</span> {bankDetails.accountCode ? bankDetails.accountCode : ''}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>BENEFICIARY NAME:</span> {bankDetails.beneficiaryName ? bankDetails.beneficiaryName : ''}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>BRANCH:</span> {bankDetails.branch ? bankDetails.branch : ''}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>IFSC:</span> {bankDetails.ifsc ? bankDetails.ifsc : ''}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>ACCOUNT NO:</span> {bankDetails.accountNo ? bankDetails.accountNo : ''}
            </p>
            <p style={styles2.item}>
              <span style={styles2.label}>ACCOUNT TYPE:</span> {bankDetails.accountType ? bankDetails.accountType : ''}
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
        {
          userType === 'OPERATIONS' || userType === 'FINANCE MANAGER' ?
            '' :
            <Button onClick={handleDownloadPdf} color="primary" variant="contained" startIcon={<DownloadIcon />}>
              PDF
            </Button>
        }
        <Button onClick={modalClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GeneratePdfTemp;
