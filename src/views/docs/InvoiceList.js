import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";

const InvoiceList = ({
  invoiceData,
  onListView,
  setInvoiceVo,
  setEditMode,
}) => {
  const getInvoiceDataById = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/master/getTaxInvoiceById?id=${id}`
      );
      if (response.status === 200) {
        const invoiceVO = response.data.paramObjectsMap.taxInvoiceVO;

        // Set the id inside the invoiceVO object
        invoiceVO.id = id;

        setInvoiceVo(invoiceVO);
        setEditMode(true);
        onListView(false);

        // Remove existing invoiceData from localStorage

        // Storing the updated invoiceVO with id in localStorage
      } else {
        console.error("API Error:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClick = (id) => {
    getInvoiceDataById(id);
  };

  return (
    <TableContainer component={Paper} style={{ marginTop: 20 }}>
      <Typography variant="h6" style={{ padding: 20 }}>
        Invoice List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Invoice Id</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Invoice Date</TableCell>
            <TableCell>Cusromer</TableCell>
            {/* Add other fields here */}
          </TableRow>
        </TableHead>
        <TableBody>
          {invoiceData?.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell
                onClick={() => handleClick(invoice.id)}
                style={{ cursor: "pointer", color: "blue" }}
              >
                {invoice.invoiceNo}
              </TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>{invoice.invoiceDate}</TableCell>
              <TableCell>
                {invoice.billToAddress
                  ? invoice.billToAddress.split("\n")[0]
                  : ""}
              </TableCell>

              {/* Add other fields here */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InvoiceList;
