import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { IoMdClose } from 'react-icons/io';
import EditIcon from '@mui/icons-material/Edit';
import QRCode from 'qrcode.react';
import { MaterialReactTable } from 'material-react-table';
import GetAppIcon from '@mui/icons-material/GetApp';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import RetrievalManifestProvider from '../docs/RetrievalManifestProvider';
import { Link } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';

export const RetrievalIssueManifest = () => {
  const componentRef = useRef();
  const [qrCodeValue, setQrCodeValue] = useState([]);
  const [watermark, setWatermark] = useState('');
  const [addRim, setAddRim] = useState(false);
  const [editRim, setEditRim] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [pdfData, setPdfData] = useState('');
  const [data, setData] = React.useState([]);
  const [terms, setTerms] = React.useState([]);
  const [productDetails, setProductDetails] = React.useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const userDetails = localStorage.getItem('userDetails');

  useEffect(() => {
    getAllRetrievalManifestProvider();
    // getAllDeclarationAndNotes();
  }, []);

  const getAllRetrievalManifestProvider = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reportController/getAllRetrievalManifestProvider`);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.retrievalManifestProviderVOs.reverse());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getAllDeclarationAndNotes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reportController/getAllDeclarationAndNotes`);

      if (response.status === 200) {
        setTerms(response.data.paramObjectsMap.declarationAndNotesVO[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      const printDateTimeElement = document.createElement('div');
      printDateTimeElement.className = 'print-datetime';
      printDateTimeElement.innerHTML = `
        <div class="d-flex justify-content-between mt-5 mb-5">
          <div class="ms-5">
            Printed By: ${pdfData.receiver}
          </div>
          <div class="me-5">
            Printed On: ${new Date().toLocaleString()}
          </div>
        </div>
      `;
      componentRef.current.appendChild(printDateTimeElement);
      return new Promise((resolve) => setTimeout(() => resolve(), 100));
    },
    onAfterPrint: () => {
      const printDateTimeElement = componentRef.current.querySelector('.print-datetime');
      if (printDateTimeElement) {
        componentRef.current.removeChild(printDateTimeElement);
      }
    }
  });

  const handlePrintWithWatermark = (watermarkText) => {
    setWatermark(watermarkText);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const handleDownloadClick = (row) => {
    getRetrievalManifestProviderById(row.original.id);
    setOpenDialog(true);
  };

  const handleEditRow = (row) => {
    getRetrievalManifestProviderById(row.original.id);
    setSelectedRowId(row.original.id);
    setEditRim(true);
  };

  const handleBack = () => {
    setAddRim(false);
    setEditRim(false);
    getAllRetrievalManifestProvider();
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 50,
        muiTableHeadCellProps: {
          align: 'center'
        },
        muiTableBodyCellProps: {
          align: 'center'
        },
        enableSorting: false,
        enableColumnOrdering: false,
        enableEditing: false,
        Cell: ({ row }) => (
          <div>
            <IconButton onClick={() => handleEditRow(row)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDownloadClick(row)}>
              <GetAppIcon />
            </IconButton>
          </div>
        )
      },

      {
        accessorKey: 'sender',
        header: 'Sender',
        size: 50,
        muiTableHeadCellProps: {
          align: 'center'
        },
        muiTableBodyCellProps: {
          align: 'center'
        }
      },
      {
        accessorKey: 'transactionNo',
        header: 'Transaction No',
        size: 50,
        muiTableHeadCellProps: {
          align: 'center'
        },
        muiTableBodyCellProps: {
          align: 'center'
        }
      },
      {
        accessorKey: 'transactionDate',
        header: 'Transaction Date',
        size: 50,
        muiTableHeadCellProps: {
          align: 'center'
        },
        muiTableBodyCellProps: {
          align: 'center'
        }
      }
    ],
    []
  );

  // const table = MaterialReactTable({
  //   data,
  //   columns
  // });

  const transformProductDetails = (details) => {
    const groupedDetails = details.reduce((acc, detail) => {
      const existingKit = acc.find((kit) => kit.kitId === detail.kitId);
      const asset = {
        assetCode: detail.assetCode,
        assetName: detail.asset,
        assetQty: detail.assetQty
      };

      if (existingKit) {
        existingKit.assets.push(asset);
      } else {
        acc.push({
          kitId: detail.kitId,
          kitName: detail.kitName,
          kitQty: detail.kitQty,
          hsnCode: detail.hsnCode,
          assets: [asset]
        });
      }

      return acc;
    }, []);

    return groupedDetails;
  };

  const getRetrievalManifestProviderById = async (selectedRowId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/reportController/getRetrievalManifestProviderById?id=${selectedRowId}`
      );
      if (response.status === 200) {
        const rimData = response.data.paramObjectsMap.retrievalManifestProviderVO;
        setPdfData(rimData);
        const transformedDetails = transformProductDetails(rimData.retrievalManifestProviderDetailsVOs);
        setProductDetails(transformedDetails);
        const concatenatedData = {
          TransactionNo: rimData.transactionNo,
          TransactionDate: rimData.transactionDate,
          DispatchDate: rimData.dispatchDate,
          Sender: rimData.sender
        };

        const formattedData = `
TransactionNo: ${concatenatedData.TransactionNo},
TransactionDate: ${concatenatedData.TransactionDate},
DispatchDate: ${concatenatedData.DispatchDate},
Sender: ${concatenatedData.Sender}
`;

        setQrCodeValue(formattedData);
        console.log('THE QRCODE DATA IS:', formattedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <div style={{ maxWidth: 1060 }} className="ml-auto me-auto">
        <div>
          {(addRim && <RetrievalManifestProvider addRim={handleBack} />) ||
            (editRim && <RetrievalManifestProvider addRim={handleBack} rimId={selectedRowId} />) || (
              <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
                {/* BULK UPLOAD AND ADD NEW BUTTON */}
                <div className="">
                  {userDetails === 'ROLE_DOCUMENT' ? (
                    <div className="d-flex justify-content-between mb-4">
                      <div className="d-flex align-items-center ms-2">
                        <Link to="/app/welcomedocumentuser">
                          <FaArrowCircleLeft className="cursor-pointer w-8 h-8" />
                        </Link>
                        <p className="text-2xl">
                          <strong className="ml-4">Retrieval Issue Manifest</strong>
                        </p>
                      </div>
                      <div>
                        <button className="btn btn-ghost btn-lg text-sm col-xs-1" style={{ color: 'blue' }} onClick={() => setAddRim(true)}>
                          <img
                            src="/new.png"
                            alt="pending-status-icon"
                            title="add"
                            style={{
                              width: 30,
                              height: 30,
                              margin: 'auto',
                              hover: 'pointer'
                            }}
                          />
                          <span className="text-form text-base" style={{ marginLeft: '10px' }}>
                            RIM
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end mb-4">
                      <button className="btn btn-ghost btn-lg text-sm col-xs-1" style={{ color: 'blue' }} onClick={() => setAddRim(true)}>
                        <img
                          src="/new.png"
                          alt="pending-status-icon"
                          title="add"
                          style={{
                            width: 30,
                            height: 30,
                            margin: 'auto',
                            hover: 'pointer'
                          }}
                        />
                        <span className="text-form text-base" style={{ marginLeft: '10px' }}>
                          RIM
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* LISTVIEW TABLE */}
                <div className="">
                  <MaterialReactTable columns={columns} data={data} />
                </div>
              </div>
            )}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg">
            <DialogContent>
              <style>
                {`
              @media print {
                /* Scale the table content down to fit on the screen */
                .print-scale {
              transform: scale(0.9);
              transform-origin: top left;
              width: calc(100% / 0.9);
            }

                .container-sm {
                  width: 100%;
                  max-width: 100%;
                }
                .card {
                  box-shadow: none;
                  border: none;
                  width: 100%;
                  page-break-inside: avoid;
                }
                .row {
                  display: flex;
                  flex-wrap: wrap;
                }
                .size {
                  font-size: 12px;
                }
                .col-md-12 {
                  font-size: 12px;
                }
                .col-md-6 {
                  flex: 0 0 50%;
                  max-width: 50%;
                }
                .col-md-5 {
                  flex: 0 0 40%;
                  max-width: 40%;
                }
                .col-md-4 {
                  flex: 0 0 40%;
                  max-width: 40%;
                }
                .col-md-3 {
                  flex: 0 0 20%;
                  max-width: 20%;
                }
                .text-xl {
                  font-size: 20px;
                  margin-top: 0;
                  margin-bottom: 0.5rem;
                }
                .text-center {
                  text-align: center;
                }
                .font-weight-bold {
                  font-weight: bold;
                }
                .table {
                  width: 100%;
                  margin-bottom: 1rem;
                  color: #212529;
                  border-collapse: collapse;
                }
                .table-bordered {
                  border-collapse: collapse;
                }
                .table-bordered th,
                .table-bordered td {
                  border: 1px solid #dee2e6;
                  padding: 0.5rem;
                  vertical-align: middle;
                }
                .mt-5 {
                  margin-top: 3rem !important;
                }
                /* Reduce font size for table cells */
                .table td,
                .table th {
                  font-size: 11px;
                }

                .watermark.cross {
                  position: fixed;
                  opacity: 0.4;
                  font-size: 4em;
                  color: #ccc;
                  z-index: 9999;
                  pointer-events: none;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(-45deg);
                  transform-origin: center center;
                  white-space: nowrap;
                }

                /* Hide non-print elements */
                .non-print {
                  display: none;
                }
              }
            `}
              </style>
              <div className="d-flex justify-content-end">
                <div className="mr-5">
                  <button
                    className="me-2 bg-blue inline-block rounded bg-primary h-fit px-6 pb-2 pt-2.5 text-xs font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    onClick={() => handlePrintWithWatermark('Consignee Copy')}
                    style={{
                      marginBottom: '20px'
                    }}
                  >
                    Consignee Copy
                  </button>
                  <button
                    className="me-2 bg-blue inline-block rounded bg-primary h-fit px-6 pb-2 pt-2.5 text-xs font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    onClick={() => handlePrintWithWatermark('Transporter Copy')}
                    style={{
                      marginBottom: '20px'
                    }}
                  >
                    Transporter Copy
                  </button>
                  <button
                    className="bg-blue inline-block rounded bg-primary h-fit px-6 pb-2 pt-2.5 text-xs font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    onClick={() => handlePrintWithWatermark('Consignor Copy')}
                    style={{
                      marginBottom: '20px'
                    }}
                  >
                    Consignor Copy
                  </button>
                </div>

                <div className="">
                  <IoMdClose onClick={() => setOpenDialog(false)} className="cursor-pointer w-8 h-8 mb-3" />
                </div>
              </div>
              <div className="print-scale" ref={componentRef}>
                <div className="container-sm">
                  <div className="card bg-base-100 shadow-xl p-4">
                    <div className="d-flex justify-content-between">
                      <div>
                        <img src="/AI_Packs.png" alt="Your Image" style={{ width: '150px' }} />
                      </div>

                      <div className="text-center mt-5">
                        <h1 className="text-xl">
                          <strong>{pdfData.receiver}</strong>
                        </h1>
                        <br />
                        <h3>
                          <strong>Retrieval Issue Manifest</strong>
                        </h3>
                      </div>
                      <div className="mr-3 mt-4">{qrCodeValue && <QRCode value={qrCodeValue} size={120} />}</div>
                    </div>

                    <hr />

                    <div className="d-flex flex-column mt-2">
                      <div className="d-flex flex-row me-5">
                        <div className="font-semibold mb-2" style={{ width: 150 }}>
                          Transaction No:
                        </div>
                        <div>{pdfData.transactionNo}</div>
                      </div>
                      <div className="d-flex flex-row">
                        <div className="font-semibold mb-2" style={{ width: 150 }}>
                          Transaction Date:
                        </div>
                        <div>{pdfData.transactionDate}</div>
                      </div>
                      <div className="d-flex flex-row">
                        <div className="font-semibold mb-2" style={{ width: 150 }}>
                          Dispatch Date:
                        </div>
                        <div>{pdfData.dispatchDate}</div>
                      </div>
                      <div className="d-flex flex-row">
                        <div className="font-semibold mb-2" style={{ width: 150 }}>
                          Transaction Type:
                        </div>
                        <div>{pdfData.transactionType}</div>
                      </div>
                    </div>

                    {/* Sender and Receiver details */}
                    <div className="row mt-2">
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="d-flex justify-content-start">
                          <div className="d-flex flex-column justify-content-between ms-2 me-4">
                            <div className="mb-2 font-semibold">Sender:</div>
                            <div className="mb-2 font-semibold">Address:</div>
                            <div className="mb-2 font-semibold">GST:</div>
                          </div>
                          <div className="d-flex flex-column">
                            {/* <div className="mb-3">{headerData.senderName}</div> */}
                            <div className="mb-2">{pdfData.sender}</div>
                            <div className="mb-2">
                              {pdfData.senderAddress}
                              <br />
                            </div>
                            <div className="mb-2">{pdfData.senderGst}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="d-flex">
                          <div className="d-flex flex-column justify-content-between ms-2 me-4">
                            <div className="mb-2 font-semibold">Receiver:</div>
                            <div className="mb-2 font-semibold">Address:</div>
                            <div className="mb-2 font-semibold"></div>
                          </div>
                          <div className="d-flex flex-column">
                            <div className="mb-2">{pdfData.receiver}</div>
                            <div className="mb-2">
                              {pdfData.receiverAddress}
                              <br />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex row mt-2">
                      {/* Responsive table */}
                      <div className="print-table-container">
                        <div className="table-responsive">
                          <table className="table table-bordered" style={{ borderCollapse: 'collapse' }}>
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    border: '2px solid black',
                                    textAlign: 'center'
                                  }}
                                >
                                  Kit ID
                                </th>
                                <th
                                  style={{
                                    border: '2px solid black',
                                    textAlign: 'center'
                                  }}
                                >
                                  Kit Name
                                </th>
                                <th
                                  style={{
                                    border: '2px solid black',
                                    textAlign: 'center'
                                  }}
                                >
                                  KIT QTY
                                </th>
                                <th
                                  style={{
                                    border: '2px solid black',
                                    textAlign: 'center'
                                  }}
                                >
                                  HSN Code
                                </th>
                                <th
                                  style={{
                                    border: '2px solid black',
                                    textAlign: 'center',
                                    width: 30
                                  }}
                                >
                                  Product
                                </th>
                                <th
                                  style={{
                                    border: '2px solid black',
                                    textAlign: 'center'
                                  }}
                                >
                                  Product Code
                                </th>
                                <th
                                  style={{
                                    border: '2px solid black',
                                    textAlign: 'center'
                                  }}
                                >
                                  Product QTY
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {productDetails.length > 0 &&
                                productDetails.map((row) => {
                                  const assetCount = row.assets.length;
                                  return row.assets.map((asset, index) => (
                                    <tr key={`${row.kitId}-${index}`}>
                                      {index === 0 && (
                                        <>
                                          <td
                                            rowSpan={assetCount}
                                            style={{
                                              border: '2px solid black',
                                              textAlign: 'center'
                                            }}
                                          >
                                            {row.kitId}
                                          </td>
                                          <td
                                            rowSpan={assetCount}
                                            style={{
                                              border: '2px solid black',
                                              textAlign: 'center'
                                            }}
                                          >
                                            {row.kitName}
                                          </td>
                                          <td
                                            rowSpan={assetCount}
                                            style={{
                                              border: '2px solid black',
                                              textAlign: 'center'
                                            }}
                                          >
                                            {row.kitQty}
                                          </td>
                                          <td
                                            rowSpan={assetCount}
                                            style={{
                                              border: '2px solid black',
                                              textAlign: 'center'
                                            }}
                                          >
                                            {row.hsnCode}
                                          </td>
                                        </>
                                      )}
                                      <td
                                        style={{
                                          border: '2px solid black',
                                          textAlign: 'center'
                                        }}
                                      >
                                        {asset.assetName}
                                      </td>
                                      <td
                                        style={{
                                          border: '2px solid black',
                                          textAlign: 'center'
                                        }}
                                      >
                                        {asset.assetCode}
                                      </td>
                                      <td
                                        style={{
                                          border: '2px solid black',
                                          textAlign: 'center'
                                        }}
                                      >
                                        {asset.assetQty}
                                      </td>
                                    </tr>
                                  ));
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Other Details */}
                    <div className="mt-2">
                      <div className="d-flex justify-content-between">
                        <div className="d-flex flex-justify-content-between me-4">
                          <div className="d-flex flex-column" style={{ width: 150 }}>
                            <div className="mb-2 font-semibold">Transporter:</div>
                            <div className="mb-2 font-semibold">Vehicle No:</div>
                            <div className="mb-2 font-semibold">Driver No:</div>
                          </div>
                          <div className="d-flex flex-column">
                            <div className="mb-2 font-normal">{pdfData.transporterName}</div>
                            <div className="mb-2 font-normal">{pdfData.vehicleeNo}</div>
                            <div className="mb-2 font-normal">{pdfData.driverPhoneNo}</div>
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
                          {terms.declaration}
                          {/* The packaging products given on hire shall always remain
                      the property of SCM AI-PACKS Private Limited and shall not
                      be used for the purpose otherwise agreed upon. The same
                      shall be returned at the address notified by SCM AI-PACKS
                      Private Limited. */}
                        </p>
                      </div>
                    </div>
                    {/* Note */}
                    <div className="row mb-3">
                      <div className="col-lg-2">
                        <strong style={{ width: 225 }}>Note:</strong>
                      </div>
                      <div className="col-lg-10">
                        <p>
                          {terms.note1}
                          {/* 1.The goods listed in the above manifest are used empty
                      packaging issued to customer on a daily hire basis. The
                      service is packaging on{" "}
                      <strong>rental model and not sale to customer.</strong> */}
                          <strong>{terms.note1Bold}</strong>
                          <br />
                          {terms.note2}
                          {/* 2. No E-Way Bill is required for Empty Cargo Containers.
                      Refer, Rule 14 of Central Goods and Services Tax (Second
                      Amendment) Rules, 2018. */}
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
                        <strong className="size">For Receiving Location :</strong>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-5 mb-5">
                      <div className="d-flex flex-column">
                        <div className="ms-5">
                          <strong className="size">Authorized Signature:</strong>
                        </div>
                        <div className="ms-4">(Company Seal & Signature)</div>
                      </div>
                      <div className="d-flex flex-column">
                        <div className="ms-4">
                          <strong className="size">Authorized Signature:</strong>
                        </div>
                        <div className="me-5">(Company Seal & Signature)</div>
                      </div>
                    </div>
                    <div className={`watermark cross`}>{watermark}</div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default RetrievalIssueManifest;
