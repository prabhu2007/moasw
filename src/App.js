import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvwdkuoptfkpoahkgevk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2d2RrdW9wdGZrcG9haGtnZXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4NjU2MDYsImV4cCI6MjA0MzQ0MTYwNn0.bKCUEjR7-phG9PZqDNLnxeAdT_BC6FsuQYbX4Kuzhuc';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

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

  const handleInputChange = (stallIndex, field, value) => {
    const newStallData = [...stallData];
    newStallData[stallIndex][field] = value;
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
              console.log('Date:', date.format('YYYY-MM-DD'));
              console.log('Time:', time);
              console.log('Stall Data:', stallData);
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
