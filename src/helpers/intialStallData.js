export const initialStallData = (stalls) => {
  return stalls.map((stall, index) => ({
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
  }));
};
