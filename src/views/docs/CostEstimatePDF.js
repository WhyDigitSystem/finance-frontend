import DownloadIcon from '@mui/icons-material/Download';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import companySeal from '../../assets/images/icons/CompanySign.png'
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

const CostEstimatePDF = ({ row, callBackFunction, modalClose }) => {
    const [open, setOpen] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [bankDetails, setBankDetails] = useState([]);
    const [companyDetails, setCompanyDetails] = useState([]);
    const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
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

        pdf.save(`${row.docId}_${row.screenCode}_${row.employeeCode}.pdf`);
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
    const groupedData = (row.costEstimationDetailsVO || []).reduce((acc, row) => {
        const kitKey = row.category;
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
                            <strong style={{ fontSize: '15px' }}>Cost Estimate</strong>
                        </div>
                        <div>
                            <div className="mb-0" style={{ fontSize: '10px' }}>
                                Doc No<strong className="">: {row.docId}</strong>
                            </div>
                            <div className="mb-0" style={{ fontSize: '10px' }}>
                                Date<strong> : {row.docDate ? dayjs(row.docDate).format('DD-MM-YYYY') : 'N/A'}</strong>
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
                            <strong style={{ fontSize: '10px' }} className="">
                                Requested By: {row.employeeCode}
                                {/* Requested By: {`${row.employeeName} - ${row.employeeCode}`} */}
                            </strong>
                        </div>
                        <div>
                            <strong style={{ fontSize: '10px' }} className="">
                                Date Range: {
                                    row.fromDate && row.toDate
                                        ? dayjs(row.fromDate).isSame(dayjs(row.toDate), 'day')
                                            ? dayjs(row.fromDate).format('DD-MM-YYYY')
                                            : `${dayjs(row.fromDate).format('DD-MM-YYYY')} - ${dayjs(row.toDate).format('DD-MM-YYYY')}`
                                        : 'N/A'
                                }
                            </strong>
                        </div>
                    </div>

                    <div style={styles.container}>
                        <div style={{ ...styles.beforeAfter, ...styles.before }} />
                        <span style={styles.text}>Details</span>
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
                                    <TableCell style={{ textAlign: 'center' }}>#</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>Category</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>Particulars</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>Estimated Amt</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>Remarks</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(groupedData).map(([category, kitRows], kitIndex, kitArray) => (
                                    <React.Fragment key={category}>
                                        {kitRows.map((row, rowIndex) => (
                                            <TableRow key={row.id}>
                                                <>
                                                    <TableCell style={{ textAlign: 'center' }} rowSpan={kitRows.length}>{kitIndex + 1}</TableCell>
                                                    <TableCell style={{ textAlign: 'center' }} rowSpan={kitRows.length}>{row.category}</TableCell>
                                                    <TableCell style={{ textAlign: 'center' }} rowSpan={kitRows.length}>{row.particulars}</TableCell>
                                                    <TableCell style={{ textAlign: 'center' }} rowSpan={kitRows.length}>{row.amount}</TableCell>
                                                    <TableCell style={{ textAlign: 'center' }} rowSpan={kitRows.length}>{row.remarks}</TableCell>
                                                </>
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
                                        {parseFloat(row.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <hr style={{ margin: 0 }} /> */}
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
                    {/* <hr style={{ margin: 0 }} /> */}
                    <div className="d-flex justify-content-between mt-0 mb-0">

                        <div className="d-flex">
                            <div className="me-3 ms-5">
                                <img
                                    src={companySeal}
                                    alt="Company Seal"
                                    style={{ height: '85px', objectFit: 'contain' }}
                                />
                            </div>
                            <div className="ms-3">
                                <img
                                    src={accountantSign}
                                    alt="Accountant Sign"
                                    style={{ height: '85px', objectFit: 'contain' }}
                                />
                            </div>
                        </div>
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
export default CostEstimatePDF;
