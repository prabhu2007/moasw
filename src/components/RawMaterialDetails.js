import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CONSTS } from '../CONSTS';
import './styles.css';

const RawMaterialDetails = ({
  rawMaterialDetails,
  setRawMaterialDetails,
  toatlDailyData,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRawMaterialDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const { totalAmount, pindiSent, pindiUsed, pindiReturned } = toatlDailyData;

  return (
    <>
      <Box
        sx={{
          padding: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderRadius: '8px',
          display: 'flex',
        }}
      >
        <div className="simple-border">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={rawMaterialDetails.date}
              onChange={(newValue) =>
                setRawMaterialDetails((prevDetails) => ({
                  ...prevDetails,
                  date: newValue,
                }))
              }
              renderInput={(params) => (
                <TextField {...params} margin="normal" />
              )}
            />
          </LocalizationProvider>
          <TextField
            select
            label="Time"
            name="time"
            value={rawMaterialDetails.time}
            onChange={handleChange}
            sx={{ marginLeft: 2 }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </TextField>
        </div>
        <div className="simple-border">
          <TextField
            type="number"
            name="drum1Gullu"
            label="Drum 1 Gullu"
            value={rawMaterialDetails.drum1Gullu}
            onChange={handleChange}
            sx={{ width: '100px', marginLeft: 1 }}
          />

          <TextField
            type="number"
            label="Drum 1 Pindi"
            name="drum1Pindi"
            value={rawMaterialDetails.drum1Pindi}
            onChange={handleChange}
            sx={{ width: '100px', marginRight: 1 }}
          />
        </div>
        <div className="simple-border">
          <TextField
            type="number"
            label="Drum 2 Gullu"
            name="drum2Gullu"
            value={rawMaterialDetails.drum2Gullu}
            onChange={handleChange} //
            sx={{ width: '100px', marginLeft: 1 }}
          />
          <TextField
            type="number"
            label="Drum 2 Pindi"
            name="drum2Pindi"
            value={rawMaterialDetails.drum2Pindi}
            onChange={handleChange}
            sx={{ width: '100px', marginRight: 1 }}
          />
        </div>
        <div className="simple-border">
          <TextField
            type="number"
            label="Drum 3 Gullu"
            name="drum3Gullu"
            value={rawMaterialDetails.drum3Gullu}
            onChange={handleChange}
            sx={{ width: '100px', marginLeft: 1 }}
          />
          <TextField
            type="number"
            label="Drum 3 Pindi"
            name="drum3Pindi"
            value={rawMaterialDetails.drum3Pindi}
            onChange={handleChange}
            sx={{ width: '100px', marginRight: 1 }}
          />
        </div>
        <div className="simple-border">
          <TextField
            type="number"
            label="Idly Gullu"
            name="idlyGullu"
            value={rawMaterialDetails.idlyGullu}
            onChange={handleChange}
            sx={{ width: '100px', marginLeft: 1 }}
          />
          <TextField
            type="number"
            label="Idly Pindi"
            name="idlyPindi"
            value={rawMaterialDetails.idlyPindi}
            onChange={handleChange}
            sx={{ width: '100px', marginRight: 1 }}
          />
        </div>
      </Box>
      <div className="simple-red-border d-flex">
        <Typography
          sx={{
            fontWeight: 700,
            paddingRight: '10px',
            borderRight: '1px solid #000',
          }}
          variant="subtitle1"
        >
          Total Amount: Rs. {totalAmount}
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            paddingRight: '10px',
            paddingLeft: '10px',
            borderRight: '1px solid #000',
          }}
          variant="subtitle1"
        >
          Pindi Sent: {pindiSent}
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            paddingRight: '10px',
            paddingLeft: '10px',
            borderRight: '1px solid #000',
          }}
          variant="subtitle1"
        >
          Pindi Used: {pindiUsed}
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            paddingRight: '10px',
            paddingLeft: '10px',
            borderRight: '1px solid #000',
          }}
          variant="subtitle1"
        >
          Pindi Returned: {Number(parseFloat(pindiReturned).toFixed(2))}
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            paddingRight: '10px',
            paddingLeft: '10px',
            borderRight: '1px solid #000',
          }}
          variant="subtitle1"
        >
          Pindi Returned in Gullu:{' '}
          {Number((pindiReturned / CONSTS.pindiPerKGGullu).toFixed(2)) || 0}
        </Typography>
      </div>
    </>
  );
};

export default RawMaterialDetails;
