import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import dayjs from 'dayjs';
import React, { useState } from 'react';

const stalls = Array.from({ length: 6 }, (_, i) => `Stall ${i + 1}`);
const DailyTracking = () => {
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState('Morning');
  const [stallData, setStallData] = useState(
    stalls.map(() => ({
      can1: '',
      can2: '',
      dosaPackets: '',
      idlyPackets: '',
      idlies: '',
      returnCan1: '',
      returnCan2: '',
      returnDosaPackets: '',
      returnIdlyPackets: '',
      returnIdlies: '',
      amount: '',
      actualBatterUsed: 0,
      idliesSold: 0,
      dosaPacketsSold: 0,
      idlyPacketsSold: 0,
      dosasPerKG: 0,
    })),
  );

  const handleSubmit = async () => {
    console.log('stallData : ', stallData);
    /* const dataToSubmit = {
      date: selectedDate,
      time_period: timePeriod, // Morning or Evening
      stall_number: 1, // example
      can_1: can1,
      can_2: can2,
      idly: idly,
      dosa_packets: dosaPackets,
      idly_packets: idlyPackets,
      return_can_1: returnCan1,
      return_can_2: returnCan2,
      return_idly: returnIdly,
      return_dosa_packets: returnDosaPackets,
      return_idly_packets: returnIdlyPackets,
      amount: amount,
      dosasPerKG: dosasPerKG,
      remarks: remarks,
    };

    const { data, error } = await supabase
      .from('daily_tracking')
      .insert([dataToSubmit]);

    if (error) {
      console.error('Error submitting data: ', error);
    } else {
      console.log('Data submitted successfully: ', data);
    } */
  };

  const handleInputChange = (stallIndex, field, value) => {
    const newStallData = [...stallData];
    newStallData[stallIndex][field] = value;
    console.log('newStallData : ', newStallData);
    setStallData(newStallData);
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Date"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
        <TextField
          select
          label="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          sx={{ marginLeft: 2 }}
          SelectProps={{
            native: true,
          }}
        >
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
        </TextField>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {stallData.map((stall, index) => {
            const actualBatterUsed =
              parseFloat(stall.can1) +
              parseFloat(stall.can2) -
              (parseFloat(stall.returnCan1) + parseFloat(stall.returnCan2));
            const idliesSold =
              parseFloat(stall.idlies) - parseFloat(stall.returnIdlies);
            const dosaPacketsSold =
              parseFloat(stall.dosaPackets) -
              parseFloat(stall.returnDosaPackets);
            const idlyPacketsSold =
              parseFloat(stall.idlyPackets) -
              parseFloat(stall.returnIdlyPackets);
            const revenueFromIdlies = idliesSold * 8;
            const revenueFromIdlyPackets = idlyPacketsSold * 65;
            const revenueFromDosaPackets = dosaPacketsSold * 65;
            const totalRevenueFromItems =
              revenueFromIdlies +
              revenueFromIdlyPackets +
              revenueFromDosaPackets;
            const dosasPerKG =
              actualBatterUsed > 0
                ? (stall.amount - totalRevenueFromItems) / actualBatterUsed
                : 0;
            return (
              <Grid item xs={12} key={index}>
                <Box
                  sx={{
                    border: '1px solid #ccc',
                    padding: 2,
                    borderRadius: '5px',
                    backgroundColor: '#fff',
                  }}
                >
                  <Typography variant="h6">{stalls[index]}</Typography>

                  {/* Send Section */}
                  <Typography variant="subtitle1">Send</Typography>
                  <TextField
                    type="number"
                    label="Can 1"
                    value={stall.can1}
                    onChange={(e) =>
                      handleInputChange(index, 'can1', e.target.value)
                    }
                    sx={{ width: '100px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Can 2"
                    value={stall.can2}
                    onChange={(e) =>
                      handleInputChange(index, 'can2', e.target.value)
                    }
                    sx={{ width: '100px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Dosa Packets"
                    value={stall.dosaPackets}
                    onChange={(e) =>
                      handleInputChange(index, 'dosaPackets', e.target.value)
                    }
                    sx={{ width: '120px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Idly Packets"
                    value={stall.idlyPackets}
                    onChange={(e) =>
                      handleInputChange(index, 'idlyPackets', e.target.value)
                    }
                    sx={{ width: '120px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Idlies"
                    value={stall.idlies}
                    onChange={(e) =>
                      handleInputChange(index, 'idlies', e.target.value)
                    }
                    sx={{ width: '100px', marginRight: 1 }}
                  />

                  {/* Return Section */}
                  <Typography variant="subtitle1">Return</Typography>
                  <TextField
                    type="number"
                    label="Return Can 1"
                    value={stall.returnCan1}
                    onChange={(e) =>
                      handleInputChange(index, 'returnCan1', e.target.value)
                    }
                    sx={{ width: '120px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Return Can 2"
                    value={stall.returnCan2}
                    onChange={(e) =>
                      handleInputChange(index, 'returnCan2', e.target.value)
                    }
                    sx={{ width: '120px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Return Dosa Packets"
                    value={stall.returnDosaPackets}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'returnDosaPackets',
                        e.target.value,
                      )
                    }
                    sx={{ width: '140px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Return Idly Packets"
                    value={stall.returnIdlyPackets}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'returnIdlyPackets',
                        e.target.value,
                      )
                    }
                    sx={{ width: '140px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Return Idlies"
                    value={stall.returnIdlies}
                    onChange={(e) =>
                      handleInputChange(index, 'returnIdlies', e.target.value)
                    }
                    sx={{ width: '120px', marginRight: 1 }}
                  />

                  <TextField
                    type="number"
                    label="Amount"
                    value={stall.amount}
                    onChange={(e) =>
                      handleInputChange(index, 'amount', e.target.value)
                    }
                    sx={{ width: '120px', marginRight: 1 }}
                  />
                  <div>
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 2,
                      }}
                    >
                      <Typography>
                        Actual Batter Used: {actualBatterUsed.toFixed(2)} kg
                      </Typography>
                      <Typography>Idlies Sold: {idliesSold}</Typography>
                      <Typography>
                        Dosa Packets Sold: {dosaPacketsSold}
                      </Typography>
                      <Typography>
                        Idly Packets Sold: {idlyPacketsSold}
                      </Typography>
                      <Typography
                        sx={{
                          color: dosasPerKG < 22 ? 'red' : 'green',
                        }}
                      >
                        Dosas per KG: {dosasPerKG.toFixed(2)}
                      </Typography>
                    </Box>
                  </div>
                </Box>
              </Grid>
            );
          })}
        </Grid>
        <Box sx={{ marginTop: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // Here you'd handle the data submission to the database

              handleSubmit();
              // Send data to your backend or local database
            }}
          >
            Submit
          </Button>
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default DailyTracking;
