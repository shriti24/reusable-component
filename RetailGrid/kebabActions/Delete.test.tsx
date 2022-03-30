import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Delete from './Delete';
import { GridContextAPI } from '../contextAPI';
import * as utils from '../../../services/getConfig';
import * as deleteService from '../../../services/deleteRetail';

jest.mock('../contextAPI');
const deleteRetail = jest
  .spyOn(require('../../../services/deleteRetail'), 'deleteRetail')
  .mockResolvedValue({ data: { errorMsgList: null }, status: 200 });

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

jest.spyOn(utils, 'getPath').mockReturnValue('');

const _retailReason = [
  { value: 'CC', label: 'Cost Change', type: 'BP' },
  { value: 'COM', label: 'Competitor', type: 'BP' },
  { value: 'IR', label: 'Initial Retail', type: 'BP' },
  { value: 'MP', label: 'Private/Natl Gap', type: 'BP' },
  { value: 'PGG', label: 'Profit Go Get', type: 'BP' },
  { value: 'PI', label: 'Price Investment', type: 'BP' },
  { value: 'PT', label: 'Price Test', type: 'BP' },
  { value: 'MD', label: 'Markdown', type: 'MD' }
];

const _markdownreason = [
  { value: 'DG', label: 'Dated Goods', type: 'MD' },
  { value: 'EOL', label: 'End Of Life', type: 'MD' },
  { value: 'LT1', label: 'Last One', type: 'MD' },
  { value: 'OS', label: 'Overstock', type: 'MD' }
];

const _data = {
  apple: false,
  ball: false,
  blockReasonCodeTxt: 'Markdown',
  category: '90-PURGEABLE',
  claimOnHandQty: 0,
  clubNbr: 4711,
  createTimestamp: '2022-01-07T05:44:19.403Z',
  currentBlock: {
    blockReasonCode: 'MDP',
    blockReasonCodeTxt: 'Markdown',
    createdTimeStamp: '2022-01-07T05:41:13.917Z',
    creatorAppId: 'BLOCK_API',
    creatorId: 'S0C02M0   ',
    endDate: '2022-07-06',
    lastChangeAppId: 'BLOCK_API',
    lastChangeId: 'S0C02M0   ',
    lastChangeTimeStamp: '2022-01-07T05:41:13.967Z',
    priceBlockId: 62268,
    startDate: '2022-01-07'
  },
  customerRetailAmt: null,
  effectiveDate: '2022-01-08',
  endDate: '2022-07-06',
  futureBlocks: [
    {
      priceBlockId: 62269,
      blockReasonCode: 'MDP',
      blockReasonCodeTxt: 'Markdown',
      startDate: '2022-01-08',
      endDate: '2022-07-07'
    }
  ],
  itemDesc: 'CONTINENTAL',
  itemNbr: 3440,
  itemOffShelfDate: '',
  itemOnShelfDate: '2017-05-11',
  itemStatus: 'D',
  key: '105631373440',
  lastChangeId: 'ROLLIN',
  lastChangeTimeStamp: 'S0C02M0    | 01/07/22 | 11:11:13 am',
  lastChangedTimestamp: '2022-01-07T23:28:34.13Z',
  lock: 'Locked',
  margin: -1037.1628,
  marketAreaNumber: 34,
  nike: false,
  onHandQty: 0,
  onOrderQty: 0,
  orderableCost: 113.83,
  orderableQty: 1,
  otherRetails: '',
  piItem: false,
  piMarket: 'No PI market',
  piMarketType: 'No PI market type',
  regionName: 'Northeast',
  retailActionId: 10563137,
  retailAmount: 10.01,
  retailReason: 'DG ',
  retailReasonCodeTxt: 'Dated Goods',
  retailType: 'MD',
  startDate: '2022-01-07',
  stateProvCode: 'VA',
  status: 'Current',
  subCategory: '50-Blank',
  testn: false,
  type: 'Club',
  whpkSellAmt: 113.83
};

let gridContext = {
  selectedType: '',
  retailReasons: _retailReason,
  markdownReasons: _markdownreason,
  isDisable: false,
  isDelete: false,
  errorMsg: '',
  setType: jest.fn(),
  clearType: jest.fn(),
  close: jest.fn(),
  save: jest.fn(),
  refresh: false,
  setRefresh: jest.fn(),
  getReasonData: jest.fn(),
  setDelete: jest.fn()
};

describe('Delete Functionality', () => {
  beforeEach(() => {
    deleteRetail.mockResolvedValue({ data: { errorMsgList: null }, status: 200 });
  });

  afterEach(() => {
    deleteRetail.mockReset();
  });

  test('Render delete', () => {
    render(
      <GridContextAPI.Provider value={gridContext}>
        <Delete />
      </GridContextAPI.Provider>
    );
    expect(screen.queryByTestId('test-delete-id'));
  });

  test('Render delete when selectedType: delete, call delete retail service on delete click', () => {
    const deleteRetailSpy = jest.spyOn(deleteService, 'deleteRetail');
    gridContext = { ...gridContext, selectedType: 'delete', data: _data };

    render(
      <GridContextAPI.Provider value={gridContext}>
        <Delete />
      </GridContextAPI.Provider>
    );
    fireEvent.click(screen.getByTestId('test-delete-remove'));
    expect(screen.queryByTestId('test-delete-id'));
    expect(deleteRetailSpy).toHaveBeenCalled();
  });
  test('should not call delete retail on delete button click if there is no data', () => {
    const deleteRetailSpy = jest.spyOn(deleteService, 'deleteRetail');
    gridContext = { ...gridContext, selectedType: 'delete', data: null };

    render(
      <GridContextAPI.Provider value={gridContext}>
        <Delete />
      </GridContextAPI.Provider>
    );
    fireEvent.click(screen.getByTestId('test-delete-remove'));
    expect(deleteRetailSpy).not.toHaveBeenCalled();
  });
  test('should handle delete retail non-success scenario', () => {
    deleteRetail.mockResolvedValue({ data: { errorMsgList: null }, status: 204 });
    const deleteRetailSpy = jest.spyOn(deleteService, 'deleteRetail');
    gridContext = { ...gridContext, selectedType: 'delete', data: _data };

    render(
      <GridContextAPI.Provider value={gridContext}>
        <Delete />
      </GridContextAPI.Provider>
    );
    fireEvent.click(screen.getByTestId('test-delete-remove'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(deleteRetailSpy).toHaveBeenCalledTimes(1);
  });
});
