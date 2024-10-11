import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import RawMaterialDetails from './components/RawMaterialDetails';
import cleanedStallData from './helpers/cleanedStallData';
import { stallCalc } from './helpers/stallCalc';
import { supabase } from './supabaseClient';

const stalls = Array.from({ length: 6 }, (_, i) => `MoA ${i + 1}`);
const DailyTracking = () => {
  const [stallData, setStallData] = useState(
    stalls.map((stall, index) => ({
      stallNumber: index + 1,
      sentCan1: '',
      sentCan2: '',
      sentDosaPackets: '',
      sentIdlyPackets: '',
      sentIdlies: '',
      returnCan1: '',
      returnCan2: '',
      returnDosaPackets: '',
      returnIdlyPackets: '',
      returnIdlies: '',
      online: '',
      cash: '',
      actualBatterUsed: '',
      idliesSold: '',
      dosaPacketsSold: '',
      idlyPacketsSold: '',
      dosasPerKG: '',
      remarks: 'Test',
    })),
  );

  const [rawMaterialDetails, setRawMaterialDetails] = useState({
    date: dayjs(),
    time: 'Morning',
    drum1Gullu: 0,
    drum1Pindi: 0,
    drum2Gullu: 0,
    drum2Pindi: 0,
    drum3Gullu: 0,
    drum3Pindi: 0,
    idlyGullu: 0,
    idlyPindi: 0,
  });
  //735-25kgs
  //2940 - 1
  //1800 - 26kgs

  // Function to insert data into the daily_tracking and unit tables
  const insertData = async (data) => {
    try {
      // Insert into daily_tracking table
      const { data: stallData, error: stallError } = await supabase
        .from('daily_tracking')
        .insert(data.stallUpdatedData);

      if (stallError) {
        throw new Error(
          `Error inserting into daily_tracking: ${stallError.message}`,
        );
      }
      console.log('Stall data inserted successfully:', stallData);

      // Insert into unit table
      const { data: rawData, error: rawError } = await supabase
        .from('unit')
        .insert([data.rawMaterialData]); // Use array to insert a single row

      if (rawError) {
        throw new Error(`Error inserting into unit: ${rawError.message}`);
      }
      console.log('Raw material data inserted successfully:', rawData);
    } catch (error) {
      console.error('Insert failed:', error.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the data from form fields
    const dataToSubmit = cleanedStallData(stallData, rawMaterialDetails);
    console.log('dataToSubmit : ', dataToSubmit);
    insertData(dataToSubmit);
  };
  const handleInputChange = (stallIndex, field, value, stall) => {
    const newStallData = [...stallData];
    newStallData[stallIndex][field] = value;
    const calculatedFinalValues = stallCalc(stall);
    newStallData[stallIndex] = {
      ...newStallData[stallIndex],
      ...calculatedFinalValues,
    };
    console.log('newStallData : ', newStallData);
    setStallData(newStallData);
  };

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        borderRadius: '8px',
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RawMaterialDetails
          setRawMaterialDetails={setRawMaterialDetails}
          rawMaterialDetails={rawMaterialDetails}
        />
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {stallData.map((stall, index) => {
            const {
              actualBatterUsed,
              idliesSold,
              dosaPacketsSold,
              idlyPacketsSold,
              dosasPerKG,
            } = stallCalc(stall);
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
                  <Typography
                    sx={{ fontWeight: 700, color: '#d32f2f' }}
                    variant="h6"
                  >
                    {stalls[index]}
                  </Typography>

                  {/* Send Section */}
                  <Typography sx={{ fontWeight: 700 }} variant="subtitle1">
                    Send
                  </Typography>
                  <TextField
                    type="number"
                    label="Can 1"
                    value={stall.sentCan1}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'sentCan1',
                        Number(e.target.value),
                        stall,
                      )
                    }
                    sx={{ width: '100px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Can 2"
                    value={stall.sentCan2}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'sentCan2',
                        Number(e.target.value),
                        stall,
                      )
                    }
                    sx={{ width: '100px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Dosa Packets"
                    value={stall.sentDosaPackets}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'sentDosaPackets',
                        Number(e.target.value),
                        stall,
                      )
                    }
                    sx={{ width: '120px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Idly Packets"
                    value={stall.sentIdlyPackets}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'sentIdlyPackets',
                        Number(e.target.value),
                        stall,
                      )
                    }
                    sx={{ width: '120px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Idlies"
                    value={stall.sentIdlies}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'sentIdlies',
                        Number(e.target.value),
                        stall,
                      )
                    }
                    sx={{ width: '100px', marginRight: 1 }}
                  />

                  {/* Return Section */}
                  <Typography
                    sx={{ fontWeight: 700, marginTop: '10px' }}
                    variant="subtitle1"
                  >
                    Return
                  </Typography>
                  <TextField
                    type="number"
                    label="Return Can 1"
                    value={stall.returnCan1}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'returnCan1',
                        Number(e.target.value),
                        stall,
                      )
                    }
                    sx={{ width: '120px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Return Can 2"
                    value={stall.returnCan2}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'returnCan2',
                        Number(e.target.value),
                        stall,
                      )
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
                        Number(e.target.value),
                        stall,
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
                        Number(e.target.value),
                        stall,
                      )
                    }
                    sx={{ width: '140px', marginRight: 1 }}
                  />
                  <TextField
                    type="number"
                    label="Return Idlies"
                    value={stall.returnIdlies}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'returnIdlies',
                        Number(e.target.value),
                        stall,
                      )
                    }
                    sx={{ width: '120px', marginRight: 1 }}
                  />

                  <TextField
                    type="number"
                    label="Cash"
                    value={stall.cash}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'cash',
                        Number(e.target.value),
                        stall,
                      )
                    }
                    sx={{ width: '120px', marginRight: 1 }}
                  />

                  <TextField
                    label="Online"
                    value={stall.online}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'online',
                        Number(e.target.value),
                        stall,
                      )
                    }
                    type="number"
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
                        Dosas per KG: {dosasPerKG}
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
            onClick={(e) => {
              // Here you'd handle the data submission to the database

              handleSubmit(e);
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
