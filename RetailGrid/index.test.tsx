// Lib
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';

//Mocks
import { mockRetailData, mockSalesData } from '../../services/retail/mockData';

jest.spyOn(require('../../services/getConfig'), 'getPath').mockReturnValue({
  competitorsPath: '/path'
});

jest.spyOn(require('../../services/getConfig'), 'getCountryCode').mockReturnValue('US');

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    GLOBAL_ENV: 'dev',
    WCNP_MARKDOWN_UI_URL: 'http://markdown.pricing.walmart.com',
    WCNP_SIMULATOR_UI_URL: 'http://simulator.pricing.walmart.com',
    USER_PREFERENCES_URL: ''
  },
  serverRuntimeConfig: {}
}));

const mockuseselector = jest.spyOn(require('react-redux'), 'useSelector');
mockuseselector.mockReturnValue([]);

const mockUseHasFeature = jest.spyOn(require('@utils/useHasFeature'), 'useHasFeature');
mockUseHasFeature.mockImplementation((flag) => {
  if (flag === 'US_SALES_DATA') {
    return false;
  }

  if (flag === 'SHOW_MARKDOWN_RULES') {
    return false;
  }

  if (flag === 'COMPETITORS_COLUMN') {
    return false;
  }

  return false;
});

const mockDispatch = jest.fn();
const mockUseDispatch = jest.spyOn(require('react-redux'), 'useDispatch');
mockUseDispatch.mockReturnValue(mockDispatch);

const getDeniedClubsStub = jest.spyOn(
  require('../../services/markdownRuleService'),
  'getDeniedClubs'
);
getDeniedClubsStub.mockReturnValue({ status: 204, data: [] });

const getRetailsDataStub = jest.spyOn(
  require('../../services/retail/retailInquiryService'),
  'getRetailsData'
);
getRetailsDataStub.mockReturnValue(mockRetailData([10]));

const getCompetitiorsDataStub = jest.spyOn(
  require('../../services/retail/retailInquiryService'),
  'getCompetitiorsData'
);
getCompetitiorsDataStub.mockReturnValue({ status: 204, data: { competitorList: [] } });

const getReasonCodeStub = jest.spyOn(
  require('../../services/retail/retailReasonCodeService'),
  'getReasonCode'
);
getReasonCodeStub.mockReturnValue({ status: 204, data: [] });

const getSalesDataStub = jest.spyOn(
  require('../../services/retail/retailInquiryService'),
  'getSalesData'
);
getSalesDataStub.mockReturnValue(mockSalesData([10]));

// Component
import RetailGrid, { renderStatusCell as RenderStatusCell } from './index';
import RoleContext from '../../pages/RoleContext';
import { status } from './util/constants';

