import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';

const QuotationList = ({ quotationAdviceData, onListView, setQuotationAdviceData, setEditMode }) => {
  const getQutationById = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/quotation/getQutationById?id=${id}`);
      if (response.status === 200) {
        const quotationVO = response.data.paramObjectsMap.quotationVO;

        // Set the id inside the quotationVO object
        quotationVO.id = id;

        setQuotationAdviceData(quotationVO);
        setEditMode(true);
        onListView(false);

        // Remove existing quotationData from localStorage

        // Storing the updated quotationVO with id in localStorage
      } else {
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClick = (id) => {
    getQutationById(id);
  };

  return (
    <TableContainer component={Paper} style={{ marginTop: 20 }}>
      <Typography variant="h6" style={{ padding: 20 }}>
        Quotation List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Shipping Address</TableCell>
            <TableCell>Customer Address</TableCell>
            <TableCell>Fin Year</TableCell>
            <TableCell>Quotation To</TableCell>
            <TableCell>Prefix</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quotationAdviceData?.map((quotation, index) => (
            <TableRow key={index}>
              <TableCell onClick={() => handleClick(quotation.quotationid)} style={{ cursor: 'pointer', color: 'blue' }}>
                {quotation.quotationid}
              </TableCell>
              <TableCell>{quotation.code}</TableCell>
              <TableCell>{quotation.shippingaddress}</TableCell>
              <TableCell>{quotation.customeraddress}</TableCell>
              <TableCell>{quotation.finyear}</TableCell>
              <TableCell>{quotation.quotationto}</TableCell>
              <TableCell>{quotation.prefix}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuotationList;
