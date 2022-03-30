/* eslint-disable prefer-spread */
import { ISalesData, RetailInquieryInfoV3 } from '../../../services/retail/type';
import { getCountryCode } from '../../../services/getConfig';
import {
  getLockStatus,
  getLockEffectiveDate,
  getBlockReasonCode,
  getLockEndDate,
  lockModifyStringFormatter
} from './getLockStatus';
import { getClubDetails } from './getClubData';

// currently generateData is not being used in app
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const generateData = (columnsData: any[], count = 1): unknown =>
//   new Array(count).fill(0).map(() => {
//     return columnsData.reduce((rowData, column) => {
//       rowData[column.field] = dataTypeCheck(column.field);
//       return rowData;
//     });
//   });

let competitorData: Array<{ compName: string; compId: string | number }>;

export const constructComp = (data) => {
  competitorData = data.competitorList;
  return competitorData;
};

const generateCompetitorValues = (competitors, compId) =>
  competitors ? competitors.includes(compId) : false;

const validateSalesInfo = (itemClub: string, salesData: any, mapData: any): void => {
  const itemClubData = itemClub.split('_');
  for (let elem = 0; elem <= salesData.length; elem++) {
    if (salesData[elem]?.itemNbr.toString() === itemClubData[0]) {
      const index = salesData[elem].clubs.findIndex(
        (club) => club.clubnbr.toString() === itemClubData[1]
      );
      if (index >= 0) {
        mapData.set(itemClub, salesData[elem].clubs[index].aggregateSalesData[0]);
        salesData[elem].clubs.splice(index, 1);
      } else {
        mapData.set(itemClub, null);
      }
      break;
    }
  }
};

export const checkSalesData = (
  itemNbr: number,
  clubNbr: number,
  salesData: any,
  mapData: any
): void => {
  const itemClub = `${itemNbr}_${clubNbr}`;
  if (salesData?.length) {
    if (!mapData.has(itemClub)) {
      validateSalesInfo(itemClub, salesData, mapData);
    }
  } else {
    mapData.set(itemClub, null);
  }
};
const getCurrentRetPc = (data) => {
  const COUNTRY_CODE = getCountryCode();
  switch (COUNTRY_CODE) {
    case 'US':
      return data.retailAmount;
    case 'MX':
      return data.customerRetailAmt;
  }
};

