import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import CustomViewPanel from './customViewsPanel';
import RoleContext from '../../../../src/pages/RoleContext';

let mockAddAlert = jest.fn();
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store = mockStore({});
let storeData;
let gridOption;
let user;
// eslint-disable-next-line no-var

jest.mock('@utils/useToastFeature', () => () => ({ addAlert: mockAddAlert }));

const commonActionsSpy = jest
  .spyOn(require('../../../services/UserViews/userViews_service'), 'commonActions')
  .mockResolvedValue({ data: [], status: 204 });

const getAllUserViewsSpy = jest
  .spyOn(require('../../../services/UserViews/userViews_service'), 'getAllUserViews')
  .mockResolvedValue({ data: [], status: 204 });

const makeItDefaultSpy = jest
  .spyOn(require('../../../services/UserViews/userViews_service'), 'makeItDefault')
  .mockResolvedValue({ data: [], status: 204 });

const whenStable = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

describe('Custom ViewPanel', () => {
  beforeEach(() => {
    mockAddAlert = jest.fn();
    commonActionsSpy.mockResolvedValue({ data: [], status: 204 });
    getAllUserViewsSpy.mockResolvedValue({ data: [], status: 204 });
    makeItDefaultSpy.mockResolvedValue({ data: [], status: 204 });
    user = {
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
        '/new-retail': {
          allowedActions: ['View']
        }
      },
      userCategoryNumber: [],
      userGroup: { name: 'GMM', description: 'US' }
    };
    storeData = {
      common: {
        navigationPath: '',
        getSelectedRetail: [
          {
            id: 100,
            details: "SAM'S MEMBERSHIP",
            label: "100 - Sam's membership"
          }
        ],
        getColumnRetailData: [],
        getSelectedRetailData: {},
        getSortedRetailData: {},
        getSearchItemsRetail: [
          {
            id: 100,
            details: "SAM'S MEMBERSHIP",
            label: "100 - Sam's membership"
          },
          {
            id: 1004,
            details: 'DURKEE',
            label: '1004 - Durkee'
          },
          {
            id: 1005,
            details: 'XCEL FENCE INC',
            label: '1005 - Xcel fence inc'
          },
          {
            id: 1006,
            details: 'ALRS',
            label: '1006 - Alrs'
          },
          {
            id: 1007,
            details: 'ALRS',
            label: '1007 - Alrs'
          }
        ]
      },
      selectedView: {
        getSelectedView: {},
        getAllViews: [
          {
            id: 'RETAIL_ENQUIRY',
            name: 'View1',
            active: true,
            shareable: false,
            detail: {
              filterState: {},
              colState: [
                {
                  hide: false,
                  pinned: 'right',
                  rowGroupIndex: null,
                  sortIndex: null,
                  flex: null,
                  width: 56,
                  aggFunc: null,
                  pivot: false,
                  sort: null,
                  pivotIndex: null,
                  colId: 'kabab',
                  rowGroup: false
                },
                {
                  hide: false,
                  pinned: null,
                  rowGroupIndex: null,
                  sortIndex: null,
                  flex: null,
                  width: 130,
                  aggFunc: null,
                  pivot: false,
                  sort: null,
                  pivotIndex: null,
                  colId: 'itemNbr',
                  rowGroup: false
                }
              ]
            }
          }
        ],
        isViewOrderChange: true,
        navAlert: false,
        viewsApiError: false,
        gridLoaded: false,
        gridUpdated: false,
        gridItemLength: false,
        competitorsRetails: false
      }
    };
    store = mockStore(storeData);
    gridOption = {
      columnApi: {
        autoSizeColumns: jest.fn(),
        autoSizeAllColumns: jest.fn(),
        getColumnState: jest.fn(),
        setColumnState: jest.fn()
      },
      api: {
        getFilterModel: jest.fn(),
        getDisplayedRowCount: jest.fn(),
        setFilterModel: jest.fn()
      }
    };
  });

  afterEach(() => {
    getAllUserViewsSpy.mockReset();
    commonActionsSpy.mockReset();
    mockAddAlert.mockReset();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    const { container } = render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    expect(container.textContent.includes('View1')).toEqual(true);
  });
  it('should call add new commonActions on add icon click', () => {
    act(() => {
      render(
        <Provider store={store}>
          <RoleContext.Provider value={user}>
            <CustomViewPanel {...{ gridOptions: gridOption }} />
          </RoleContext.Provider>
        </Provider>
      );
    });
    fireEvent.click(screen.getByTestId('icon'));
    whenStable();
    expect(commonActionsSpy).toHaveBeenCalledWith({
      id: 'RETAIL_ENQUIRY',
      name: 'View 1',
      shareable: false
    });
  });
  it('should add a new view on Add view click commonActions service success', async () => {
    commonActionsSpy.mockResolvedValue({ data: [], status: 201 });
    act(() => {
      render(
        <Provider store={store}>
          <RoleContext.Provider value={user}>
            <CustomViewPanel {...{ gridOptions: gridOption }} />
          </RoleContext.Provider>
        </Provider>
      );
    });
    fireEvent.click(screen.getByTestId('icon'));
    whenStable();
    await waitFor(() =>
      expect(mockAddAlert).toHaveBeenCalledWith('View 1 created succesfully', 'success')
    );
  });
  it('should show service returned error on Add click common action service failure', async () => {
    commonActionsSpy.mockRejectedValue({
      response: { data: { errorMessages: [{ message: 'service error' }] } }
    });
    act(() => {
      render(
        <Provider store={store}>
          <RoleContext.Provider value={user}>
            <CustomViewPanel {...{ gridOptions: gridOption }} />
          </RoleContext.Provider>
        </Provider>
      );
    });
    fireEvent.click(screen.getByTestId('icon'));
    whenStable();
    await waitFor(() => expect(mockAddAlert).toHaveBeenCalledWith('service error', 'error'));
  });
  it('should show default error if common action service failure return is empty', async () => {
    commonActionsSpy.mockRejectedValue({
      response: { data: {} }
    });
    act(() => {
      render(
        <Provider store={store}>
          <RoleContext.Provider value={user}>
            <CustomViewPanel {...{ gridOptions: gridOption }} />
          </RoleContext.Provider>
        </Provider>
      );
    });
    fireEvent.click(screen.getByTestId('icon'));
    whenStable();
    await waitFor(() =>
      expect(mockAddAlert).toHaveBeenCalledWith(
        'Unexpected Error occurred while processing your request',
        'error'
      )
    );
  });
  it('should add a new view on Add view click commonActions service success', async () => {
    commonActionsSpy.mockResolvedValue({ data: [], status: 201 });
    getAllUserViewsSpy.mockResolvedValue({
      status: 200,
      preferenceDetails: [
        {
          id: 'RETAIL_ENQUIRY',
          name: 'View1',
          active: true,
          shareable: false,
          detail: {
            filterState: {},
            colState: [
              {
                hide: false,
                pinned: 'right',
                rowGroupIndex: null,
                sortIndex: null,
                flex: null,
                width: 56,
                aggFunc: null,
                pivot: false,
                sort: null,
                pivotIndex: null,
                colId: 'kabab',
                rowGroup: false
              },
              {
                hide: false,
                pinned: null,
                rowGroupIndex: null,
                sortIndex: null,
                flex: null,
                width: 130,
                aggFunc: null,
                pivot: false,
                sort: null,
                pivotIndex: null,
                colId: 'itemNbr',
                rowGroup: false
              }
            ]
          }
        }
      ]
    });
    act(() => {
      render(
        <Provider store={store}>
          <RoleContext.Provider value={user}>
            <CustomViewPanel {...{ gridOptions: gridOption }} />
          </RoleContext.Provider>
        </Provider>
      );
    });
    fireEvent.click(screen.getByTestId('icon'));
    whenStable();
    await waitFor(() => expect(getAllUserViewsSpy).toHaveBeenCalledWith('/RETAIL_ENQUIRY'));
  });
  it('should save on save button click without updating view', async () => {
    commonActionsSpy.mockResolvedValue({ data: [], status: 201 });
    render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    await waitFor(() => screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(commonActionsSpy).toHaveBeenCalledTimes(1);
    whenStable();
    await waitFor(() =>
      expect(mockAddAlert).toHaveBeenCalledWith('View1 updated succesfully', 'success')
    );
  });
  it('should not save on save button click if service return other than 201 status', async () => {
    commonActionsSpy.mockResolvedValue({ data: [], status: 400 });
    render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    await waitFor(() => screen.getByRole('button', { name: 'Save' }));
    mockAddAlert.mockReset();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(commonActionsSpy).toHaveBeenCalledTimes(1);
    whenStable();
    await waitFor(() =>
      expect(mockAddAlert).not.toHaveBeenCalledWith('View1 updated succesfully', 'success')
    );
  });
  it('should show service return error on save button click if service failed', async () => {
    commonActionsSpy.mockRejectedValue({
      response: { data: { errorMessages: [{ message: 'service error' }] } }
    });
    render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    await waitFor(() => screen.getByRole('button', { name: 'Save' }));
    mockAddAlert.mockReset();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(commonActionsSpy).toHaveBeenCalledTimes(1);
    whenStable();
    await waitFor(() => expect(mockAddAlert).toHaveBeenCalledWith('service error', 'error'));
  });
  it('should show default error on save button click if service failed and return is empty', async () => {
    commonActionsSpy.mockRejectedValue({
      response: { data: {} }
    });
    render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    await waitFor(() => screen.getByRole('button', { name: 'Save' }));
    mockAddAlert.mockReset();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(commonActionsSpy).toHaveBeenCalledTimes(1);
    whenStable();
    await waitFor(() =>
      expect(mockAddAlert).toHaveBeenCalledWith(
        'Unexpected Error occurred while processing your request',
        'error'
      )
    );
  });
  it('should not show custom view panel if user dont have access', () => {
    user.permissions = {};
    const { container } = render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    // eslint-disable-next-line quotes
    expect(container.textContent.includes("Sorry, you don't have access to this info")).toEqual(
      true
    );
  });
  it('should call get user view service if getAllViews id is not equal to RETAIL_ENQUIRY', () => {
    storeData.selectedView.getAllViews[0].id = 'TEST';
    store = mockStore(storeData);
    const { container } = render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    expect(getAllUserViewsSpy).toHaveBeenCalled();
  });
  it('should not call get user view service if get all views is empty', () => {
    storeData.selectedView.getAllViews = [];
    store = mockStore(storeData);
    const { container } = render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    expect(getAllUserViewsSpy).not.toHaveBeenCalled();
  });
  it('should set grid api and column api when grid is loaded', () => {
    storeData.selectedView = { ...storeData.selectedView, gridLoaded: false };
    store = mockStore(storeData);
    const { container, rerender } = render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    storeData.selectedView = { ...storeData.selectedView, gridLoaded: true };
    store = mockStore(storeData);
    rerender(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    expect(gridOption.api.setFilterModel).toHaveBeenCalled();
    expect(gridOption.columnApi.setColumnState).toHaveBeenCalled();
    expect(getAllUserViewsSpy).not.toHaveBeenCalled();
  });
  it('should call make it default service call on favorite icon click', () => {
    const getAllViews = [...storeData.selectedView.getAllViews];
    getAllViews[0].active = false;
    storeData.selectedView = { ...storeData.selectedView, getAllViews: getAllViews };
    store = mockStore(storeData);
    render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    fireEvent.click(screen.getByTestId('favorite-icon'));
    expect(makeItDefaultSpy).toHaveBeenCalledTimes(1);
  });
  it('should show success message on make it default service success', async () => {
    makeItDefaultSpy.mockResolvedValue({ data: [], status: 200 });
    const getAllViews = [...storeData.selectedView.getAllViews];
    getAllViews[0].active = false;
    storeData.selectedView = { ...storeData.selectedView, getAllViews: getAllViews };
    store = mockStore(storeData);
    render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    fireEvent.click(screen.getByTestId('favorite-icon'));
    expect(makeItDefaultSpy).toHaveBeenCalledTimes(1);
    whenStable();
    await waitFor(() =>
      expect(mockAddAlert).toHaveBeenCalledWith('View1 Updated as default succesfully', 'success')
    );
  });
  it('should show default error message on make it default service failure return empty error', async () => {
    makeItDefaultSpy.mockRejectedValue({ data: { response: {} }, status: 500 });
    const getAllViews = [...storeData.selectedView.getAllViews];
    getAllViews[0].active = false;
    storeData.selectedView = { ...storeData.selectedView, getAllViews: getAllViews };
    store = mockStore(storeData);
    render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    fireEvent.click(screen.getByTestId('favorite-icon'));
    expect(makeItDefaultSpy).toHaveBeenCalledTimes(1);
    whenStable();
    await waitFor(() =>
      expect(mockAddAlert).toHaveBeenCalledWith(
        'Unexpected Error occurred while processing your request',
        'error'
      )
    );
  });
  it('should show service error message on make it default service failure return error', async () => {
    makeItDefaultSpy.mockRejectedValue({
      response: { data: { errorMessages: [{ message: 'test error' }] } },
      status: 500
    });
    const getAllViews = [...storeData.selectedView.getAllViews];
    getAllViews[0].active = false;
    storeData.selectedView = { ...storeData.selectedView, getAllViews: getAllViews };
    store = mockStore(storeData);
    render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <CustomViewPanel {...{ gridOptions: gridOption }} />
        </RoleContext.Provider>
      </Provider>
    );
    fireEvent.click(screen.getByTestId('favorite-icon'));
    expect(makeItDefaultSpy).toHaveBeenCalledTimes(1);
    whenStable();
    await waitFor(() => expect(mockAddAlert).toHaveBeenCalledWith('test error', 'error'));
  });
});
