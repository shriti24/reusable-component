import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Lock from './Locks';
import { GridContextAPI } from '../contextAPI';
import * as utils from '../../../services/getConfig';
import RoleContext from '../../../pages/RoleContext';

jest.mock('../contextAPI');
jest
  .spyOn(require('../../common/HelperFunctions/CanValidator'), 'isMerchandiseOrRestrictedRole')
  .mockReturnValue(false);
jest.spyOn(require('../../common/HelperFunctions/CanValidator'), 'isAdmin').mockReturnValue(true);

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

jest.spyOn(utils, 'getPath').mockReturnValue('');

let _data = {
  key: '103506723440',
  itemNbr: 3440,
  itemDesc: 'CONTINENTAL',
  category: '90-PURGEABLE',
  subCategory: '50-Blank',
  clubNbr: 8194,
  retailAmount: 126.48,
  retailActionId: 10350672,
  effectiveDate: '2017-04-20',
  customerRetailAmt: null,
  retailReason: 'LGY',
  creatorId: 'PSNULL    ',
  lock: '(no locks)',
  status: 'Current',
  retailType: 'BP',
  retailReasonCodeTxt: 'Legacy',
  type: 'Club',
  regionName: 'Mississippi Valley',
  marketAreaNumber: 28,
  stateProvCode: 'GA',
  orderableCost: 113.83,
  orderableQty: 1,
  whpkSellAmt: 113.83,
  margin: 10.001582,
  onHandQty: 0,
  onOrderQty: 0,
  claimOnHandQty: 0,
  itemOnShelfDate: '2017-05-11',
  itemOffShelfDate: '',
  blockReasonCodeTxt: '',
  lastChangeTimeStamp: '',
  createTimestamp: '2017-04-20T11:48:24.333Z',
  lastChangeId: 'PSNULL    ',
  lastChangedTimestamp: '2017-04-20T11:48:24.333Z',
  startDate: '',
  endDate: '',
  currentBlock: null,
  futureBlocks: null,
  otherRetails: null,
  piItem: '',
  piMarket: 'No PI market',
  piMarketType: 'No PI market type',
  itemStatus: 'D',
  nike: true,
  testn: false,
  apple: false,
  ball: false
};

let _propsData = {
  activeBlock: '',
  baseRetailPrice: 1,
  expirationDate: '',
  lastChangeTimestamp: '',
  otherBlocks: [],
  retailActionStatus: 1,
  retailTypeTxt: '',
  markDown: [],
  key: '103506723440',
  itemNbr: 3440,
  itemDesc: 'CONTINENTAL',
  category: '90-PURGEABLE',
  subCategory: '50-Blank',
  clubNbr: 8194,
  retailAmount: 126.48,
  retailActionId: 10350672,
  effectiveDate: '2017-04-20',
  customerRetailAmt: null,
  retailReason: 'LGY',
  creatorId: 'PSNULL    ',
  lock: '(no locks)',
  status: 'Current',
  retailType: 'BP',
  retailReasonCodeTxt: 'Legacy',
  type: 'Club',
  regionName: 'Mississippi Valley',
  marketAreaNumber: 28,
  stateProvCode: 'GA',
  orderableCost: 113.83,
  orderableQty: 1,
  whpkSellAmt: 113.83,
  margin: 10.001582,
  onHandQty: 0,
  onOrderQty: 0,
  claimOnHandQty: 0,
  itemOnShelfDate: '2017-05-11',
  itemOffShelfDate: '',
  blockReasonCodeTxt: '',
  lastChangeTimeStamp: '',
  createTimestamp: '2017-04-20T11:48:24.333Z',
  lastChangeId: 'PSNULL    ',
  lastChangedTimestamp: '2017-04-20T11:48:24.333Z',
  startDate: '',
  endDate: '',
  currentBlock: null,
  futureBlocks: null,
  otherRetails: null,
  piItem: '',
  piMarket: 'No PI market',
  piMarketType: 'No PI market type',
  itemStatus: 'D',
  nike: true,
  testn: false,
  apple: false,
  ball: false
};

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