describe('Retail Grid - Retail API sending Empty Data', () => {
  let setRetailDataStub, roleContentValue, selectedItems;

  beforeEach(() => {
    selectedItems = [100, 200];
    roleContentValue = { userGroup: { name: 'ADMIN', description: 'US' }, permissions: {} };
    setRetailDataStub = jest.fn();

    getDeniedClubsStub.mockReturnValue({ status: 204, data: [] });
    getRetailsDataStub.mockReturnValue([]);
    getCompetitiorsDataStub.mockReturnValue({ status: 204, data: { competitorList: [] } });
    getReasonCodeStub.mockReturnValue({ status: 204, data: [] });
    getSalesDataStub.mockReturnValue(mockSalesData(selectedItems));
  });

  afterEach(() => {
    getDeniedClubsStub.mockReset();
    getRetailsDataStub.mockReset();
    getCompetitiorsDataStub.mockReset();
    getReasonCodeStub.mockReset();
    getSalesDataStub.mockReset();
  });

  test('Items Props is empty Array', async () => {
    selectedItems = [];
    render(
      <RoleContext.Provider value={roleContentValue}>
        <RetailGrid items={selectedItems} setSelectedRetailData={setRetailDataStub} />
      </RoleContext.Provider>
    );

    await waitFor(console.log, { timeout: 1000 * 10 });

    expect(screen.getByTestId('no-retail-found-container')).toBeInTheDocument();
    expect(screen.queryByTestId('retail-grid-table-container')).toBeNull();

    expect(screen.getByTestId('no-retail-found-container')).toHaveTextContent(
      `No retails found for item number`
    );

    // API Calls
    expect(getDeniedClubsStub).not.toBeCalled();
    expect(getRetailsDataStub).toBeCalled();
    expect(getRetailsDataStub.mock.calls[0][0]).toEqual(selectedItems);

    expect(getCompetitiorsDataStub).toBeCalled();
    // expect(getReasonCodeStub).toBeCalled();
    expect(getSalesDataStub).not.toBeCalled();

    // props
    expect(setRetailDataStub).toBeCalled();
  });

  test('Items Props is not empty array', async () => {
    render(
      <RoleContext.Provider value={roleContentValue}>
        <RetailGrid items={selectedItems} setSelectedRetailData={setRetailDataStub} />
      </RoleContext.Provider>
    );

    await waitFor(console.log, { timeout: 1000 * 10 });

    expect(screen.getByTestId('no-retail-found-container')).toBeInTheDocument();
    expect(screen.queryByTestId('retail-grid-table-container')).toBeNull();

    expect(screen.getByTestId('no-retail-found-container')).toHaveTextContent(
      `No retails found for item number ${selectedItems.join(',')}`
    );

    // API Calls
    expect(getDeniedClubsStub).not.toBeCalled();
    expect(getRetailsDataStub).toBeCalled();
    expect(getRetailsDataStub.mock.calls[0][0]).toEqual(selectedItems);

    expect(getCompetitiorsDataStub).toBeCalled();
    // expect(getReasonCodeStub).toBeCalled();
    expect(getSalesDataStub).not.toBeCalled();

    // props
    expect(setRetailDataStub).toBeCalled();
  });
});

