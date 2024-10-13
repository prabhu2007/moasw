import dayjs from 'dayjs';

const cleanedStallData = (stallData, rawMaterialDetails) => {
  const date =
    rawMaterialDetails.date === ''
      ? null
      : dayjs(rawMaterialDetails.date).format('YYYY-MM-DD');
  const time = rawMaterialDetails.time === '' ? null : rawMaterialDetails.time;
  const stallUpdatedData = stallData.map((stall) => {
    return {
      ...stall,
      date,
      time,
      sentCan1: stall.sentCan1 === '' ? null : stall.sentCan1,
      sentCan2: stall.sentCan2 === '' ? null : stall.sentCan2,
      sentDosaPackets:
        stall.sentDosaPackets === '' ? null : stall.sentDosaPackets,
      sentIdlyPackets:
        stall.sentIdlyPackets === '' ? null : stall.sentIdlyPackets,
      sentIdlies: stall.sentIdlies === '' ? null : stall.sentIdlies,
      returnCan1: stall.returnCan1 === '' ? null : stall.returnCan1,
      returnCan2: stall.returnCan2 === '' ? null : stall.returnCan2,
      returnDosaPackets:
        stall.returnDosaPackets === '' ? null : stall.returnDosaPackets,
      returnIdlyPackets:
        stall.returnIdlyPackets === '' ? null : stall.returnIdlyPackets,
      returnIdlies: stall.returnIdlies === '' ? null : stall.returnIdlies,
      online: stall.online === '' ? null : stall.online,
      cash: stall.cash === '' ? null : stall.cash,
      actualBatterUsed:
        stall.actualBatterUsed === '' ? null : stall.actualBatterUsed,
      idliesSold: stall.idliesSold === '' ? null : stall.idliesSold,
      dosaPacketsSold:
        stall.dosaPacketsSold === '' ? null : stall.dosaPacketsSold,
      idlyPacketsSold:
        stall.idlyPacketsSold === '' ? null : stall.idlyPacketsSold,
      dosasPerKG: stall.dosasPerKG === '' ? null : stall.dosasPerKG,
    };
  });
  const rawMaterialData = {
    ...rawMaterialDetails,
    date:
      rawMaterialDetails.date === ''
        ? null
        : dayjs(rawMaterialDetails.date).format('YYYY-MM-DD'),
    time: rawMaterialDetails.time === '' ? null : rawMaterialDetails.time,
    drum1Gullu:
      rawMaterialDetails.drum1Gullu === ''
        ? null
        : rawMaterialDetails.drum1Gullu,
    drum1Pindi:
      rawMaterialDetails.drum1Pindi === ''
        ? null
        : rawMaterialDetails.drum1Pindi,
    drum2Gullu:
      rawMaterialDetails.drum2Gullu === ''
        ? null
        : rawMaterialDetails.drum2Gullu,
    drum2Pindi:
      rawMaterialDetails.drum2Pindi === ''
        ? null
        : rawMaterialDetails.drum2Pindi,
    drum3Gullu:
      rawMaterialDetails.drum3Gullu === ''
        ? null
        : rawMaterialDetails.drum3Gullu,
    drum3Pindi:
      rawMaterialDetails.drum3Pindi === ''
        ? null
        : rawMaterialDetails.drum3Pindi,
    idlyGullu:
      rawMaterialDetails.idlyGullu === '' ? null : rawMaterialDetails.idlyGullu,
    idlyPindi:
      rawMaterialDetails.idlyPindi === '' ? null : rawMaterialDetails.idlyPindi,
  };
  return { stallUpdatedData, rawMaterialData };
};

export default cleanedStallData;
