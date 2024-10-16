import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import RawMaterialDetails from './components/RawMaterialDetails';
import cleanedStallData from './helpers/cleanedStallData';
import {
  fetchDailyTrackingData,
  fetchUnitData,
} from './helpers/fetchDailyTrackingData';
import { getTotalDetailsHelper } from './helpers/getTotalDetailsHelper';
import { initialRawmeterialData } from './helpers/initialRawmeterialData';
import { initialStallData } from './helpers/intialStallData';
import { sanitizedData } from './helpers/sanitizedData';
import { stallCalc } from './helpers/stallCalc';
import './styles.css';
import { supabase } from './supabaseClient';

const stalls = Array.from({ length: 6 }, (_, i) => `MoA ${i + 1}`);
const DailyTracking = () => {
  const [stallData, setStallData] = useState(initialStallData(stalls));
  const [toatlDailyData, setToatlDailyData] = useState({});
  const [rawMaterialDetails, setRawMaterialDetails] = useState(
    initialRawmeterialData(),
  );
  //const [loading, setLoading] = useState(false);
  const [prevDate, setPrevDate] = useState(null); // Track previous date
  const [prevTime, setPrevTime] = useState(null);
  const debounceTimer = useRef(null);

  const useLoadData = () => {
    const [dailyTrackingData, setDailyTrackingData] = useState(null);
    const [unitData, setUnitData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = async (date, time) => {
      try {
        setLoading(true); // Set loading state before fetching

        // Fetch daily_tracking data using helper
        const rawDailyTracking = await fetchDailyTrackingData(date, time);
        const dailyTracking = rawDailyTracking.sort(
          (a, b) => a.stallNumber - b.stallNumber,
        );
        setDailyTrackingData(dailyTracking);
        // Update stallData based on dailyTrackingData
        if (dailyTracking && dailyTracking.length > 0) {
          const updatedDailyTrackingData = sanitizedData(dailyTracking);
          setStallData(updatedDailyTrackingData);
          setToatlDailyData(getTotalDetailsHelper(updatedDailyTrackingData));
        } else {
          const initStallData = initialStallData(stalls);
          setStallData(initStallData); // Use initialStallData if no data is found
          setToatlDailyData(getTotalDetailsHelper(initStallData));
        }
        // Fetch unit data using helper
        const unitData = await fetchUnitData(date, time);
        console.log('unitData ==> ', unitData);
        setUnitData(unitData);
        // Update stallData based on dailyTrackingData
        if (unitData && unitData.length > 0) {
          const updatedUnitData = {
            ...unitData[0],
            date: dayjs(unitData[0].date),
          };
          console.log('unitData IFF ==> ', updatedUnitData);
          setRawMaterialDetails(updatedUnitData);
        } else {
          console.log('unitData ELSE==> ', unitData);
          // setRawMaterialDetails(initialRawmeterialData()); // Use initialStallData if no data is found
          const updatedUnitData = {
            ...initialRawmeterialData(),
            date: dayjs(unitData[0].date),
            time: rawMaterialDetails.time,
          };
          console.log('unitData IFF ==> ', updatedUnitData);
          setRawMaterialDetails(updatedUnitData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading state after fetching
      }
    };

    return {
      loadData,
      dailyTrackingData,
      unitData,
      error,
      loading,
      setLoading,
    };
  };
  const { loadData, dailyTrackingData, unitData, error, loading, setLoading } =
    useLoadData();

  // Call loadData when the app first initializes
  useEffect(() => {
    const initialDate = dayjs().format('YYYY-MM-DD'); // Current date when the app initializes
    const initialTime = 'Morning'; // Default time
    loadData(initialDate, initialTime);
  }, []); // Empty dependency array means it runs only on component mount

  // Call loadData when selectedDate or selectedTime changes
  useEffect(() => {
    // Clear the debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      const formattedDate = rawMaterialDetails.date
        ? dayjs(rawMaterialDetails.date).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD');
      console.log(
        'rawMaterialDetails.date : ',
        rawMaterialDetails.date,
        'formattedDate : ',
        formattedDate,
      );
      if (formattedDate !== prevDate || rawMaterialDetails.time !== prevTime) {
        setStallData(initialStallData(stalls));
        const updatedUnitData = {
          ...initialRawmeterialData(),
          date: rawMaterialDetails.date,
          time: rawMaterialDetails.time || 'Morning',
        };
        console.log('useEffect unitData IFF ==> ', updatedUnitData);
        setRawMaterialDetails(updatedUnitData);
        // Only call loadData if date has changed
        loadData(formattedDate, rawMaterialDetails.time || 'Morning');
        setPrevDate(formattedDate); // Update previous date
        setPrevTime(rawMaterialDetails.time); // Update previous time
      }
    }, 500);

    // Cleanup timer on component unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [rawMaterialDetails.date, rawMaterialDetails.time]); // dependencies include selectedDate and selectedTime

  // Function to insert data into the daily_tracking and unit tables
  const insertData = async (data) => {
    try {
      setLoading(true); // Start loading
      // Insert into daily_tracking table
      const { data: stallData, error: stallError } = await supabase
        .from('daily_tracking')
        .upsert(data.stallUpdatedData, {
          onConflict: ['date', 'time', 'stallNumber'],
        });

      if (stallError) {
        throw new Error(
          `Error inserting into daily_tracking: ${stallError.message}`,
        );
      }
      console.log('Stall data inserted successfully:', stallData);

      console.log('data.rawMaterialData data insert:', data.rawMaterialData);

      // Insert into unit table
      const { data: rawData, error: rawError } = await supabase
        .from('unit')
        .upsert(data.rawMaterialData, {
          onConflict: ['date', 'time'],
        });

      if (rawError) {
        throw new Error(`Error inserting into unit: ${rawError.message}`);
      }
      console.log('Raw material data inserted successfully:', rawData);
    } catch (error) {
      console.error('Insert failed:', error.message);
    } finally {
      setLoading(false); // Stop loading
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
    setToatlDailyData(getTotalDetailsHelper(newStallData));
  };

  return (
    <div>
      {loading && (
        <>
          <div className="background-overlay"></div>
          <div className="modal-loader">
            <div className="loader"></div>
            <p>Loading...</p>
          </div>
        </>
      )}
      <Box
        sx={{
          padding: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderRadius: '8px',
        }}
      >
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}></LocalizationProvider> */}
        <RawMaterialDetails
          setRawMaterialDetails={setRawMaterialDetails}
          rawMaterialDetails={rawMaterialDetails}
          toatlDailyData={toatlDailyData}
        />
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {stallData.map((indStall, curIndex) => {
            const stall = stallData[indStall?.stallNumber - 1];
            const index = indStall?.stallNumber - 1;
            const {
              actualBatterUsed,
              idliesSold,
              dosaPacketsSold,
              idlyPacketsSold,
              dosasPerKG,
              totalAmount,
            } = stallCalc(stall);
            return (
              <Grid item xs={12} key={curIndex}>
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
                  <TextField
                    label="Remarks"
                    value={stall.remarks}
                    onChange={(e) =>
                      handleInputChange(index, 'remarks', e.target.value, stall)
                    }
                    type="text"
                    sx={{ width: '250px', marginRight: 1 }}
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
                      <Typography
                        sx={{
                          color: '#fff',
                          backgroundColor: dosasPerKG < 22 ? 'red' : 'green',
                          padding: '3px',
                          fontWeight: '900',
                        }}
                      >
                        Dosas per KG: {dosasPerKG}
                      </Typography>
                      <Typography>Total Amount: Rs. {totalAmount}</Typography>
                      <Typography>
                        Actual Batter Used: {actualBatterUsed} kg
                      </Typography>
                      <Typography>Idlies Sold: {idliesSold}</Typography>
                      <Typography>
                        Dosa Packets Sold: {dosaPacketsSold}
                      </Typography>
                      <Typography>
                        Idly Packets Sold: {idlyPacketsSold}
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
      </Box>
    </div>
  );
};

export default DailyTracking;
