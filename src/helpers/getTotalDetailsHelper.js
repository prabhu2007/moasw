export const getTotalDetailsHelper = (stallsData) => {
  console.log('stallsData : ', stallsData);
  return stallsData.reduce(
    (acc, stall) => {
      acc.totalAmount += Number(parseFloat(stall.totalAmount || 0));
      acc.pindiSent += (stall.sentCan1 || 0) + (stall.sentCan2 || 0);
      acc.pindiUsed += Number(
        parseFloat(stall.actualBatterUsed || 0).toFixed(2),
      );
      acc.pindiReturned += Number(
        (
          parseFloat(stall.returnCan1 || 0) +
          parseFloat(stall.returnCan2 || 0) +
          Number(stall.returnDosaPackets || 0)
        ).toFixed(2),
      );
      console.log(
        stall.stallNumber,
        ' == acc ==> ',
        acc,
        '===',
        Number(
          parseFloat(stall.returnCan1 || 0) +
            parseFloat(stall.returnCan2 || 0) +
            Number(stall.returnDosaPackets || 0),
        ),
      );
      return acc;
    },
    { totalAmount: 0, pindiSent: 0, pindiUsed: 0, pindiReturned: 0 },
  );
};