describe('Retail Grid - Retail API sending Data', () => {
  let setRetailDataStub, roleContentValue, selectedItems, retailDataApiResult;

  beforeEach(() => {
    selectedItems = [100];
    roleContentValue = { userGroup: { name: 'ADMIN', description: 'US' }, permissions: {} };
    setRetailDataStub = jest.fn();

    retailDataApiResult = mockRetailData(selectedItems);

    retailDataApiResult.retailInquiryGridInfoList.length = 1;

    getDeniedClubsStub.mockReturnValue({ status: 204, data: [] });
    getRetailsDataStub.mockReturnValue(retailDataApiResult);
    getCompetitiorsDataStub.mockReturnValue({ competitorList: [{ compName: 'compName' }] });
    getReasonCodeStub.mockReturnValue({ status: 204, data: [] });
    getSalesDataStub.mockReturnValue(mockSalesData(selectedItems));
  });

  afterEach(() => {
    getDeniedClubsStub.mockReset();
    getRetailsDataStub.mockReset();
    getCompetitiorsDataStub.mockReset();
    getReasonCodeStub.mockReset();
    getSalesDataStub.mockReset();
  });

  test('Table Columns rendering and When All the Flags are not set', async () => {
    const { container } = render(
      <RoleContext.Provider value={roleContentValue}>
        <RetailGrid items={selectedItems} setSelectedRetailData={setRetailDataStub} />
      </RoleContext.Provider>
    );

    await waitFor(console.log, { timeout: 1000 * 10 });

    expect(screen.queryByTestId('retail-grid-table-container')).toBeInTheDocument();
    expect(screen.queryByTestId('no-retail-found-container')).toBeNull();

    // Table Column Value
    expect(container.querySelector('[row-index*="0"] [col-id*="itemNbr"]')).toBeInTheDocument();
    expect(
      container.querySelector('[row-index*="0"] [col-id*="retailAmount"]')
    ).toBeInTheDocument();

    expect(container.querySelector('[row-index*="0"] [col-id*="itemNbr"]')).toHaveTextContent(
      retailDataApiResult.retailInquiryGridInfoList[0].itemNbr
    );
    expect(container.querySelector('[row-index*="0"] [col-id*="retailAmount"]')).toHaveTextContent(
      '$' + retailDataApiResult?.retailInquiryGridInfoList[0]?.currentActiveRetail?.retailAmount
    );

    // API Calls
    expect(getDeniedClubsStub).not.toBeCalled();
    expect(getRetailsDataStub).toBeCalled();
    expect(getRetailsDataStub.mock.calls[0][0]).toEqual(selectedItems);

    expect(getCompetitiorsDataStub).toBeCalled();
    // expect(getReasonCodeStub).toBeCalled();
    expect(getSalesDataStub).not.toBeCalled();

    // props
    expect(setRetailDataStub).toBeCalled();
  });

  test('Table Columns rendering and When All the Flags are set', async () => {
    mockUseHasFeature.mockImplementation((flag) => {
      if (flag === 'US_SALES_DATA') {
        return true;
      }

      if (flag === 'SHOW_MARKDOWN_RULES') {
        return false;
      }

      if (flag === 'COMPETITORS_COLUMN') {
        return true;
      }

      return false;
    });

    const { container } = render(
      <RoleContext.Provider value={roleContentValue}>
        <RetailGrid items={selectedItems} setSelectedRetailData={setRetailDataStub} />
      </RoleContext.Provider>
    );

    await waitFor(console.log, { timeout: 1000 * 10 });

    expect(screen.queryByTestId('retail-grid-table-container')).toBeInTheDocument();
    expect(screen.queryByTestId('no-retail-found-container')).toBeNull();

    // Table Column Value
    expect(container.querySelector('[row-index*="0"] [col-id*="itemNbr"]')).toBeInTheDocument();
    expect(
      container.querySelector('[row-index*="0"] [col-id*="retailAmount"]')
    ).toBeInTheDocument();

    expect(container.querySelector('[row-index*="0"] [col-id*="itemNbr"]')).toHaveTextContent(
      retailDataApiResult.retailInquiryGridInfoList[0].itemNbr
    );
    expect(container.querySelector('[row-index*="0"] [col-id*="retailAmount"]')).toHaveTextContent(
      '$' + retailDataApiResult?.retailInquiryGridInfoList[0]?.currentActiveRetail?.retailAmount
    );

    // API Calls
    expect(getDeniedClubsStub).not.toBeCalled();
    expect(getRetailsDataStub).toBeCalled();
    expect(getRetailsDataStub.mock.calls[0][0]).toEqual(selectedItems);

    expect(getCompetitiorsDataStub).toBeCalled();
    // expect(getReasonCodeStub).toBeCalled();
    expect(getSalesDataStub).toBeCalled();

    // props
    expect(setRetailDataStub).toBeCalled();
  });
});

describe('RenderStatusCell', () => {
  test('Value === CURRENT', () => {
    expect(RenderStatusCell({ value: 'CURRENT' })).toEqual('CURRENT');
  });

  test('Value === FUTURE', () => {
    const expectedOutPut = `<span class=futureStatus>        ${status.FUTURE}      </span>`;

    expect(RenderStatusCell({ value: status.FUTURE }).replace(/(\r\n|\n|\r)/gm, '')).toEqual(
      expectedOutPut
    );
  });

  test('Value === BLOCKED', () => {
    const expectedOutPut = `<span class=blockedStatus>        ${status.BLOCKED}      </span>`;

    expect(RenderStatusCell({ value: status.BLOCKED }).replace(/(\r\n|\n|\r)/gm, '')).toEqual(
      expectedOutPut
    );
  });
});
