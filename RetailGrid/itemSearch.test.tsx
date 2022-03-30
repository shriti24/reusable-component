/* eslint-disable @typescript-eslint/no-var-requires */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { RouterContext } from 'next/dist/next-server/lib/router-context';

import ItemSearch from './ItemSearch';
import RoleContext from '../../../src/pages/RoleContext';
import { createMockRouter } from '../../test-utils/createMockRoute';

const mockExportToExcel = jest.fn();
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store = mockStore({});
let storeData;
let user;
let setValueSpy = jest.fn();
let setSelectedItemsSpy = jest.fn();
let props;
let mockGetUploadTypesData = [{ title: 'upload-type' }];
let router = createMockRouter({});

const getItemsSuggestionsStub = jest
  .spyOn(require('../../services/commonPricingDataService'), 'getItemsSuggestions')
  .mockResolvedValue({ data: [], status: 204 });

const useHasFeatureStub = jest
  .spyOn(require('@utils/useHasFeature'), 'useHasFeature')
  .mockReturnValue(false);

jest.mock('./gridOptions', () => {
  return {
    api: {
      exportDataAsExcel: (val) => {
        mockExportToExcel(val);
      }
    }
  };
});

jest.mock('./util/getUploadTypes', () => {
  return {
    getUploadTypes: () => {
      return mockGetUploadTypesData;
    }
  };
});