export const constructRetailData = (
  retailData: Array<RetailInquieryInfoV3>,
  salesData: Array<ISalesData>
): unknown[] => {
  const retailDataResult = [];
  const mapData = new Map();

  for (const retail of retailData) {
    const {
      currentActiveRetail,
      clubLocationDetails,
      itemDetails,
      currentBlock,
      otherRetails,
      itemDescription,
      category,
      subCategory
    } = retail;

    let competitorArray = [];
    competitorData?.forEach((element) => {
      competitorArray.push({
        [element.compName.toLowerCase()]: generateCompetitorValues(
          retail.competitors,
          element.compId
        )
      });
    });
    competitorArray = Object.assign(Object, ...competitorArray);
    // Pas in the first retail Info
    const otherBlocks =
      retail.otherBlocks !== null
        ? retail.otherBlocks.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
        : retail.otherBlocks;

    if (salesData) {
      checkSalesData(retail.itemNbr, retail.clubNbr, salesData, mapData);
    }
    const salesInfo = mapData.get(`${retail.itemNbr}_${retail.clubNbr}`);
    const clubData = getClubDetails(clubLocationDetails);

    retailDataResult.push({
      key: `${currentActiveRetail.retailActionId}${retail.itemNbr}`,
      itemNbr: retail.itemNbr,
      itemDesc: itemDescription,
      category: category,
      subCategory: subCategory,
      clubNbr: retail.clubNbr,
      country: getCountryCode(),
      retailAmount: currentActiveRetail.retailAmount,
      retailActionId: currentActiveRetail.retailActionId,
      effectiveDate: currentActiveRetail.effectiveDate,
      effectiveTimestamp: currentActiveRetail.effectiveTimestamp,
      customerRetailAmt: currentActiveRetail.customerRetailAmt,
      retailReason: currentActiveRetail.retailReason,
      creatorId: currentActiveRetail.creatorId,
      currentActiveRetailPrice: getCurrentRetPc(currentActiveRetail),
      lock: getLockStatus(currentBlock, otherBlocks),
      status: currentActiveRetail.status,
      // retailTypeTxt: currentActiveRetail.retailTypeTxt,
      retailType: currentActiveRetail.retailType,
      retailReasonCodeTxt: currentActiveRetail.retailReasonCodeTxt,
      orderableCost: itemDetails !== null ? itemDetails.orderableCost : '',
      orderableQty: itemDetails !== null ? itemDetails.orderableQty : '',
      whpkSellAmt: itemDetails !== null ? itemDetails.whpkSellAmt : '',
      margin: itemDetails !== null ? itemDetails.margin : '',
      onHandQty: itemDetails !== null ? itemDetails.onHandQty : '',
      onOrderQty: itemDetails !== null ? itemDetails.onOrderQty : '',
      claimOnHandQty: itemDetails !== null ? itemDetails.claimOnHandQty : '',
      itemOnShelfDate: itemDetails !== null ? itemDetails.itemOnShelfDate : '',
      itemOffShelfDate:
        itemDetails !== null
          ? itemDetails.itemOffShelfDate !== null
            ? itemDetails.itemOffShelfDate
            : ''
          : '',
      blockReasonCodeTxt: getBlockReasonCode(currentBlock, otherBlocks),
      lastChangeTimeStamp: lockModifyStringFormatter(currentBlock, otherBlocks),
      createTimestamp:
        currentActiveRetail !== null
          ? currentActiveRetail.createTimestamp !== null
            ? currentActiveRetail.createTimestamp
            : ''
          : '',
      lastChangeId: currentActiveRetail.lastChangeId,
      lastChangedTimestamp:
        currentActiveRetail !== null
          ? currentActiveRetail.lastChangeTimestamp !== null
            ? currentActiveRetail.lastChangeTimestamp
            : ''
          : '',
      startDate: getLockEffectiveDate(currentBlock, otherBlocks),
      endDate: getLockEndDate(currentBlock, otherBlocks),
      currentBlock: currentBlock,
      futureBlocks: otherBlocks,
      otherRetails: otherRetails! == null ? otherRetails : '',
      piItem: currentBlock !== null ? (currentBlock.blockReasonCode == 'PII' ? true : false) : '',
      piMarket: retail.piMarket,
      piMarketType: retail.piMarketType,
      itemStatus: itemDetails !== null ? itemDetails.itemStatus : '',
      totalCost: salesInfo ? salesInfo.totalCost : '',
      totalSales: salesInfo ? salesInfo.totalSales : '',
      totalUnits: salesInfo ? salesInfo.totalUnits : '',
      outOfStockDate: salesInfo ? salesInfo.outOfStockDate : '',
      ...competitorArray,
      ...clubData,
      //mock data for competitors
      costcoAmount: (
        Math.random() *
        (currentActiveRetail.retailAmount ? currentActiveRetail.retailAmount + 1 : 0)
      ).toFixed(2),
      costcoDate: currentActiveRetail.effectiveDate,
      bjsAmount: (
        Math.random() *
        (currentActiveRetail.retailAmount ? currentActiveRetail.retailAmount + 1 : 0)
      ).toFixed(2),
      bjsDate: currentActiveRetail.effectiveDate,
      costcoMintAmount: (
        Math.random() *
        (currentActiveRetail.retailAmount ? currentActiveRetail.retailAmount + 1 : 0)
      ).toFixed(2),
      costcoMintDate: currentActiveRetail.effectiveDate,
      amazonMintAmount: (
        Math.random() *
        (currentActiveRetail.retailAmount ? currentActiveRetail.retailAmount + 1 : 0)
      ).toFixed(2),
      amazonMintDate: currentActiveRetail.effectiveDate,
      walmartMintAmount: (
        Math.random() *
        (currentActiveRetail.retailAmount ? currentActiveRetail.retailAmount + 1 : 0)
      ).toFixed(2),
      walmartMintDate: currentActiveRetail.effectiveDate,
      bestBuyMintAmount: (
        Math.random() *
        (currentActiveRetail.retailAmount ? currentActiveRetail.retailAmount + 1 : 0)
      ).toFixed(2),
      bestBuyMintDate: currentActiveRetail.effectiveDate
    });

    // Add in the Other Retail
    if (otherRetails !== null) {
      for (const other of otherRetails) {
        retailDataResult.push({
          key: `${other.retailActionId}${retail.itemNbr}`,
          retailActionId: other.retailActionId,
          itemNbr: retail.itemNbr,
          category: category,
          country: getCountryCode(),
          subCategory: subCategory,
          itemDesc: itemDescription,
          clubNbr: retail.clubNbr,
          retailAmount: other.retailAmount,
          effectiveDate: other.effectiveDate,
          effectiveTimestamp: other.effectiveTimestamp,
          customerRetailAmt: other.customerRetailAmt,
          currentActiveRetailPrice: getCurrentRetPc(currentActiveRetail),
          retailReason: other.retailReason,
          creatorId: other.creatorId,
          status: other.status,
          retailType: other.retailType,
          // retailTypeTxt: other.retailTypeTxt,
          retailReasonCodeTxt: other.retailReasonCodeTxt,
          orderableCost: itemDetails !== null ? itemDetails.orderableCost : '',
          orderableQty: itemDetails !== null ? itemDetails.orderableQty : '',
          whpkSellAmt: itemDetails !== null ? itemDetails.whpkSellAmt : '',
          margin: itemDetails !== null ? itemDetails.margin : '',
          onHandQty: itemDetails !== null ? itemDetails.onHandQty : '',
          onOrderQty: itemDetails !== null ? itemDetails.onOrderQty : '',
          claimOnHandQty: itemDetails !== null ? itemDetails.claimOnHandQty : '',
          itemOnShelfDate: itemDetails !== null ? itemDetails.itemOnShelfDate : '',
          itemOffShelfDate:
            itemDetails !== null
              ? itemDetails.itemOffShelfDate !== null
                ? itemDetails.itemOffShelfDate
                : ''
              : '',
          lock: getLockStatus(currentBlock, otherBlocks),
          blockReasonCodeTxt: getBlockReasonCode(currentBlock, otherBlocks),
          lastChangeTimeStamp: lockModifyStringFormatter(currentBlock, otherBlocks),
          createTimestamp:
            other !== null ? (other.createTimestamp !== null ? other.createTimestamp : '') : '',
          lastChangedTimestamp:
            other !== null
              ? other.lastChangeTimestamp !== null
                ? other.lastChangeTimestamp
                : ''
              : '',
          lastChangeId: other.lastChangeId,
          startDate: getLockEffectiveDate(currentBlock, otherBlocks),
          endDate: getLockEndDate(currentBlock, otherBlocks),
          currentBlock: currentBlock,
          futureBlocks: otherBlocks,
          otherRetails: otherRetails,
          piItem:
            currentBlock !== null ? (currentBlock.blockReasonCode == 'PII' ? true : false) : '',
          piMarket: retail.piMarket,
          piMarketType: retail.piMarketType,
          itemStatus: itemDetails !== null ? itemDetails.itemStatus : '',
          totalCost: salesInfo ? salesInfo.totalCost : '',
          totalSales: salesInfo ? salesInfo.totalSales : '',
          totalUnits: salesInfo ? salesInfo.totalUnits : '',
          outOfStockDate: salesInfo ? salesInfo.outOfStockDate : '',
          ...competitorArray,
          ...clubData
        });
      }
    }
  }
  return retailDataResult;
};
