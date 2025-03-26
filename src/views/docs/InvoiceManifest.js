import AddIcon from "@mui/icons-material/Add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import dayjs from "dayjs";
import numberToWords from "number-to-words";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import InvoiceList from "./InvoiceList";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "white",
  color: "black",
  fontWeight: "bold",
  border: "1px solid black",
  "@media print": {
    border: "1px solid black",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "@media print": {
    border: "1px solid black",
  },
}));
const StyledTable = styled(Table)(({ theme }) => ({
  "@media print": {
    border: "1px solid black",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  [`@media print`]: {
    border: "none",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiInputBase-input": {
      padding: 0,
    },
  },
}));

const StyledTableCellActions = styled(StyledTableCell)(({ theme }) => ({
  "@media print": {
    display: "none",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "@media print": {
    display: "none",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  "@media print": {
    display: "none",
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  "@media print": {
    boxShadow: "none",
  },
}));

const PurchaseOrder = React.forwardRef((props, ref) => {
  const formatIndianCurrency = (number) => {
    if (number === 0) return "Zero";

    const crore = Math.floor(number / 10000000);
    const lakh = Math.floor((number % 10000000) / 100000);
    const thousand = Math.floor((number % 100000) / 1000);
    const remainder = number % 1000;

    let formatted = "";

    if (crore > 0) {
      formatted += `${numberToWords.toWords(crore)} crore`;
    }

    if (lakh > 0) {
      if (formatted) formatted += " ";
      formatted += `${numberToWords.toWords(lakh)} lakh`;
    }

    if (thousand > 0) {
      if (formatted) formatted += " ";
      formatted += `${numberToWords.toWords(thousand)} thousand`;
    }

    if (remainder > 0) {
      if (formatted) formatted += " ";
      formatted += `${numberToWords.toWords(remainder)}`;
    }

    // Convert to title case
    const toTitleCase = (str) => {
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };

    return toTitleCase(formatted.trim());
  };

  // Example usage:
  const totalInWordsIndianCurrency = formatIndianCurrency(props.total);
  console.log(`Total in Words: ₹ ${totalInWordsIndianCurrency} only`);

  return (
    <div>
      <div>
        <ToastContainer />
      </div>
      <Paper
        ref={ref}
        elevation={3}
        sx={{ padding: 4, fontFamily: "Roboto, sans-serif" }}
      >
        <Container>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              {/* Left Box */}
              <Grid item xs={2}>
                <img src="/AI_Packs.png" style={{ width: "150px" }}></img>
              </Grid>
              <Grid item xs={5}>
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  multiline
                  className="mt-3"
                  value={props.companyAddress}
                  onChange={(e) => props.setCompanyAddress(e.target.value)}
                  sx={{ mb: 1 }}
                />
              </Grid>

              {/* Right Box */}
              <Grid item xs={5} sx={{ textAlign: "right" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  TAX INVOICE
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flexBasis: "30%", maxWidth: 160 }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    Invoice No:
                  </Typography>
                  <StyledTextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={props.invoiceNo}
                    onChange={(e) => props.setInvoiceNo(e.target.value)}
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>

                <Box sx={{ flexBasis: "30%", maxWidth: 160 }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    Invoice Date:
                  </Typography>
                  <StyledTextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={props.invoiceDate}
                    onChange={(e) => props.setInvoiceDate(e.target.value)}
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>

                <Box sx={{ flexBasis: "30%", maxWidth: 160 }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    Terms:
                  </Typography>
                  <StyledTextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={props.term}
                    onChange={(e) => props.setTerm(e.target.value)}
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>

                <Box sx={{ flexBasis: "30%", maxWidth: 160 }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    Due Date:
                  </Typography>
                  <StyledTextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={props.dueDate}
                    onChange={(e) => props.setDueDate(e.target.value)}
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>

                <Box sx={{ flexBasis: "30%", maxWidth: 160 }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    Service Month:
                  </Typography>
                  <StyledTextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={props.serviceMonth}
                    onChange={(e) => props.setServiceMonth(e.target.value)}
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 3, mt: 3 }}>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Bill To
              </Typography>
              <StyledTextField
                fullWidth
                variant="outlined"
                multiline
                value={props.billToAddress}
                onChange={(e) => props.setBillToAddress(e.target.value)}
                sx={{ mb: 1 }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Ship To:
              </Typography>
              <StyledTextField
                fullWidth
                variant="outlined"
                multiline
                value={props.shipToAddress}
                onChange={(e) => props.setShipToAddress(e.target.value)}
                sx={{ mb: 1 }}
              />
            </Grid>
          </Grid>

          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table
              sx={{ border: "1px solid black", borderCollapse: "collapse" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#7D797D", // Set your desired background color here
                    }}
                  >
                    S.No
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#7D797D", // Set your desired background color here
                    }}
                  >
                    Item & Description
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#7D797D", // Set your desired background color here
                    }}
                  >
                    Qty
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#7D797D", // Set your desired background color here
                    }}
                  >
                    Rate
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#7D797D", // Set your desired background color here
                    }}
                  >
                    Amount
                  </TableCell>
                  <StyledTableCellActions
                    sx={{
                      border: "1px solid black",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#7D797D", // Set your desired background color here
                    }}
                  >
                    Actions
                  </StyledTableCellActions>
                </TableRow>
              </TableHead>

              <TableBody>
                {props.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      <StyledTextField
                        fullWidth
                        size="small"
                        multiline
                        variant="outlined"
                        value={item.description}
                        onChange={(e) =>
                          props.handleItemChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black", width: "150px" }}
                    >
                      <StyledTextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          props.handleItemChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black", width: "150px" }}
                    >
                      <StyledTextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        size="small"
                        value={item.rate}
                        onChange={(e) =>
                          props.handleItemChange(index, "rate", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {item.amount.toFixed(2)}
                    </TableCell>
                    <StyledTableCellActions sx={{ border: "1px solid black" }}>
                      <StyledIconButton
                        onClick={() => props.handleDeleteRow(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </StyledIconButton>
                    </StyledTableCellActions>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={props.handleAddRow}
            sx={{ mb: 3 }}
          >
            Add Row
          </StyledButton>

          <Box sx={{ textAlign: "right", mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.gstType === "inter"}
                  onChange={() => props.handleGstCalculation("inter")}
                />
              }
              label="Inter GST"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.gstType === "intra"}
                  onChange={() => props.handleGstCalculation("intra")}
                />
              }
              label="Intra GST"
            />
          </Box>

          {/* GST Calculation Result */}
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box sx={{ textAlign: "left", maxWidth: 500 }}>
                <Typography sx={{ fontWeight: "bold", mt: 13 }}>
                  Total in Words: ₹ {totalInWordsIndianCurrency} only
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: "right", mb: 3 }}>
                <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                  Subtotal: ₹ {props.subTotal.toFixed(2)}
                </Typography>
                {props.gstType === "intra" && (
                  <>
                    <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                      SGST (9%): ₹ {props.sgst.toFixed(2)}
                    </Typography>
                    <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                      CGST (9%): ₹ {props.cgst.toFixed(2)}
                    </Typography>
                  </>
                )}
                {props.gstType === "inter" && (
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    IGST (18%): ₹ {props.igst.toFixed(2)}
                  </Typography>
                )}
                <Typography sx={{ fontWeight: "bold", mt: 2 }}>
                  Total: ₹ {props.total.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Terms & Conditions:
            </Typography>

            <StyledTextField
              fullWidth
              multiline
              minRows={4}
              variant="outlined"
              value={props.termsAndConditions}
              onChange={(e) => props.setTermsAndConditions(e.target.value)}
              placeholder="Enter terms and conditions"
            />
          </Box>

          <Box sx={{ textAlign: "left", mt: 10, mb: 3 }}>
            <Typography variant="body1">
              Authorized Signature: ________________________________
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flexBasis: "30%", maxWidth: 170 }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    Bank Name:
                  </Typography>
                  <StyledTextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={props.bankName}
                    onChange={(e) => props.setBankName(e.target.value)}
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>

                <Box sx={{ flexBasis: "30%", maxWidth: 170 }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    Account Name:
                  </Typography>
                  <StyledTextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={props.accountName}
                    onChange={(e) => props.setAccountName(e.target.value)}
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>

                <Box sx={{ flexBasis: "30%", maxWidth: 170 }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    Account No:
                  </Typography>
                  <StyledTextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={props.accountNo}
                    onChange={(e) => props.setAccountNo(e.target.value)}
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>

                <Box sx={{ flexBasis: "30%", maxWidth: 170 }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    IFSC:
                  </Typography>
                  <StyledTextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={props.ifsc}
                    onChange={(e) => props.setIfsc(e.target.value)}
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", mt: 4, mb: 3 }}>
            <Typography variant="body1">ANNEXURE – “A”</Typography>
          </Box>
          <Box>
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={(e) => props.handleAddAnnexureRow()}
              sx={{ mb: 2 }}
            >
              Add Row
            </StyledButton>

            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table
                sx={{ border: "1px solid black", borderCollapse: "collapse" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        border: "1px solid black",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#7D797D",
                        width: "150px",
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid black",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#7D797D",
                      }}
                    >
                      Manifest No
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid black",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#7D797D",
                      }}
                    >
                      Emitter
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid black",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#7D797D",
                      }}
                    >
                      Location
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid black",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#7D797D",
                      }}
                    >
                      Kit No
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid black",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#7D797D",
                        width: "120px",
                      }}
                    >
                      Kit Qty
                    </TableCell>
                    <StyledTableCellActions
                      sx={{
                        border: "1px solid black",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#7D797D", // Set your desired background color here
                      }}
                    >
                      Actions
                    </StyledTableCellActions>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {props.annexureItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <StyledTextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          value={item.annexureDate}
                          onChange={(e) =>
                            props.handleAnnexureChange(
                              index,
                              "date",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <StyledTextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          value={item.manifestNo}
                          onChange={(e) =>
                            props.handleAnnexureChange(
                              index,
                              "manifestNo",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <StyledTextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          value={item.emitter}
                          onChange={(e) =>
                            props.handleAnnexureChange(
                              index,
                              "emitter",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <StyledTextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          value={item.location}
                          onChange={(e) =>
                            props.handleAnnexureChange(
                              index,
                              "location",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <StyledTextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          value={item.kitNo}
                          onChange={(e) =>
                            props.handleAnnexureChange(
                              index,
                              "kitNo",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <StyledTextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          type="number"
                          value={item.kitQty}
                          onChange={(e) =>
                            props.handleAnnexureChange(
                              index,
                              "kitQty",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <StyledTableCellActions
                        sx={{ border: "1px solid black" }}
                      >
                        <StyledIconButton
                          onClick={() => props.handleDeleteAnnexureRow(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </StyledIconButton>
                      </StyledTableCellActions>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Notes
            </Typography>
            <StyledTextField
              fullWidth
              multiline
              minRows={4}
              variant="outlined"
              value={props.notes}
              onChange={(e) => props.setNotes(e.target.value)}
              placeholder="Enter Notes"
            />
          </Box>
        </Container>
      </Paper>
    </div>
  );
});

const InvoiceManifest = () => {
  const componentRef = useRef();

  // State for editable fields
  const [companyAddress, setCompanyAddress] = useState(
    "SCM AI-PACKS Private Limited\n#23/1, T C Palya Main road, Hoysala Nagar, Bangalore - 560010"
  );
  const [billToAddress, setBillToAddress] = useState("");
  const [shipToAddress, setShipToAddress] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState(
    `1. The payment should be made by way of Account Payee Cheque / Demand Draft / NEFT / RTGS in the name of “SCM AIPACKS PVT LTD”
2. Any Discrepancy in the invoice shall be informed within 7 days of the invoice submission.
3. Interest at 2% p.m. or part thereof will be charged if the bill is not paid on the due date.
4. Any dispute is subject to Bangalore Jurisdiction.`
  );

  const [notes, setNotes] = useState(
    `The above are the Material Issue Manifest summary and the kits delivered details.
The billing is based on the manifest date.`
  );

  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(dayjs().format("DD-MM-YYYY"));
  const [term, setTerm] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [serviceMonth, setServiceMonth] = useState("");
  const [items, setItems] = useState([
    {
      description: "",
      quantity: 0,
      rate: 0,
      amount: 0,
    },
  ]);
  const [annexureItems, setAnnexureItems] = useState([
    {
      date: "",
      manifestNo: "",
      emitter: "",
      location: "",
      kitNo: "",
      kitQty: 0,
    },
  ]);

  const [subTotal, setSubTotal] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [total, setTotal] = useState(0);
  const [listView, setListView] = useState(false);
  const [gstType, setGstType] = useState(""); // "inter" or "intra"
  const [igst, setIgst] = useState(0);
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [invoiceVo, setInvoiceVo] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);

  const [orgId, setOrgId] = useState(
    parseInt(window.localStorage.getItem("orgId"))
  );

  useEffect(() => {
    getInvoiceData();
  }, []);

  const [editMode, setEditMode] = useState(false);
  // Function to handle GST calculation
  const handleGstCalculation = (type) => {
    setGstType(type);
    const gstRate = 0.18;
    const halfGstRate = gstRate / 2;

    let calculatedIgst = 0;
    let calculatedCgst = 0;
    let calculatedSgst = 0;

    if (type === "inter") {
      calculatedIgst = subTotal * gstRate;
      calculatedCgst = 0;
      calculatedSgst = 0;
    } else if (type === "intra") {
      calculatedIgst = 0;
      calculatedCgst = subTotal * halfGstRate;
      calculatedSgst = subTotal * halfGstRate;
    }

    setIgst(calculatedIgst);
    setCgst(calculatedCgst);
    setSgst(calculatedSgst);
    setTotal(subTotal + calculatedIgst + calculatedCgst + calculatedSgst);
  };

  const handleAddRow = () => {
    setItems([
      ...items,
      {
        description: "",
        quantity: 0,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const handleAddAnnexureRow = () => {
    setAnnexureItems([
      ...annexureItems,
      {
        annexureDate: "",
        manifestNo: "",
        emitter: "",
        location: "",
        kitNo: "",
        kitQty: 0,
      },
    ]);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice-${invoiceNo}`,
    onBeforeGetContent: () => {
      if (!invoiceNo || invoiceNo.trim() === "") {
        showErrorToast("Invoice No is a mandatory field.");
        return Promise.reject(); // Prevent the print if PO Number is empty
      }
      return Promise.resolve();
    },
  });

  const handleSave = () => {
    postInvoice();
  };

  const handleDeleteAnnexureRow = (index) => {
    const newAnnexureItems = annexureItems.filter((_, i) => i !== index);
    setAnnexureItems(newAnnexureItems);
  };

  const handleAnnexureChange = (index, field, value) => {
    const newAnnexureItems = [...annexureItems];
    newAnnexureItems[index] = { ...newAnnexureItems[index], [field]: value };
    setAnnexureItems(newAnnexureItems);
  };

  const handleDeleteRow = (index) => {
    const newItems = items.filter((item, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    setItems(newItems);
  };

  useEffect(() => {
    const calcSubtotal = items.reduce((acc, item) => acc + item.amount, 0);
    const calcSgst = calcSubtotal * 0.09;
    const calcCgst = calcSubtotal * 0.09;
    const calcTotal = calcSubtotal + calcSgst + calcCgst;
    setSubTotal(calcSubtotal);
    setSgst(calcSgst);
    setCgst(calcCgst);
    setTotal(calcTotal);
  }, [items]);

  useEffect(() => {
    if (invoiceVo && editMode) {
      setBillToAddress(invoiceVo.billToAddress || "");
      setShipToAddress(invoiceVo.shipToAddress || "");
      setCompanyAddress(invoiceVo.companyAddress || "");
      setInvoiceNo(invoiceVo.invoiceNo || "");
      setInvoiceDate(invoiceVo.invoiceDate || "");
      setItems(invoiceVo.productLines || []);
      setTermsAndConditions(invoiceVo.termsAndConditions || "");
      setSubTotal(invoiceVo.subTotal || 0);
      setSgst(invoiceVo.sgst || 0);
      setCgst(invoiceVo.cgst || 0);
      setTotal(invoiceVo.total || 0);
      setGstType(invoiceVo.gstType || "");
      setIgst(invoiceVo.igst || 0);
      setAccountName(invoiceVo.accountName);
      setBankName(invoiceVo.bankName);
      setAccountNo(invoiceNo.accountNo);
      setIfsc(invoiceVo.ifsc);
      setNotes(invoiceVo.notes);
      setAnnexureItems(invoiceVo.kitLines);
      setTerm(invoiceVo.term);
      setDueDate(invoiceVo.dueDate);
      setServiceMonth(invoiceVo.serviceMonth);
    }
  }, [invoiceVo, editMode]);

  const createFormData = () => {
    const data = {
      billToAddress,
      shipToAddress,
      companyAddress,
      invoiceNo,
      invoiceDate,
      productLines: items, // Items can remain as an array
      termsAndConditions,
      subTotal,
      sgst,
      cgst,
      total,
      gstType,
      igst,
      term,
      dueDate,
      serviceMonth,
      bankName,
      accountName,
      accountNo,
      ifsc,
      kitLines: annexureItems,
      notes,
      ...(editMode && { id: invoiceVo?.id }),
    };

    return data;
  };

  const postInvoice = () => {
    // Create the form data first
    const formData = createFormData();

    // Validate the invoice number before proceeding
    if (!formData.invoiceNo || formData.invoiceNo.trim() === "") {
      showErrorToast("Invoice No is a mandatory field.");
      return; // Prevent further execution if the invoice number is not valid
    }

    // Proceed with the API call if validation passes
    const formDataWithOrgId = { ...formData, orgId };

    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/master/createUpdateTaxInvoice`,
        formDataWithOrgId
      )
      .then((response) => {
        console.log("Response:", response.data);

        if (response.data.statusFlag === "Error") {
          // showErrorToast(response.data.paramObjectsMap.errorMessage);
        } else {
          showSuccessToast(
            editMode
              ? "Invoice Updated Successfully"
              : response.data.paramObjectsMap.message
          );
          getInvoiceData();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showErrorToast("An error occurred while posting the invoice.");
      });
  };

  const getInvoiceData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/master/getAllTaxInvoiceByOrgId?orgId=${orgId}`
      );
      if (response.status === 200) {
        setInvoiceData(response.data.paramObjectsMap.taxInvoiceVO.reverse());
      } else {
        console.error("API Error:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleListView = () => {
    setListView(!listView);
    handleNew();
  };

  const handleNew = () => {
    setBillToAddress("");
    setShipToAddress("");
    setInvoiceNo("");
    setInvoiceDate("");
    setItems([
      {
        description: "",
        quantity: 0,
        rate: 0,
        amount: 0,
      },
    ]);
    setSubTotal(0);
    setSgst("");
    setCgst("");
    setTotal(0);
    setGstType("");
    setIgst("");
    setAccountName("");
    setBankName("");
    setAccountNo("");
    setIfsc("");
    setAnnexureItems([
      {
        date: "",
        manifestNo: "",
        emitter: "",
        location: "",
        kitNo: "",
        kitQty: 0,
      },
    ]);
    setTerm("");
    setDueDate("");
    setServiceMonth("");
  };

  <style>
    {`
    @media print {
      @page {
        margin: 10mm;
        size: auto;  /* auto is the initial value */
        counter-increment: page;
      }

      body::after {
        content: "Page " counter(page);
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 12px;
        padding: 5px;
        color: #000;
      }
    }
  `}
  </style>;

  return (
    <Container style={{ width: "1060px" }}>
      <Box sx={{ textAlign: "right", mb: 3, gap: 2 }}>
        {!listView && (
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrint}
            startIcon={<PrintIcon />} // Add icon here
          >
            Print
          </Button>
        )}
        {!listView && (
          <Button
            sx={{ ml: 1 }}
            variant="contained"
            color="primary"
            onClick={handleSave}
            startIcon={<SaveIcon />} // Add icon here
          >
            Save
          </Button>
        )}
        <Button
          sx={{ ml: 1 }}
          variant="contained"
          color="primary"
          onClick={handleListView}
          startIcon={listView ? <AddIcon /> : <VisibilityIcon />} // Add icon here
        >
          {listView ? "New" : " View"}
        </Button>
        {!listView && (
          <Button
            sx={{ ml: 1 }}
            variant="contained"
            color="primary"
            onClick={handleNew}
            startIcon={<AddIcon />} // Add icon here
          >
            New
          </Button>
        )}
      </Box>

      {listView ? (
        <InvoiceList
          invoiceData={invoiceData}
          onListView={setListView}
          setInvoiceVo={setInvoiceVo}
          setEditMode={setEditMode}
        />
      ) : (
        <div>
          {" "}
          <PurchaseOrder
            ref={componentRef}
            companyAddress={companyAddress}
            setCompanyAddress={setCompanyAddress}
            billToAddress={billToAddress}
            setBillToAddress={setBillToAddress}
            shipToAddress={shipToAddress}
            setShipToAddress={setShipToAddress}
            invoiceNo={invoiceNo}
            setInvoiceNo={setInvoiceNo}
            invoiceDate={invoiceDate}
            setInvoiceDate={setInvoiceDate}
            term={term}
            setTerm={setTerm}
            dueDate={dueDate}
            setDueDate={setDueDate}
            serviceMonth={serviceMonth}
            setServiceMonth={setServiceMonth}
            items={items}
            handleItemChange={handleItemChange}
            handleDeleteRow={handleDeleteRow}
            handleAddRow={handleAddRow}
            handleAnnexureChange={handleAnnexureChange}
            handleDeleteAnnexureRow={handleDeleteAnnexureRow}
            handleAddAnnexureRow={handleAddAnnexureRow}
            subTotal={subTotal}
            sgst={sgst}
            cgst={cgst}
            igst={igst}
            accountName={accountName}
            accountNo={accountNo}
            ifsc={ifsc}
            bankName={bankName}
            setAccountName={setAccountName}
            setAccountNo={setAccountNo}
            setBankName={setBankName}
            setIfsc={setIfsc}
            gstType={gstType}
            total={total}
            handleGstCalculation={handleGstCalculation}
            termsAndConditions={termsAndConditions}
            setTermsAndConditions={setTermsAndConditions}
            annexureItems={annexureItems}
            notes={notes}
          />
        </div>
      )}
    </Container>
  );
};

export default InvoiceManifest;
