import { render, screen } from '@testing-library/react';
import { AgGridColumn } from 'ag-grid-react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import RoleContext from '../../../src/pages/RoleContext';
import { Table } from './table';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store = mockStore({});
let storeData;
let user;
let props;
let onGridReadySpy = jest.fn();

describe('Table component', () => {
  beforeEach(() => {
    onGridReadySpy = jest.fn();
    props = {
      tableData: [],
      onGridReady: jest.fn(),
      groupState: true,
      getColumnWidthChangeIds: jest.fn(),
      removeColumnIdOnUiColumnDrag: jest.fn(),
      gridApi: {},
      gridColumnApi: {},
      selectedItems: []
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
      selectedView: {
        getSelectedView: [],
        gridItemLength: 0
      }
    };
    store = mockStore(storeData);
  });
  afterEach(() => {
    onGridReadySpy.mockReset();
  });
  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <Table {...props}>
            <AgGridColumn />
          </Table>
        </RoleContext.Provider>
      </Provider>
    );
    expect(container.textContent).not.toEqual('');
  });
});
