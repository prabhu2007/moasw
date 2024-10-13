import { supabase } from '../supabaseClient';

// Helper function to fetch data from daily_tracking by date
export const fetchDailyTrackingData = async (date, time) => {
  try {
    const { data, error } = await supabase
      .from('daily_tracking')
      .select('*')
      .eq('date', date)
      .eq('time', time);
    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching daily tracking data:', error.message);
    throw error;
  }
};

// Helper function to fetch data from unit by date and time
export const fetchUnitData = async (date, time) => {
  try {
    const { data, error } = await supabase
      .from('unit')
      .select('*')
      .eq('date', date)
      .eq('time', time);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching unit data:', error.message);
    throw error;
  }
};
