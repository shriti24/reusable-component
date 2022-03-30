/* eslint-disable */
import { constructRetailData } from './genRetailData';

jest.spyOn(global.Math, 'random').mockReturnValue(0);
jest.spyOn(require('../../../services/getConfig'), 'getCountryCode').mockReturnValue('US');

const itemDesc = 'MEAT FRANKS';
const category = '42-Cooler';
const subCategory = '7-Hotdogs';
const itemStatus = 'D';
const itemOnShelfDate = '2013-04-07';

const retailData = [
  {
    itemNbr: 1170,
    clubNbr: 8196,
    itemDescription: itemDesc,
    itemDescription1: 'FRANKS-ALL MEAT',
    category,
    subCategory,
    itemDetails: {
      itemStatus,
      itemOnShelfDate,
      itemOffShelfDate: '2021-01-20',
      whpkSellAmt: 4.94,
      onHandQty: 0,
      onOrderQty: 0,
      claimOnHandQty: 0,
      orderableQty: 6,
      orderableCost: 28.02,
      margin: -868.62756
    },
    clubLocationDetails: {
      regionName: 'Mississippi Valley',
      marketAreaName: 'AL / MS / N. FL / GA',
      marketAreaNumber: 24,
      stateProvCode: 'AL',
      type: 'Club',
      clubName: 'FLORENCE, AL'
    },
    currentActiveRetail: {
      retailActionId: 9865301,
      retailAmount: 0.51,
      effectiveDate: '2020-11-08',
      expirationDate: '2049-12-30',
      retailType: 'BP',
      retailReason: 'LGY',
      retailTypeTxt: 'Base',
      retailReasonCodeTxt: 'Legacy',
      retailActionStatus: 115,
      creatorId: 'M0M096I   ',
      createTimestamp: '2020-11-08T08:15:53.39Z',
      lastChangeId: 'M0M096I   ',
      lastChangeTimestamp: '2020-11-08T08:15:53.39Z',
      status: 'Current',
      priceBlockId: null,
      customerRetailAmt: null,
      creatorAppId: null,
      lastChangeAppId: null,
      effectiveTimestamp: null,
      expirationTimestamp: null
    },
    otherRetails: [
      {
        retailActionId: 23052,
        retailAmount: 21.32,
        effectiveDate: '2022-02-16',
        expirationDate: '2049-12-31',
        retailType: 'BP',
        retailReason: 'IR ',
        retailTypeTxt: 'Base',
        retailReasonCodeTxt: 'Initial Retail',
        retailActionStatus: 110,
        creatorId: 'S0C02Y2',
        createTimestamp: '2022-02-08T14:34:12.117Z',
        lastChangeId: 'S0C02Y2',
        lastChangeTimestamp: '2022-02-08T14:34:12.117Z',
        status: 'Future',
        priceBlockId: null,
        customerRetailAmt: null,
        creatorAppId: 'WINGMAN',
        lastChangeAppId: 'WINGMAN',
        effectiveTimestamp: null,
        expirationTimestamp: null
      }
    ],
    currentBlock: {
      priceBlockId: 63082,
      blockReasonCode: 'DIS',
      blockReasonCodeTxt: 'Disaster',
      startDate: '2022-01-21',
      endDate: '2049-12-31',
      creatorId: 'S1B09GE   ',
      createdTimeStamp: '2022-01-21T06:57:53.37Z',
      lastChangeId: 'S1B09GE   ',
      lastChangeTimeStamp: '2022-01-21T06:57:53.42Z',
      creatorAppId: 'BLOCK_API',
      lastChangeAppId: 'BLOCK_API'
    },
    otherBlocks: null,
    competitors: null,
    piMarket: 'No PI market',
    piMarketType: 'No PI market type'
  }
];

