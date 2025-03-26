import * as React from "react";
import { default as Axios, default as axios } from "axios";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import dayjs from "dayjs";
import { FaTrash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  stringAndNoAndSpecialCharValidation,
  stringValidation,
} from "../../utils/userInputValidation";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";

function RetrievalManifestProvider({ addRim, rimId }) {
  const [rimData, setRimData] = useState([]);
  const [transactionNo, setTransactionNo] = useState("");
  const [transactionDate, setTransactionDate] = useState(dayjs());
  const [dispatchDate, setDispatchDate] = useState(null);
  const [transactionType, setTransactionType] = useState("Retrieval Docket");
  const [sender, setSender] = useState("SCM AI-PACKS PVT LIMITED");
  const [warehouse, setWarehouse] = useState("");
  const [warehouseVO, setWarehouseVO] = useState([]);
  const [senderAddress, setSenderAddress] = useState("");
  const [receiver, setReceiver] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverGst, setReceiverGst] = useState("");
  const [transporterName, setTransporterName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [driverNo, setDriverNo] = useState("");
  const [kitId, setKitId] = useState("");
  const [kitQty, setKitQty] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [errors, setErrors] = useState({});
  const [emitterCustomersVO, setEmitterCustomersVO] = useState([]);
  const [senderVO, setSenderVO] = useState([]);
  const [kitVO, setKitVO] = useState([]);
  const [selectedKit, setSelectedKit] = useState(null);
  const [openKitModal, setOpenKitModal] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [kitDetails, setKitDetails] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem("orgId"));
  const [userName, setUserName] = React.useState(
    localStorage.getItem("userName")
  );

  useEffect(() => {
    if (rimId) {
      getRetrievalManifestProviderById();
    }
    getCustomersList();
    getWarehouseData();
    getAllUsersData();
    getAllKitData();
  }, []);

  const getRetrievalManifestProviderById = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/oem/getRetrievalManifestProviderById?id=${rimId}`
      );
      if (response.status === 200) {
        const editRimData =
          response.data.paramObjectsMap.retrievalManifestProviderVO;
        setRimData(editRimData);
        setTransactionNo(editRimData.transactionNo);
        setTransactionDate(dayjs(editRimData.transactionDate));
        setDispatchDate(dayjs(editRimData.dispatchDate));
        setTransactionType(editRimData.transactionType);
        setSenderAddress(editRimData.senderAddress);
        setReceiverName(editRimData.receiver);
        setReceiverAddress(editRimData.receiverAddress);
        setReceiverGst(editRimData.senderGst);
        setSender(editRimData.sender);
        setTransporterName(editRimData.transporterName);
        setVehicleNo(editRimData.vehicleeNo);
        setDriverNo(editRimData.driverPhoneNo);
        const transformedKitDetails =
          editRimData.retrievalManifestProviderDetailsVOs.reduce(
            (acc, detail) => {
              const existingKitIndex = acc.findIndex(
                (kit) => kit.kitNo === detail.kitId
              );
              if (existingKitIndex !== -1) {
                acc[existingKitIndex].assets.push({
                  assetCodeId: detail.assetCode,
                  assetName: detail.asset,
                  quantity: detail.assetQty,
                });
              } else {
                acc.push({
                  kitNo: detail.kitId,
                  kitDesc: detail.kitName,
                  kitQty: detail.kitQty,
                  hsnCode: detail.hsnCode,
                  assets: [
                    {
                      assetCodeId: detail.assetCode,
                      assetName: detail.asset,
                      quantity: detail.assetQty,
                    },
                  ],
                });
              }
              return acc;
            },
            []
          );

        setKitDetails(transformedKitDetails);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCustomersList = async () => {
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_URL}/api/master/getCustomersList?orgId=${orgId}`
      );

      if (response.status === 200) {
        setEmitterCustomersVO(
          response.data.paramObjectsMap.customersVO.emitterCustomersVO
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getWarehouseData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/warehouse/view?orgId=${orgId}`
      );

      if (response.status === 200) {
        setWarehouseVO(response.data.paramObjectsMap.WarehouseVO);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllUsersData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/company/getAllCompany`
      );

      if (response.status === 200) {
        setSenderVO(response.data.paramObjectsMap.organizationVO);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllKitData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/master/getallkit`
      );

      if (response.status === 200) {
        const kits = response.data.paramObjectsMap.KitVO;
        setKitVO(kits);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSenderChange = (event) => {
    setSender(event.target.value);
  };

  const handleEmitterChange = (event) => {
    const selectedReceiverId = event.target.value;
    setReceiverName(selectedReceiverId);

    const selectedReceiver = emitterCustomersVO.find(
      (customer) => customer.id === parseInt(selectedReceiverId)
    );

    if (selectedReceiver) {
      setReceiver(selectedReceiver.displayName);
      const address = selectedReceiver.customersAddressVO[0];
      if (address) {
        const { street1, street2, city, state, pinCode, gstNumber } = address;
        setReceiverAddress(
          `${street1}, ${street2}, ${city}, ${state} - ${pinCode}`
        );
        setReceiverGst(gstNumber);
      }
    }
  };

  const handleWarehouseChange = (event) => {
    const selectedWarehouseId = event.target.value;
    setWarehouse(selectedWarehouseId);

    const selectedWarehouse = warehouseVO.find(
      (warehouse) => warehouse.warehouseId === parseInt(selectedWarehouseId)
    );

    if (selectedWarehouse) {
      const { address, city, state, pincode } = selectedWarehouse;
      setSenderAddress(`${address}, ${city}, ${state} - ${pincode}`);
    }
  };

  const handleKitChange = (event) => {
    const selectedKitNo = event.target.value;
    setKitId(selectedKitNo);

    const selectedKit = kitVO.find((kit) => kit.kitNo === selectedKitNo);
    if (selectedKit) {
      setSelectedKit(selectedKit);
    } else {
      setSelectedKit(null);
    }
  };

  const handleKitQtyChange = (event) => {
    setKitQty(event.target.value);
  };
  const handleHsnChange = (event) => {
    setHsnCode(event.target.value);
  };

  const handleKitClose = () => {
    setOpenKitModal(false);
    setKitId("");
    setKitQty("");
    setHsnCode("");
    setErrors({});
  };

  const handleAddKitDetails = () => {
    if (!selectedKit || !kitQty || !hsnCode) {
      setErrors({
        kitId: selectedKit ? "" : "Please select a kit",
        kitQty: kitQty ? "" : "Please enter a kit quantity",
        hsnCode: hsnCode ? "" : "Please enter a HSN Code",
      });
      return;
    }

    const existingKit = kitDetails.find(
      (kit) => kit.kitNo === selectedKit.kitNo
    );
    if (existingKit) {
      toast.error("This kit has already been added.");
      return;
    }

    const newKitDetail = {
      kitNo: selectedKit.kitNo,
      kitQty,
      kitDesc: selectedKit.kitDesc,
      hsnCode,
      assets: Object.values(selectedKit.kitAssetCategory)
        .flat()
        .map((asset) => ({
          assetCodeId: asset.assetCodeId,
          assetName: asset.assetName,
          quantity: asset.quantity * kitQty,
        })),
    };

    setKitDetails([...kitDetails, newKitDetail]);
    setOpenKitModal(false);
    setKitId("");
    setKitQty("");
    setHsnCode("");
    setErrors({});
  };

  const handleDeleteKit = (kitIndex) => {
    const updatedKits = [...kitDetails];
    updatedKits.splice(kitIndex, 1);
    setKitDetails(updatedKits);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    let filteredValue = value;
    if (name === "transactionNo") {
      filteredValue = value
        .replace(/[^A-Z0-9\s&\-]/g, "")
        .slice(0, 7)
        .trim();
    } else if (name === "driverNo") {
      filteredValue = value.replace(/\D/g, "").slice(0, 10).trim();
    }

    switch (name) {
      case "dispatchDate":
        setDispatchDate(value);
        break;
      case "receiver":
        setReceiver(value);
        break;
      case "receiverAddress":
        setReceiverAddress(value);
        break;
      case "receiverGst":
        setReceiverGst(value);
        break;
      case "sender":
        setSender(value);
        break;
      case "senderAddress":
        setSenderAddress(value);
        break;
      case "transactionDate":
        setTransactionDate(value);
        break;
      case "transactionNo":
        setTransactionNo(filteredValue);
        break;
      case "transactionType":
        setTransactionType(value);
        break;
      case "transporterName":
        setTransporterName(value);
        break;
      case "vehicleNo":
        setVehicleNo(value.toUpperCase());
        break;
      case "driverNo":
        setDriverNo(filteredValue);
        break;
      default:
        break;
    }
  };

  const transformKitDetails = (kits) => {
    const transformedDetails = [];

    kits.forEach((kit) => {
      const { kitNo, kitQty, kitDesc, hsnCode, assets } = kit;

      assets.forEach((asset, index) => {
        transformedDetails.push({
          asset: asset.assetName,
          assetCode: asset.assetCodeId,
          assetQty: asset.quantity,
          hsnCode: parseInt(hsnCode, 10),
          id: index, // Using index as ID
          kitId: kitNo,
          kitName: kitDesc,
          kitQty: parseInt(kitQty, 10),
        });
      });
    });

    return transformedDetails;
  };

  const createUpdateRetrievalManifest = () => {
    console.log("save");
    const errors = {};
    if (!dispatchDate) errors.dispatchDate = "Dispatch Date is required";
    if (!transactionDate)
      errors.transactionDate = "Transaction Date is required";
    if (!receiver) errors.receiver = "Receiver is required";
    if (!warehouse) errors.warehouse = "Warehouse is required";
    if (!receiver) errors.receiver = "Sender is required";
    if (!transactionNo) errors.transactionNo = "Transaction No is required";
    if (!transporterName)
      errors.transporterName = "Transporter Name is required";
    if (!vehicleNo) errors.vehicleNo = "Vehicle No is required";
    if (!driverNo) errors.driverNo = "Driver Phone No is required";
    if (kitDetails.length === 0)
      errors.kitDetails = "Please add at least one Kit detail";

    if (Object.keys(errors).length === 0) {
      const retrievalManifestProviderDetailsDTO =
        transformKitDetails(kitDetails);

      const formData = {
        createdBy: userName,
        dispatchDate,
        driverPhoneNo: driverNo,
        retrievalManifestProviderDetailsDTO,
        orgId,
        sender: receiver,
        senderAddress: receiverAddress,
        senderGst: receiverGst,
        receiver: sender,
        receiverAddress: senderAddress,
        transactionDate: transactionDate.format("YYYY-MM-DD"),
        transactionNo,
        transactionType,
        transporterName,
        vechileNo: vehicleNo,
        ...(rimId ? { id: rimId } : {}),
      };

      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/oem/createUpdateRetrievalManifest`,
          formData
        )
        .then((response) => {
          if (response.data.statusFlag === "Error") {
            showErrorToast(response.data.paramObjectsMap.errorMessage);
          } else {
            showSuccessToast(response.data.paramObjectsMap.message);
            setDispatchDate(null);
            setReceiver("");
            setReceiverName("");
            setWarehouse("");
            setReceiverAddress("");
            setReceiverGst("");
            setSender("");
            setSenderAddress("");
            setTransactionDate(null);
            setTransactionNo("");
            setTransactionType("");
            setTransporterName("");
            setVehicleNo("");
            setVehicleNo("");
            setDriverNo({});
            setKitDetails([]);
            setOpenKitModal(false);
            setTimeout(() => {
              addRim(false);
            });
            // addRim(false);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to update Issue Manifest. Please try again.");
        });
    } else {
      setErrors(errors);
    }
  };

  const handleMimClose = () => {
    if (
      dispatchDate ||
      driverNo ||
      receiver ||
      receiverAddress ||
      receiverGst ||
      sender ||
      senderAddress ||
      transactionDate ||
      transactionNo ||
      transactionType ||
      transporterName ||
      vehicleNo ||
      kitDetails > 0
    ) {
      setOpenConfirmationDialog(true);
    } else {
      setOpenConfirmationDialog(false);
    }
  };

  const handleConfirmationYes = () => {
    setOpenConfirmationDialog(false);
    addRim(false);
  };

  return (
    <>
      <div style={{ maxWidth: 1060 }} className="ml-auto me-auto">
        <div className="card w-full p-6 bg-base-100 shadow-xl">
          <div>
            <ToastContainer />
          </div>
          <div className="d-flex justify-content-end">
            <IoMdClose
              onClick={handleMimClose}
              className="cursor-pointer w-8 h-8 mb-3"
            />
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 mb-2 col-sm-4">
              <label className="label">
                <span
                  className={
                    "d-flex flex-row label-text label-font-size text-base-content"
                  }
                >
                  Transaction No:
                  {/* <FaStarOfLife className="must" /> */}
                </span>
              </label>
            </div>
            <div className="col-lg-3 col-md-6 mb-2 col-sm-4">
              <input
                className="form-control form-sz mb-2"
                name="transactionNo"
                type="text"
                value={transactionNo}
                onInput={stringAndNoAndSpecialCharValidation}
                onChange={handleInputChange}
              />
              {errors.transactionNo && (
                <span className="error-text">{errors.transactionNo}</span>
              )}
            </div>
            <div className="col-lg-3 col-md-6 mb-2 col-sm-4">
              <label className="label">
                <span
                  className={
                    "label-text label-font-size text-base-content d-flex flex-row"
                  }
                >
                  Transaction Date:
                  {/* <FaStarOfLife className="must" /> */}
                </span>
              </label>
            </div>
            <div className="col-lg-3 col-md-6 mb-2 col-sm-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  value={transactionDate}
                  onChange={(date) => setTransactionDate(dayjs(date))}
                  slotProps={{
                    textField: { size: "small", clearable: true },
                  }}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
              {errors.transactionDate && (
                <span className="error-text">{errors.transactionDate}</span>
              )}
            </div>
            <div className="col-lg-3 col-md-6 mb-2 col-sm-4">
              <label className="label">
                <span
                  className={
                    "label-text label-font-size text-base-content d-flex flex-row"
                  }
                >
                  Dispatch Date:
                  {/* <FaStarOfLife className="must" /> */}
                </span>
              </label>
            </div>
            <div className="col-lg-3 col-md-6 mb-2 col-sm-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  value={dispatchDate}
                  onChange={(date) =>
                    setDispatchDate(dayjs(date).format("YYYY-MM-DD"))
                  }
                  slotProps={{
                    textField: { size: "small", clearable: true },
                  }}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
              {errors.dispatchDate && (
                <span className="error-text">{errors.dispatchDate}</span>
              )}
            </div>
            <div className="col-lg-3 col-md-6 mb-2 col-sm-4">
              <label className="label">
                <span
                  className={
                    "label-text label-font-size text-base-content d-flex flex-row"
                  }
                >
                  Transaction Type:
                  {/* <FaStarOfLife className="must" /> */}
                </span>
              </label>
            </div>
            <div className="col-lg-3 col-md-6 mb-2 col-sm-4">
              <input
                className="form-control form-sz mb-2"
                name="transactionType"
                type="text"
                value={transactionType}
                disabled
              />
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <label className="label">
                <span className={"label-text text-base-content"}>Sender:</span>
              </label>
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <select
                className="form-select form-sz w-full mb-2"
                onChange={handleEmitterChange}
                value={receiverName}
              >
                <option value="" disabled>
                  Select an sender
                </option>
                {emitterCustomersVO.length > 0 &&
                  emitterCustomersVO.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.displayName}
                    </option>
                  ))}
              </select>
              {errors.receiver && (
                <span className="error-text mb-1">{errors.receiver}</span>
              )}
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <label className="label">
                <span className={"label-text text-base-content "}>
                  Sender's Address:
                </span>
              </label>
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <textarea
                placeholder=""
                className="form-control form-sz mb-2"
                style={{ height: 100 }}
                name="receiverAddress"
                value={senderAddress}
                disabled
              />
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <label className="label">
                <span className="label-text text-base-content">
                  Sender's GST:
                </span>
              </label>
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <input
                placeholder=""
                className="form-control form-sz mb-2"
                name="receiverGst"
                type="text"
                value={receiverGst}
                disabled
              />
            </div>
            {/* <div className="col-lg-3 col-md-6">
          <label className="label mb-4">
            <span
              className={
                "label-text label-font-size text-base-content d-flex flex-row"
              }
            >
              Receiver:
              {/* <FaStarOfLife className="must" /> 
            </span>
          </label>
        </div>
        <div className="col-lg-3 col-md-6">
          <select
            className="form-select form-sz w-full mb-2"
            onChange={handleSenderChange}
            value={sender}
          >
            <option value="" disabled>
              Select an sender
            </option>
            {senderVO.length > 0 &&
              senderVO.map((list) => (
                <option key={list.id} value={list.name}>
                  {list.name}
                </option>
              ))}
          </select>
          {errors.sender && (
            <span className="error-text mb-1">{errors.sender}</span>
          )}
        </div> */}
            <div className="col-lg-3 col-md-6 mb-2">
              <label className="label">
                <span className={"label-text text-base-content"}>
                  Receiver Warehouse:
                </span>
              </label>
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <select
                className="form-select form-sz w-full mb-2"
                onChange={handleWarehouseChange}
                value={warehouse}
              >
                <option value="" disabled>
                  Select an warehouse
                </option>
                {warehouseVO.length > 0 &&
                  warehouseVO.map((list) => (
                    <option key={list.warehouseId} value={list.warehouseId}>
                      {list.warehouseLocation}
                    </option>
                  ))}
              </select>
              {errors.warehouse && (
                <span className="error-text mb-1">{errors.warehouse}</span>
              )}
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <label className="label">
                <span className={"label-text text-base-content "}>
                  Warehouse's Address:
                </span>
              </label>
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <textarea
                placeholder=""
                className="form-control form-sz mb-2"
                style={{ height: 100 }}
                name="senderAddress"
                value={receiverAddress}
                disabled
              />
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <label className="label">
                <span
                  className={"label-text label-font-size text-base-content "}
                >
                  Transporter Name:
                </span>
              </label>
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <div className="d-flex flex-row">
                <input
                  placeholder=""
                  type="text"
                  name="transporterName"
                  className="form-control form-sz mb-2"
                  value={transporterName}
                  onChange={handleInputChange}
                  onInput={stringValidation}
                />
              </div>
              {errors.transporterName && (
                <span className="error-text">{errors.transporterName}</span>
              )}
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <label className="label">
                <span
                  className={"label-text label-font-size text-base-content "}
                >
                  Vehicle No:
                </span>
              </label>
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <input
                className="form-control form-sz mb-2"
                placeholder={""}
                type="text"
                name="vehicleNo"
                value={vehicleNo}
                onChange={handleInputChange}
              />
              {errors.vehicleNo && (
                <span className="error-text">{errors.vehicleNo}</span>
              )}
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <label className="label">
                <span
                  className={"label-text label-font-size text-base-content "}
                >
                  Driver No:
                </span>
              </label>
            </div>
            <div className="col-lg-3 col-md-6 mb-2">
              <input
                className="form-control form-sz mb-2"
                placeholder={""}
                type="number"
                name="driverNo"
                value={driverNo}
                onChange={handleInputChange}
                maxLength={10}
              />
              {errors.driverNo && (
                <span className="error-text">{errors.driverNo}</span>
              )}
            </div>
            <div className="col-lg-12 col-md-12 mb-2">
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-ghost btn-lg text-sm col-xs-1"
                  style={{ color: "blue" }}
                  onClick={() => setOpenKitModal(true)}
                >
                  <img
                    src="/new.png"
                    alt="new-icon"
                    title="new"
                    style={{
                      width: 30,
                      height: 30,
                      margin: "auto",
                      hover: "pointer",
                    }}
                  />
                  <span
                    className="text-form text-base"
                    style={{ marginLeft: "10px" }}
                  >
                    Kit
                  </span>
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              {errors.kitDetails && (
                <span className="error-text mb-1">{errors.kitDetails}</span>
              )}
            </div>
            {kitDetails.length > 0 && (
              <div
                className="w-full p-3 bg-base-100 shadow-xl"
                style={{ borderRadius: 16 }}
              >
                <div className="text-xl font-semibold p-2">
                  Kit & Qty Details
                </div>
                <div className="divider mt-0 mb-0"></div>
                <div className="overflow-x-auto w-full">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="text-center">Action</th>
                        <th className="text-center">Kit No</th>
                        <th className="text-center">Kit Name</th>
                        <th className="text-center">Kit Qty</th>
                        <th className="text-center">HSN Code</th>
                        <th className="text-center">Product Code</th>
                        <th className="text-center" style={{ width: "200px" }}>
                          Product Name
                        </th>
                        <th className="text-center">Product Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kitDetails.map((kit, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            {/* <td
                          className="text-center"
                          rowSpan={kit.assets.length + 1}
                        >
                          {index + 1}
                        </td> */}
                            <td
                              className="text-center"
                              rowSpan={kit.assets.length + 1}
                            >
                              <FaTrash
                                onClick={() => handleDeleteKit(index)}
                                style={{ cursor: "pointer", color: "red" }}
                                className="ms-4"
                              />
                            </td>
                            <td
                              className="text-center"
                              rowSpan={kit.assets.length + 1}
                            >
                              {kit.kitNo}
                            </td>
                            <td
                              className="text-center"
                              rowSpan={kit.assets.length + 1}
                              style={{
                                width: 150,
                                overflow: "hidden",
                                textWrap: "wrap",
                              }}
                            >
                              {kit.kitDesc}
                            </td>
                            <td
                              className="text-center"
                              rowSpan={kit.assets.length + 1}
                            >
                              {kit.kitQty}
                            </td>
                            <td
                              className="text-center"
                              rowSpan={kit.assets.length + 1}
                            >
                              {kit.hsnCode}
                            </td>
                          </tr>
                          {kit.assets.map((asset, subIndex) => (
                            <tr key={subIndex}>
                              {/* <td className="text-center">{`${index + 1}.${
                            subIndex + 1
                          }`}</td> */}
                              <td className="text-center">
                                {asset.assetCodeId}
                              </td>
                              <td
                                className="text-center"
                                style={{
                                  width: 150,
                                  overflow: "hidden",
                                  textWrap: "wrap",
                                }}
                              >
                                {asset.assetName}
                              </td>
                              <td className="text-center">{asset.quantity}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <div className="d-flex flex-row mt-3">
            <button
              type="button"
              onClick={createUpdateRetrievalManifest}
              className="bg-blue me-5 inline-block rounded bg-primary h-fit px-6 pb-2 pt-2.5 text-sm font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              {rimId ? "Update" : "Proceed"}
            </button>
          </div>
          <Dialog
            fullWidth={true}
            maxWidth={"md"}
            open={openKitModal}
            onClose={handleKitClose}
          >
            <div>
              <ToastContainer />
            </div>
            <div className="d-flex justify-content-between">
              <DialogTitle>Add Kit & Qty Details</DialogTitle>
              <IoMdClose
                onClick={handleKitClose}
                className="cursor-pointer w-8 h-8 mt-3 me-3"
              />
            </div>
            <DialogContent>
              <DialogContentText>
                <div className="row">
                  <div className="col-lg-3 col-md-6 mb-2">
                    <label className="label">
                      <span className={"label-text text-base-content"}>
                        Kit:
                      </span>
                    </label>
                  </div>
                  <div className="col-lg-3 col-md-6 mb-2">
                    <select
                      className="form-select form-sz w-full mb-2"
                      value={kitId}
                      name="kitId"
                      onChange={handleKitChange}
                    >
                      <option value="" disabled>
                        Select a kit
                      </option>
                      {kitVO &&
                        kitVO.map((kit) => (
                          <option key={kit.id} value={kit.kitNo}>
                            {kit.kitNo}
                          </option>
                        ))}
                    </select>
                    {errors.kitId && (
                      <div className="error-text">{errors.kitId}</div>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-6 mb-2">
                    <label className="label">
                      <span
                        className={
                          "label-text label-font-size text-base-content "
                        }
                      >
                        Kit Qty:
                      </span>
                    </label>
                  </div>
                  <div className="col-lg-3 col-md-6 mb-2">
                    <input
                      className="form-control form-sz mb-2"
                      placeholder={""}
                      type="number"
                      name="kitQty"
                      value={kitQty}
                      onChange={handleKitQtyChange}
                    />
                    {errors.kitQty && (
                      <div className="error-text">{errors.kitQty}</div>
                    )}
                  </div>
                  <div className="col-lg-3 col-md-6 mb-2">
                    <label className="label">
                      <span
                        className={
                          "label-text label-font-size text-base-content "
                        }
                      >
                        HSN Code:
                      </span>
                    </label>
                  </div>
                  <div className="col-lg-3 col-md-6 mb-2">
                    <input
                      className="form-control form-sz mb-2"
                      placeholder={""}
                      type="text"
                      name="hsnCode"
                      value={hsnCode}
                      onChange={handleHsnChange}
                    />
                    {errors.hsnCode && (
                      <div className="error-text">{errors.hsnCode}</div>
                    )}
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions className="mb-2 me-2">
              <Button onClick={handleKitClose}>Cancel</Button>
              <Button
                component="label"
                variant="contained"
                onClick={handleAddKitDetails}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openConfirmationDialog}>
            <DialogContent>
              <p>Are you sure you want to close without saving changes?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmationDialog(false)}>
                No
              </Button>
              <Button onClick={handleConfirmationYes}>Yes</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default RetrievalManifestProvider;
