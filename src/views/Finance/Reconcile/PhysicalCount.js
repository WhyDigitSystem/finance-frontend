import { Box, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const denominations = [
  { value: 2000, label: '2000' },
  { value: 500, label: '500' },
  { value: 200, label: '200' },
  { value: 100, label: '100' },
  { value: 50, label: '50' },
  { value: 20, label: '20' },
  { value: 10, label: '10' },
  { value: 1, label: 'Change' }
];

const PhysicalCountComponent = () => {
  const [counts, setCounts] = useState(Array(denominations.length).fill(0));
  const [totalPhysicalCount, setTotalPhysicalCount] = useState(0);
  const [differenceAmount, setDifferenceAmount] = useState(0);

  // Handle input change
  const handleCountChange = (index, value) => {
    const newCounts = [...counts];
    newCounts[index] = Number(value);
    setCounts(newCounts);

    // Calculate total count and difference amount
    calculateTotals(newCounts);
  };

  // Calculation of total physical count and difference amount
  const calculateTotals = (counts) => {
    let totalAmount = 0;
    let totalCount = 0;

    counts.forEach((count, index) => {
      totalAmount += count * denominations[index].value;
      totalCount += count;
    });

    setTotalPhysicalCount(totalCount);
    setDifferenceAmount(totalAmount); // Adjust this based on actual vs expected amount logic
  };

  return (
    <Box p={2} sx={{ maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h6" align="center">
        Physical Count
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <Typography variant="subtitle1">Count</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">Amount</Typography>
        </Grid>
        {denominations.map((denom, index) => (
          <React.Fragment key={denom.value}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label={denom.label}
                value={counts[index]}
                onChange={(e) => handleCountChange(index, e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="text" value={(counts[index] * denom.value).toFixed(2)} disabled />
            </Grid>
          </React.Fragment>
        ))}
        {/* Total Physical Count */}
        <Grid item xs={6}>
          <Typography variant="subtitle1">Total Phy. Count</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth type="text" value={totalPhysicalCount} disabled />
        </Grid>

        {/* Difference Amount */}
        <Grid item xs={6}>
          <Typography variant="subtitle1">Difference Amount</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth type="text" value={differenceAmount.toFixed(2)} disabled />
        </Grid>

        {/* Remarks */}
        <Grid item xs={12}>
          <TextField fullWidth label="Remarks" multiline rows={3} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PhysicalCountComponent;
