import DownloadIcon from '@mui/icons-material/Download';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import apiCalls from 'apicall';
import 'jspdf-autotable';

const dummyImageURL = 'https://t3.ftcdn.net/jpg/04/62/93/66/240_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';

const GeneratePdfTemp = ({ row, callBackFunction, modalClose }) => {
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
    const pdf = new jsPDF('p', 'mm', 'a4');
    const padding = 3;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const headerHeight = 30;
    const footerHeight = 15;
    let currentY = padding + headerHeight;

    // Preload company logo
    let logoData = null;
    if (companyDetails?.companyLogo) {
      logoData = `data:image/jpeg;base64,${companyDetails.companyLogo}`;
    }

    // Reusable header function
    const addHeader = (doc) => {
      const headerY = padding;
      const logoWidth = 18;
      let logoHeight = 0;

      // Reset styles
      doc.setFont('timesnewroman', 'normal');
      doc.setFontSize(10);

      // Add logo
      if (logoData) {
        const aspectRatio = 1; // Default aspect ratio
        logoHeight = logoWidth * aspectRatio;
        doc.addImage(
          logoData,
          'JPEG',
          padding,
          headerY,
          logoWidth,
          logoHeight
        );
      }

      // Company details
      const textX = padding + (logoData ? logoWidth + 5 : padding);
      let textY = headerY + 3;
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text(localStorage.getItem('companyName') || '', textX, textY);
      doc.setFont(undefined, 'normal');
      textY += 6;

      doc.setFontSize(7);
      if (companyDetails?.cin) {
        doc.text(`CIN: ${companyDetails.cin}`, textX, textY);
        textY += 3;
      }
      if (companyDetails?.gst) {
        doc.text(`GST IN: ${companyDetails.gst}`, textX, textY);
        textY += 3;
      }
      if (companyDetails?.city) {
        doc.text(`${companyDetails.city} - ${companyDetails.zip}`, textX, textY);
        textY += 3;
      }

      // Invoice title
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('TAX INVOICE', pageWidth / 2, headerY + 5, { align: 'center' });
      doc.setFont(undefined, 'normal');

      const rightX = pageWidth - padding;
      let detailY = headerY + 3;
      doc.setFontSize(10);

      // Invoice No
      doc.setFont(undefined, 'bold');
      doc.text(`Invoice No:`, rightX - 40, detailY); // Adjust 60 as needed
      doc.setFont(undefined, 'normal');
      doc.text(`${row.vid}`, rightX, detailY, { align: 'right' });

      detailY += 4;

      // Date
      const invoiceDate = row.vdate ? dayjs(row.vdate).format('DD-MM-YYYY') : 'N/A';
      doc.setFont(undefined, 'bold');
      doc.text(`Date:`, rightX - 40, detailY);
      doc.setFont(undefined, 'normal');
      doc.text(`${invoiceDate}`, rightX, detailY, { align: 'right' });
      // Header separator
      const lineY = headerY + Math.max(logoHeight, 20);
      doc.setLineWidth(0.2);
      doc.line(padding, lineY, pageWidth - padding, lineY);
    };

    // Reusable footer function
    const addFooter = (doc) => {
      const footerY = pageHeight - footerHeight;
      doc.setLineWidth(0.1);
      doc.line(padding, footerY, pageWidth - padding, footerY);
      doc.setFontSize(6);
      doc.text(
        `${companyDetails.address} | ${currentDateTime} | System Generated Invoice`,
        padding,
        footerY + 3
      );
    };

    // Function to add a new page with header
    const addNewPage = () => {
      pdf.addPage();
      addHeader(pdf);
      return padding + headerHeight;
    };

    // Add first header
    addHeader(pdf);
    pdf.setFontSize(8);
    const labelWidth = 28; // Fixed spacing for labels
    const valueX = padding + labelWidth;

    // Bill To
    pdf.setFont(undefined, 'bold');
    pdf.text('Bill To:', padding, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(`${row.partyName}`, valueX, currentY);
    currentY += 4;

    // GST IN
    pdf.setFont(undefined, 'bold');
    pdf.text('GST IN:', padding, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(`${row.recipientGSTIN}`, valueX, currentY);
    currentY += 4;

    // Place Of Supply
    pdf.setFont(undefined, 'bold');
    pdf.text('Place Of Supply:', padding, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(`${row.stateNo}`, valueX, currentY);
    currentY += 4;

    // Address
    pdf.setFont(undefined, 'bold');
    pdf.text('Address:', padding, currentY);
    pdf.setFont(undefined, 'normal');

    // Calculate available width for address (half page)
    const halfPageWidth = (pageWidth / 2) - valueX - padding;
    currentY += 4;

    // Wrap the address into multiple lines that fit within half the page
    const addressLines = pdf.splitTextToSize(row.address || '', halfPageWidth);

    // Print wrapped lines
    addressLines.forEach(line => {
      pdf.text(line, valueX, currentY);
      currentY += 4;
    });
    currentY += 2;
    // Due Date
    const dueDate = row.dueDate ? dayjs(row.dueDate).format('DD-MM-YYYY') : 'N/A';
    pdf.setFont(undefined, 'bold');
    pdf.text('Due Date:', padding, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(`${dueDate}`, valueX, currentY);
    currentY += 5;

    // Tax Type (centered)
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    const taxType = row.gstType === 'INTRA' ? 'Intra State Tax' : 'Inter State Tax';
    pdf.text(taxType, pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
    // Main table
    const tableHeaders = [
      'HSN/SAC',
      'Description',
      'Qty',
      'Rate',
      'Tax %',
      'Tax Amount',
      'Amount'
    ];

    const tableData = row.taxInvoiceDetailsVO?.map(item => [
      item.govChargeCode,
      item.description,
      item.qty,
      parseFloat(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      item.gstpercent,
      parseFloat(item.gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      parseFloat(item.lcAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    ]);

    pdf.autoTable({
      startY: currentY,
      head: [tableHeaders],
      body: tableData,
      margin: { left: padding, right: padding },
      styles: {
        fontSize: 9,
        lineWidth: 0.1,               // Thin border
        lineColor: [0, 0, 0],         // Black border
        halign: 'center',             // Optional: center align values
        valign: 'middle',            // Optional: vertical centering
      },
      headStyles: {
        fillColor: [103, 58, 183],
        textColor: 255,
        fontStyle: 'bold',
        lineWidth: 0.1,               // Ensure header borders are also thin
        lineColor: [0, 0, 0]
      },
      didDrawPage: function (data) {
        currentY = data.cursor.y;
      }
    });
    // Start left and right block from same currentY
    currentY += 7;
    pdf.setFontSize(8);

    const leftX = padding;
    const rightX = pageWidth / 2 + 70;
    const lineHeight = 5;

    let startY = currentY;
    currentY += 10;

    // ---------- LEFT SIDE ----------
    let leftY = startY;
    pdf.setFont(undefined, 'bold');
    pdf.text('Amount in words:', leftX, leftY);
    pdf.setFont(undefined, 'normal');
    pdf.text((row.amountInWords || '').trim(), leftX + 30, leftY);
    leftY += lineHeight;

    if (row.remarks) {
      pdf.setFont(undefined, 'bold');
      pdf.text('Remarks:', leftX, leftY);
      pdf.setFont(undefined, 'normal');
      pdf.text((row.remarks || '').trim(), leftX + 30, leftY);
      leftY += lineHeight;
    }

    // Leave a bit of bottom margin
    leftY += lineHeight ;

    pdf.setFontSize(8);
    let rightY = currentY - (row.amountInWords ? 2 * lineHeight : lineHeight);

    pdf.setFont(undefined, 'normal');
    // Suh Total
    pdf.text('Sub Total:', rightX, rightY);
    pdf.text(
      `${parseFloat(row.totalChargeAmountLc).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      pageWidth - padding,
      rightY,
      { align: 'right' }
    );
    rightY += lineHeight;

    // GST(GST)
    pdf.text('GST(IGST):', rightX, rightY);
    pdf.text(
      `${parseFloat(row.totalTaxAmountLc).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      pageWidth - padding,
      rightY,
      { align: 'right' }
    );
    rightY += lineHeight;

    // Grand Total
    pdf.setFont(undefined, 'bold');
    pdf.text('Total:', rightX, rightY);
    pdf.text(
      `${parseFloat(row.totalInvAmountLc).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      pageWidth - padding,
      rightY,
      { align: 'right' }
    );
    // Update currentY based on whichever column is taller
    currentY = Math.max(leftY, rightY);
    // ------- Terms & Conditions -------
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(10);
    pdf.text('Terms & Conditions :', padding, currentY);
    currentY += 6;

    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(9);
    const terms = companyDetails.termsAndConditions?.split('\n') || [];

    terms.forEach((term, index) => {
      const termLines = pdf.splitTextToSize(`${index + 1}. ${term}`, pageWidth - 2 * padding);
      termLines.forEach(line => {
        if (currentY > pageHeight - footerHeight - 10) {
          currentY = addNewPage();
        }
        pdf.text(line, padding, currentY);
        currentY += 5;
      });
    });

    // ------- Bank Details -------
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(10);
    pdf.text('Bank Details:', padding, currentY);
    currentY += 6;

    pdf.setFontSize(9);
    pdf.setFont(undefined, 'bold');
    pdf.text('BANK NAME:', padding, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(bankDetails.bankName || '', padding + 40, currentY);
    currentY += 5;

    pdf.setFont(undefined, 'bold');
    pdf.text('BRANCH:', padding, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(bankDetails.branch || '', padding + 40, currentY);
    currentY += 5;

    pdf.setFont(undefined, 'bold');
    pdf.text('IFSC:', padding, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(bankDetails.ifsc || '', padding + 40, currentY);
    currentY += 5;

    pdf.setFont(undefined, 'bold');
    pdf.text('BENEFICIARY NAME:', padding, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(bankDetails.beneficiaryName || '', padding + 40, currentY);
    currentY += 5;

    pdf.setFont(undefined, 'bold');
    pdf.text('ACCOUNT NO:', padding, currentY);
    pdf.setFont(undefined, 'normal');
    pdf.text(bankDetails.accountNo || '', padding + 40, currentY);
    currentY += 25;

    // ------- Authorized Signatory -------
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(10);
    pdf.text('Authorized Signatory', padding, currentY);
    currentY += 10;
    // Add footer to the first page
    addFooter(pdf);

    // Annexure
    if (row.taxInvoiceAnnexureVO?.length > 0) {
      // Add new page for annexure
      currentY = addNewPage();

      // Annexure header
      pdf.setFontSize(10);
      pdf.text(`Invoice No: ${row.vid}`, padding, currentY);
      pdf.text(`Invoice Date: ${row.vdate ? dayjs(row.vdate).format('DD-MM-YYYY') : 'N/A'}`, pageWidth - padding, currentY, { align: 'right' });
      currentY += 10;

      pdf.setFontSize(12);
      pdf.text('ANNEXURE - A', pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;

      // Annexure table
      const annexureHeaders = [
        'Date',
        'Transaction No',
        'KIT Id',
        'Kit Description',
        'Kit Qty',
        'Rate',
        'Amount'
      ];

      const annexureData = row.taxInvoiceAnnexureVO.map(item => [
        item.transDate ? dayjs(item.transDate).format('DD-MM-YYYY') : 'N/A',
        item.transNo,
        item.kitId,
        item.dsec,
        item.qty,
        parseFloat(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        parseFloat(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      ]);

      pdf.autoTable({
        startY: currentY,
        head: [annexureHeaders],
        body: annexureData,
        margin: { left: padding, right: padding },
        styles: { fontSize: 8 },
        didDrawPage: function (data) {
          // Add footer to every page of the annexure
          addFooter(pdf);

          // Update currentY after table is drawn
          currentY = data.cursor.y;
        }
      });

      currentY += 5;

      // Annexure totals
      pdf.setFontSize(10);
      pdf.text(`Sub Total: ${parseFloat(row.annexureSubTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - padding, currentY, { align: 'right' });
      currentY += 5;
      pdf.text(`Total Kit Qty: ${parseInt(row.totalQty).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, pageWidth - padding, currentY, { align: 'right' });
    }

    pdf.save(`${row.screenCode || 'TI'}_${row.partyShortName}_${row.vid}.pdf`);
  };

  useEffect(() => {
    if ((row && row.approveStatus === 'Approved') || (row && row.approveStatus === 'Rejected')) {
      handleOpen();
      getBankDetailsByOrgId();
      getCompanyDetails();
    } else {
      setOpen(false);
    }

    // Call the callback function to pass handleDownloadPdf if needed
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
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  const getCompanyDetails = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/company/${orgId}`);
      if (response.status === true) {
        setCompanyDetails(response.paramObjectsMap.companyVO[0]);
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
      onEntered={handleDownloadPdf}
    >
      <DialogTitle>PDF Preview</DialogTitle>
      <DialogContent>
        <div
          // id="main-content"
          style={{
            padding: '10px',
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
                      GST IN: {companyDetails.gst}
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
              <strong style={{ fontSize: '20px' }}>TAX INVOICE</strong>
            </div>
            <div>
              <div className="mb-2">
                Invoice <strong className="">: {row.vid}</strong>
              </div>
              <div>
                Date
                <strong> : {row.vdate ? dayjs(row.vdate).format('DD-MM-YYYY') : 'N/A'}</strong>
              </div>
            </div>
          </div>
          <div id="main-content"
            style={{
              padding: '10px',
              width: '210mm',
              height: 'auto',
              margin: 'auto',
              fontFamily: 'Roboto, Arial, sans-serif',
              position: 'relative'
            }}>
            {/* <!-- Details Section --> */}
            <div
              // id="main-content"
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
                <div>GST IN- {row.recipientGSTIN}</div>
                <div>Place Of Supply - {row.stateNo}</div>
                <div style={{ width: 300, marginBottom: 4 }}>
                  <p style={{ textWrap: 'auto', textOverflow: 'ellipsis', fontSize: '12px', lineHeight: '1.6', marginBottom: 0 }}>
                    {row.address}
                  </p>
                </div>
              </div>
              <div>
                <div>
                  Due Date
                  <strong style={{ textAlign: 'right' }}> : {row.dueDate ? dayjs(row.dueDate).format('DD-MM-YYYY') : 'N/A'}</strong>
                </div>
              </div>
            </div>

            <div style={styles.container}>
              <div style={{ ...styles.beforeAfter, ...styles.before }} />
              <span style={styles.text}>{row.gstType === 'INTRA' ? 'Intra State Tax' : 'Inter State Tax'}</span>

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
                  <th style={{ border: '1px solid #000000', padding: '8px', textAlign: 'center' }}>HSN/SAC</th>
                  <th style={{ border: '1px solid #000000', padding: '8px', textAlign: 'center' }}>Description</th>
                  {/* <th style={{ border: '1px solid #000000', padding: '8px' }}>Cur</th>
                <th style={{ border: '1px solid #000000', padding: '8px' }}>Ex.Rt</th> */}
                  <th style={{ border: '1px solid #000000', padding: '8px', textAlign: 'center' }}>Qty</th>
                  <th style={{ border: '1px solid #000000', padding: '8px', textAlign: 'center' }}>Rate</th>
                  {/* <th style={{ border: '1px solid #000000', padding: '8px' }}>FC Amount</th> */}
                  <th style={{ border: '1px solid #000000', padding: '8px', textAlign: 'center' }}>Tax %</th>
                  <th style={{ border: '1px solid #000000', padding: '8px', textAlign: 'center' }}>Tax Amount</th>
                  <th style={{ border: '1px solid #000000', padding: '8px', textAlign: 'center' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {row.taxInvoiceDetailsVO?.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #000000' }}>
                    <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.govChargeCode}</td>
                    <td style={{ border: '1px solid #000000', padding: '10px', width: '368px' }}>{item.description}</td>
                    {/* <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.currency}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.exRate || ''}</td> */}
                    <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.qty}</td>
                    <td style={{ border: '1px solid #000000', padding: '10px' }}>
                      {parseFloat(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    {/* <td style={{ border: '1px solid #000000', padding: '10px' }}>
                    {parseFloat(item.fcAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td> */}
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
                fontSize: '12px',
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
                <div style={{ width: '500px', marginBottom: '3px', fontSize: '10px' }}>
                  Amount in words:
                  <span
                    style={{
                      fontWeight: 'normal',
                      fontSize: '10px',
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
                      fontSize: '10px',
                      color: '#555'
                    }}
                  >
                    <div style={{ width: '500px', fontWeight: 'normal' }}>
                      <strong>Remarks :</strong> {row.remarks}
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className="d-flex justify-content-between">
                <div className="d-flex flex-column me-2">
                  <p className="mb-0">Sub Total:</p>
                  {row.gstType === 'INTER' ? (
                    <p className="mb-0">GST(IGST):</p>
                  ) : (
                    <>
                      <p className="mb-0">GST(CGST):</p>
                      <p className="mb-0">GST(SGST):</p>
                    </>
                  )}
                  {/* <p className="mb-0">{row.gstType === 'INTER' ? 'Total  IGST:' : 'Total CGST: Total SGST:'}</p> */}
                  <p
                    className="mb-1"
                    style={{
                      // textAlign: 'right',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      color: '#333',
                      marginBottom: 0
                    }}
                  >
                    Total:
                  </p>
                </div>
                <div className="d-flex flex-column">
                  <div
                  >
                    <span
                      style={{
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: '14px',
                        color: '#333',
                        marginLeft: 3
                      }}
                    >
                      ₹{parseFloat(row.totalChargeAmountLc).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {row.gstType === 'INTER' ? (
                    <div>
                      <span
                        style={{
                          fontStyle: 'normal',
                          fontWeight: 'normal',
                          fontSize: '14px',
                          color: '#333',
                          marginLeft: 10
                        }}
                      >
                        ₹{parseFloat(row.totalTaxAmountLc).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span
                          style={{
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontSize: '14px',
                            color: '#333',
                            marginLeft: 10
                          }}
                        >
                          ₹{parseFloat(row.totalTaxAmountLc / 2).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontSize: '14px',
                            color: '#333',
                            marginLeft: 10
                          }}
                        >
                          ₹{parseFloat(row.totalTaxAmountLc / 2).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </>
                  )
                  }
                  <div
                    className="mb-1"
                    style={{
                      // textAlign: 'right',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      color: '#333'
                    }}
                  >
                    <span
                      style={{
                        // fontWeight: 'normal',
                        fontSize: '14px',
                        color: '#333'
                      }}
                    >
                      ₹{parseFloat(row.totalInvAmountLc).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px' }}>
              <strong>Terms & Conditions :</strong>
              <ol style={{ lineHeight: '1.6' }}>
                {companyDetails.termsAndConditions?.split('\n').map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
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
          </div>
        </div>
        {row.taxInvoiceAnnexureVO?.length > 0 && (
          <div id="annexure-content" className="mt-5">
            <div className="d-flex justify-content-center">
              <div className="d-flex justify-content-between mb-3" style={{ width: '100%' }}>
                <div className="me-3">
                  <strong>Invoice No : {row.vid}</strong>
                </div>
                <div>
                  <strong>Invoice Date : {row.vdate ? dayjs(row.vdate).format('DD-MM-YYYY') : 'N/A'}</strong>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <strong className="text-decoration-underline mb-2">ANNEXURE - A</strong>
            </div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '20px',
                fontSize: '9px',
                border: '1px solid #000000',
                tableLayout: 'fixed' // Add fixed layout
              }}
            >
              <colgroup>
                <col style={{ width: '10%' }} /> {/* Date */}
                <col style={{ width: '15%' }} /> {/* Transaction No */}
                <col style={{ width: '10%' }} /> {/* KIT Id */}
                <col style={{ width: '35%' }} /> {/* Kit Description */}
                <col style={{ width: '8%' }} />  {/* Kit Qty */}
                <col style={{ width: '15%' }} /> {/* Rate */}
                <col style={{ width: '15%' }} /> {/* Amount */}
              </colgroup>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #000000', padding: '2px', textAlign: 'center' }}>Date</th>
                  <th style={{ border: '1px solid #000000', padding: '2px', textAlign: 'center' }}>Transaction No</th>
                  <th style={{ border: '1px solid #000000', padding: '2px', textAlign: 'center' }}>KIT Id</th>
                  <th style={{ border: '1px solid #000000', padding: '2px', textAlign: 'center' }}>Kit Description</th>
                  <th style={{ border: '1px solid #000000', padding: '2px', textAlign: 'center' }}>Kit Qty</th>
                  <th style={{ border: '1px solid #000000', padding: '2px', textAlign: 'center' }}>Rate</th>
                  <th style={{ border: '1px solid #000000', padding: '2px', textAlign: 'center' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {row.taxInvoiceAnnexureVO?.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #000000' }}>
                    <td style={{ border: '1px solid #000000', padding: '2px', textAlign: 'center' }}>
                      {item.transDate ? dayjs(item.transDate).format('DD-MM-YYYY') : 'N/A'}
                    </td>
                    <td style={{ border: '1px solid #000000', padding: '2px', textAlign: 'center' }}>{item.transNo}</td>
                    <td style={{ border: '1px solid #000000', padding: '2px', textAlign: 'center' }}>{item.kitId}</td>
                    <td style={{ border: '1px solid #000000', padding: '2px', textAlign: 'left' }}>{item.dsec}</td>
                    <td style={{ border: '1px solid #000000', padding: '2px', textAlign: 'center' }}>{item.qty}</td>
                    <td style={{ border: '1px solid #000000', padding: '2px', textAlign: 'right' }}>
                      {parseFloat(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ border: '1px solid #000000', padding: '2px', textAlign: 'right' }}>
                      {parseFloat(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-end">
              <div style={{ marginRight: '15px' }}>
                <strong>
                  Sub Total: {parseFloat(row.annexureSubTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
            </div>
            <div className="d-flex justify-content-end" style={{ marginTop: '5px' }}>
              <strong>
                Total Kit Qty: {parseInt(row.totalQty).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </strong>
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