describe('Retail Data Generate', () => {
  test('getRetailData', () => {
    const obj = [
      {
        amazonMintAmount: '0.35',
        amazonMintDate: '2020-11-08',
        bestBuyMintAmount: '1.27',
        bestBuyMintDate: '2020-11-08',
        bjsAmount: '1.01',
        bjsDate: '2020-11-08',
        costcoAmount: '1.30',
        costcoDate: '2020-11-08',
        costcoMintAmount: '0.56',
        costcoMintDate: '2020-11-08',
        currentActiveRetailPrice: undefined,
        key: '98653011170',
        itemNbr: 1170,
        itemDesc: itemDesc,
        category,
        subCategory,
        clubNbr: 8196,
        country: '',
        retailAmount: 0.51,
        retailActionId: 9865301,
        effectiveDate: '2020-11-08',
        effectiveTimestamp: null,
        customerRetailAmt: null,
        retailReason: 'LGY',
        creatorId: 'M0M096I   ',
        lock: 'Locked',
        status: 'Current',
        retailType: 'BP',
        retailReasonCodeTxt: 'Legacy',
        orderableCost: 28.02,
        orderableQty: 6,
        whpkSellAmt: 4.94,
        margin: -868.62756,
        onHandQty: 0,
        onOrderQty: 0,
        claimOnHandQty: 0,
        itemOnShelfDate,
        itemOffShelfDate: '2021-01-20',
        blockReasonCodeTxt: 'Disaster',
        lastChangeTimeStamp: 'S1B09GE    | 01/21/22 | 12:27:53 pm',
        createTimestamp: '2020-11-08T08:15:53.39Z',
        lastChangeId: 'M0M096I   ',
        lastChangedTimestamp: '2020-11-08T08:15:53.39Z',
        startDate: '2022-01-21',
        endDate: '2049-12-31',
        currentBlock: {
          priceBlockId: 63082,
          blockReasonCode: 'DIS',
          blockReasonCodeTxt: 'Disaster',
          startDate: '2022-01-21',
          endDate: '2049-12-31',
          creatorId: 'S1B09GE   ',
          createdTimeStamp: '2022-01-21T06:57:53.37Z',
          lastChangeId: 'S1B09GE   ',
          lastChangeTimeStamp: '2022-01-21T06:57:53.42Z',
          creatorAppId: 'BLOCK_API',
          lastChangeAppId: 'BLOCK_API'
        },
        futureBlocks: null,
        otherRetails: '',
        piItem: false,
        piMarket: 'No PI market',
        piMarketType: 'No PI market type',
        itemStatus,
        totalCost: 370.8,
        totalSales: 430.56,
        totalUnits: 72,
        outOfStockDate: '2022-04-16',
        type: 'Club',
        walmartMintAmount: '0.68',
        walmartMintDate: '2020-11-08',
        regionName: 'Mississippi Valley',
        marketAreaNumber: 24,
        stateProvCode: 'AL'
      },
      {
        key: '230521170',
        retailActionId: 23052,
        itemNbr: 1170,
        category,
        country: '',
        subCategory,
        itemDesc: itemDesc,
        clubNbr: 8196,
        retailAmount: 21.32,
        effectiveDate: '2022-02-16',
        effectiveTimestamp: null,
        customerRetailAmt: null,
        retailReason: 'IR ',
        creatorId: 'S0C02Y2',
        status: 'Future',
        retailType: 'BP',
        retailReasonCodeTxt: 'Initial Retail',
        orderableCost: 28.02,
        orderableQty: 6,
        whpkSellAmt: 4.94,
        margin: -868.62756,
        onHandQty: 0,
        onOrderQty: 0,
        claimOnHandQty: 0,
        itemOnShelfDate,
        itemOffShelfDate: '2021-01-20',
        lock: 'Locked',
        blockReasonCodeTxt: 'Disaster',
        lastChangeTimeStamp: 'S1B09GE    | 01/21/22 | 12:27:53 pm',
        createTimestamp: '2022-02-08T14:34:12.117Z',
        lastChangedTimestamp: '2022-02-08T14:34:12.117Z',
        lastChangeId: 'S0C02Y2',
        currentActiveRetailPrice: undefined,
        startDate: '2022-01-21',
        endDate: '2049-12-31',
        currentBlock: {
          priceBlockId: 63082,
          blockReasonCode: 'DIS',
          blockReasonCodeTxt: 'Disaster',
          startDate: '2022-01-21',
          endDate: '2049-12-31',
          creatorId: 'S1B09GE   ',
          createdTimeStamp: '2022-01-21T06:57:53.37Z',
          lastChangeId: 'S1B09GE   ',
          lastChangeTimeStamp: '2022-01-21T06:57:53.42Z',
          creatorAppId: 'BLOCK_API',
          lastChangeAppId: 'BLOCK_API'
        },
        futureBlocks: null,
        otherRetails: [
          {
            retailActionId: 23052,
            retailAmount: 21.32,
            effectiveDate: '2022-02-16',
            expirationDate: '2049-12-31',
            retailType: 'BP',
            retailReason: 'IR ',
            retailTypeTxt: 'Base',
            retailReasonCodeTxt: 'Initial Retail',
            retailActionStatus: 110,
            creatorId: 'S0C02Y2',
            createTimestamp: '2022-02-08T14:34:12.117Z',
            lastChangeId: 'S0C02Y2',
            lastChangeTimestamp: '2022-02-08T14:34:12.117Z',
            status: 'Future',
            priceBlockId: null,
            customerRetailAmt: null,
            creatorAppId: 'WINGMAN',
            lastChangeAppId: 'WINGMAN',
            effectiveTimestamp: null,
            expirationTimestamp: null
          }
        ],
        piItem: false,
        piMarket: 'No PI market',
        piMarketType: 'No PI market type',
        itemStatus: 'D',
        totalCost: 370.8,
        totalSales: 430.56,
        totalUnits: 72,
        outOfStockDate: '2022-04-16',
        type: 'Club',
        regionName: 'Mississippi Valley',
        marketAreaNumber: 24,
        stateProvCode: 'AL'
      }
    ];

    const salesData = [
      {
        itemNbr: 1170,
        clubs: [
          {
            clubnbr: 8196,
            aggregateSalesData: [
              {
                onHand: 141,
                outOfStockDate: '2022-04-16',
                totalCost: 370.8,
                totalSales: 430.56,
                totalUnits: 72,
                weeksAggregated: 4
              }
            ]
          }
        ]
      }
    ];
    expect(constructRetailData(retailData, salesData)).toEqual(
      expect.arrayContaining([expect.objectContaining({ blockReasonCodeTxt: 'Disaster' })])
    );
  });
});
