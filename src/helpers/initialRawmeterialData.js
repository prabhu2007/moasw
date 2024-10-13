import dayjs from 'dayjs';

export const initialRawmeterialData = () => {
  return {
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
  };
};