describe('itemSearch', () => {
  beforeEach(() => {
    router = createMockRouter({});
    mockGetUploadTypesData = [{ title: 'upload-type' }];
    setValueSpy = jest.fn();
    setSelectedItemsSpy = jest.fn();
    getItemsSuggestionsStub.mockResolvedValue({ data: [], status: 204 });
    useHasFeatureStub.mockReturnValue(false);
    props = {
      inputForm: 'NEW_UPLOAD_HISTORY',
      retailData: [{ id: 1 }],
      setValue: setValueSpy,
      value: undefined,
      setSelectedItems: setSelectedItemsSpy
    };
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
        getSelectedRetail: [
          {
            id: 1,
            loading: true
          }
        ],
        getSearchItemsRetail: [
          {
            id: 1
          }
        ]
      }
    };
    store = mockStore(storeData);
  });
  afterEach(() => {
    setValueSpy.mockReset();
    setSelectedItemsSpy.mockReset();
    getItemsSuggestionsStub.mockReset();
    useHasFeatureStub.mockReset();
  });

  const renderItemSearch = (propsVal, storeVal) => {
    return render(
      <Provider store={storeVal}>
        <RouterContext.Provider value={router}>
          <RoleContext.Provider value={user}>
            <ItemSearch
              inputForm={propsVal.inputForm}
              retailData={propsVal.retailData}
              setValue={propsVal.setValue}
              value={propsVal.value}
              setSelectedItems={propsVal.setSelectedItems}
            />
          </RoleContext.Provider>
        </RouterContext.Provider>
      </Provider>
    );
  };

  it('should render Upload file page if input form is NEW_UPLOAD_HISTORY', () => {
    props.retailData = undefined;
    const { container } = renderItemSearch(props, store);
    expect(container.textContent.includes('Upload file')).toEqual(true);
  });
  it('should render retail page if input form is other than NEW_UPLOAD_HISTORY or UPLOAD_HISTORY', () => {
    props.retailData = undefined;
    props.inputForm = 'RETAIL';
    const { container } = renderItemSearch(props, store);
    expect(container.textContent.includes('Retails')).toEqual(true);
  });
  it('should set selected items on page render', () => {
    props.inputForm = 'RETAIL';
    renderItemSearch(props, store);
    expect(setSelectedItemsSpy).toHaveBeenCalledTimes(1);
  });

  describe('getItemsSuggestions', () => {
    beforeEach(() => {
      props.inputForm = 'RETAIL';
    });
    it('should call item suggestion service on user typing', () => {
      getItemsSuggestionsStub.mockResolvedValue({
        data: { totalResults: 1, typeAheadResults: [{ itemNbr: 1, signingDesc: 'signingDesc' }] },
        status: 200
      });
      renderItemSearch(props, store);
      fireEvent.change(screen.getByTestId('autocomplete-search').querySelector('input'), {
        target: { value: [1] }
      });
      expect(getItemsSuggestionsStub).toHaveBeenCalledTimes(1);
    });
    it('should call item suggestion service on user typing - for service status 200', () => {
      getItemsSuggestionsStub.mockResolvedValue({
        data: { totalResults: 1, typeAheadResults: [{ itemNbr: 1, signingDesc: 'signingDesc' }] },
        status: 200
      });
      storeData = {
        common: {
          getSelectedRetail: [
            {
              id: 12,
              loading: true
            }
          ],
          getSearchItemsRetail: [
            {
              id: 1
            }
          ]
        }
      };
      store = mockStore(storeData);
      props.retailData = [{ id: 1 }, { id: 12 }];
      renderItemSearch(props, store);
      fireEvent.change(screen.getByTestId('autocomplete-search').querySelector('input'), {
        target: { value: [1] }
      });
      expect(getItemsSuggestionsStub).toHaveBeenCalledTimes(1);
    });
    it('should call item suggestion service on user typing - for service status 204', () => {
      getItemsSuggestionsStub.mockResolvedValue({
        data: {},
        status: 204
      });
      props.retailData = [{ id: 1 }, { id: 12 }];
      renderItemSearch(props, store);
      fireEvent.change(screen.getByTestId('autocomplete-search').querySelector('input'), {
        target: { value: [1] }
      });
      expect(getItemsSuggestionsStub).toHaveBeenCalledTimes(1);
    });
    it('should call item suggestion service on user typing - for service status 200, but totalResults is 0', () => {
      getItemsSuggestionsStub.mockResolvedValue({
        data: { totalResults: 0, typeAheadResults: [{ itemNbr: 1, signingDesc: 'signingDesc' }] },
        status: 200
      });
      props.retailData = [{ id: 1 }, { id: 12 }];
      renderItemSearch(props, store);
      fireEvent.change(screen.getByTestId('autocomplete-search').querySelector('input'), {
        target: { value: [1] }
      });
      expect(getItemsSuggestionsStub).toHaveBeenCalledTimes(1);
    });
    it('should call item suggestion service on user typing - for service failure', () => {
      getItemsSuggestionsStub.mockRejectedValue({ message: 'service error', stats: 500 });
      props.retailData = [{ id: 1 }, { id: 12 }];
      props.value = '1,12';
      renderItemSearch(props, store);
      fireEvent.change(screen.getByTestId('autocomplete-search').querySelector('input'), {
        target: { value: [1] }
      });
      expect(getItemsSuggestionsStub).toHaveBeenCalledTimes(1);
    });
    it('should call item suggestion service on user typing - for service failure', () => {
      getItemsSuggestionsStub.mockRejectedValue({ message: '', stats: 500 });
      props.retailData = [{ id: 1 }, { id: 12 }];
      props.value = '1,12';
      renderItemSearch(props, store);
      fireEvent.change(screen.getByTestId('autocomplete-search').querySelector('input'), {
        target: { value: [1] }
      });
      expect(getItemsSuggestionsStub).toHaveBeenCalledTimes(1);
    });
    it('should not call getItemsSuggestions service on user typing if SHOW_RETAIL_MOCKDATA falg is true', async () => {
      useHasFeatureStub.mockResolvedValue(true);
      renderItemSearch(props, store);
      fireEvent.change(screen.getByTestId('autocomplete-search').querySelector('input'), {
        target: { value: [1] }
      });
      await waitFor(
        () => {
          // wait for to trigger setTimeout
        },
        { timeout: 1000 * 10 }
      );
      await waitFor(() => {
        expect(getItemsSuggestionsStub).not.toHaveBeenCalled();
      });
    });
  });
  it('should download excel data on download button click', () => {
    mockGetUploadTypesData = [{ title: 'test' }, { title: '2' }];
    renderItemSearch(props, store);
    fireEvent.click(screen.getByTestId('download-button'));
    fireEvent.click(screen.getByRole('button', { name: 'Upload file' }));
    expect(mockExportToExcel).toHaveBeenCalledWith({
      fileName: 'Retail_Inquiry_Export'
    });
  });
  it('should change action button color on upload file click', async () => {
    renderItemSearch(props, store);
    fireEvent.click(screen.getByRole('button', { name: 'Upload file' }));
  });
  it('should change action button color on upload file click', () => {
    mockGetUploadTypesData = null;
    renderItemSearch(props, store);
    fireEvent.click(screen.getByRole('button', { name: 'Upload file' }));
  });
  it('should navigate to retail history page on upload history button click', () => {
    props.inputForm = 'RETAIL';
    renderItemSearch(props, store);
    fireEvent.click(screen.getByTestId('upload-history-button'));
    expect(router.push).toHaveBeenCalledWith('/retails/upload-history');
  });
});
