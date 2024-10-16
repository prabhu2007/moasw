import { CONSTS } from '../CONSTS';

export const stallCalc = (stall) => {
  const actualBatterUsed = Number(
    (
      parseFloat(stall?.sentCan1 || 0) +
      parseFloat(stall?.sentCan2 || 0) -
      (parseFloat(stall?.returnCan1 || 0) + parseFloat(stall?.returnCan2 || 0))
    ).toFixed(2),
  );

  const idliesSold =
    parseFloat(stall?.sentIdlies || 0) - parseFloat(stall?.returnIdlies || 0);
  console.log(
    'stall?.sentIdlies : ',
    typeof stall?.sentIdlies,
    '---',
    stall?.returnIdlies,
  );
  const dosaPacketsSold =
    parseFloat(stall?.sentDosaPackets || 0) -
    parseFloat(stall?.returnDosaPackets || 0);

  const idlyPacketsSold =
    parseFloat(stall?.sentIdlyPackets || 0) -
    parseFloat(stall?.returnIdlyPackets || 0);

  const totalAmount = Number(stall?.cash || 0) + Number(stall?.online || 0);
  const revenueFromIdlies = idliesSold * CONSTS.perIdlyCost;
  const revenueFromIdlyPackets = idlyPacketsSold * CONSTS.perIdlyPacketCost;
  const revenueFromDosaPackets = dosaPacketsSold * CONSTS.perDosaPacketCost;
  const totalRevenueFromItems =
    revenueFromIdlies + revenueFromIdlyPackets + revenueFromDosaPackets;

  console.log(
    'Amount : ',
    totalAmount,
    'totalRevenueFromItems : ',
    totalRevenueFromItems,
    'actualBatterUsed : ',
    actualBatterUsed,
  );
  const dosasPerKG =
    actualBatterUsed > 0
      ? Number(
          (
            (totalAmount - totalRevenueFromItems) /
            actualBatterUsed /
            CONSTS.perDosaCost
          ).toFixed(2),
        )
      : 0;

  return {
    actualBatterUsed,
    idliesSold,
    dosaPacketsSold,
    idlyPacketsSold,
    dosasPerKG,
    totalAmount,
  };
};