let gridContext = {
  selectedType: 'lock',
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

describe('Lock Functionality', () => {
  const user = {
    user: { userID: 'T0E0S1T', username: 'Development Test User' },
    role: {
      adminRole: true,
      consumerRole: false,
      description: 'US',
      name: 'GMM',
      realmId: 'WINGMAN TEST DEVELOPMENT ROLE'
    },
    group: [],
    permissions: {
      '/attributes': {
        allowedActions: ['Create']
      }
    },
    userCategoryNumber: [],
    userGroup: { name: 'GMM', description: 'US' }
  };

  test('Render Lock', () => {
    gridContext = { ...gridContext, data: _data };
    render(
      <RoleContext.Provider value={user}>
        <GridContextAPI.Provider value={gridContext}>
          <Lock data={_propsData} onEditClick={jest.fn()} handleDeleteLock={jest.fn()} />
        </GridContextAPI.Provider>
      </RoleContext.Provider>
    );

    expect(screen.getByTestId('Data-Lock-Div')).toBeInTheDocument();
  });

  test('Render Lock - Click Add Button', () => {
    gridContext = { ...gridContext, data: _data };
    render(
      <RoleContext.Provider value={user}>
        <GridContextAPI.Provider value={gridContext}>
          <Lock data={_propsData} onEditClick={jest.fn()} handleDeleteLock={jest.fn()} />
        </GridContextAPI.Provider>
      </RoleContext.Provider>
    );
    fireEvent.click(screen.getByTestId('Add Lock'));
    expect(screen.getByTestId('Add Lock')).toBeInTheDocument();
  });

  test('Render Lock - Update Lock, should call edit lock on edit lock icon click', async () => {
    const _futureBlock = [
      {
        blockReasonCode: 'DIS',
        blockReasonCodeTxt: 'Disaster',
        createdTimeStamp: '2022-01-14T08:41:08.377Z',
        creatorAppId: 'BLOCK_API',
        creatorId: 'T0E0S1T   ',
        endDate: '2049-12-31',
        lastChangeAppId: 'BLOCK_API',
        lastChangeId: null,
        lastChangeTimeStamp: null,
        priceBlockId: 62510,
        startDate: '2022-01-15'
      }
    ];
    _data = {
      ..._data,
      futureBlocks: _futureBlock
    };
    gridContext = { ...gridContext, data: _data };
    _propsData = { ..._propsData, futureBlocks: _futureBlock };
    const onEditClickMock = jest.fn();
    render(
      <RoleContext.Provider value={user}>
        <GridContextAPI.Provider value={gridContext}>
          <Lock data={_propsData} onEditClick={onEditClickMock} handleDeleteLock={jest.fn()} />
        </GridContextAPI.Provider>
      </RoleContext.Provider>
    );
    await waitFor(() => fireEvent.mouseEnter(screen.getByTestId('test-iconbutton-id')));
    const editIcon = screen.getByTestId('edit-icon');
    expect(editIcon).toBeInTheDocument();
    fireEvent.click(editIcon);
    expect(onEditClickMock).toHaveBeenCalledTimes(1);
  });

  test('Render Lock - Update Lock, should call edit lock on Add Lock button click', async () => {
    const _futureBlock = [
      {
        blockReasonCode: 'DIS',
        blockReasonCodeTxt: 'Disaster',
        createdTimeStamp: '2022-01-14T08:41:08.377Z',
        creatorAppId: 'BLOCK_API',
        creatorId: 'T0E0S1T   ',
        endDate: '2049-12-31',
        lastChangeAppId: 'BLOCK_API',
        lastChangeId: null,
        lastChangeTimeStamp: null,
        priceBlockId: 62510,
        startDate: '2022-01-15'
      }
    ];
    _data = {
      ..._data,
      futureBlocks: _futureBlock
    };
    gridContext = { ...gridContext, data: _data };
    _propsData = { ..._propsData, futureBlocks: _futureBlock };
    const onEditClickMock = jest.fn();
    render(
      <RoleContext.Provider value={user}>
        <GridContextAPI.Provider value={gridContext}>
          <Lock data={_propsData} onEditClick={onEditClickMock} handleDeleteLock={jest.fn()} />
        </GridContextAPI.Provider>
      </RoleContext.Provider>
    );
    const addLockButton = await screen.findByRole('button', { name: 'Add Lock' });
    expect(addLockButton).toBeInTheDocument();
    fireEvent.click(addLockButton);
    expect(onEditClickMock).toHaveBeenCalledTimes(1);
  });
});
