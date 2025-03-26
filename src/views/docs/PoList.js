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

const PoList = ({ poData, onListView, setPoVo, setEditMode }) => {
  const getInvoiceDataById = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/master/getInvoiceById?id=${id}`
      );
      if (response.status === 200) {
        const invoiceVO = response.data.paramObjectsMap.invoiceVO;

        // Set the id inside the invoiceVO object
        invoiceVO.id = id;

        setPoVo(invoiceVO);
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
        Po List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Po Id</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>PO Date</TableCell>
            <TableCell>Vendor</TableCell>
            {/* Add other fields here */}
          </TableRow>
        </TableHead>
        <TableBody>
          {poData?.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell
                onClick={() => handleClick(invoice.id)}
                style={{ cursor: "pointer", color: "blue" }}
              >
                {invoice.poNumber}
              </TableCell>
              <TableCell>Purchase Order</TableCell>
              <TableCell>{invoice.poDate}</TableCell>
              <TableCell>
                {invoice.vendorAddress
                  ? invoice.vendorAddress.split("\n")[0]
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

export default PoList;
