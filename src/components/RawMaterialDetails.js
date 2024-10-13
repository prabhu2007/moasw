import { Box, TextField } from '@mui/material';
import React from 'react';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './styles.css';

const RawMaterialDetails = ({ rawMaterialDetails, setRawMaterialDetails }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRawMaterialDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  return (
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
            renderInput={(params) => <TextField {...params} margin="normal" />}
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
  );
};

export default RawMaterialDetails;
