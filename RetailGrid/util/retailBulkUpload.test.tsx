import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RetailBulkUpload } from './retailBulkUpload';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import RoleContext from '../../../pages/RoleContext';
import { shallow, mount, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

jest.spyOn(require('../../../components/Can/permission'), 'hasPermission').mockReturnValue(true);

describe('Retail Bulk Upload Component', () => {
  const initialState = { errorMsg: '', receiveAllClubs: { clubNumbersList: [4989, 5678] } };
  const mockStore = configureStore([thunk]);
  const store = mockStore(initialState);
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
  const bulk_upload_types = [
    {
      title: 'retails',
      value: 'Bulk retail upload'
    },
    {
      title: 'locks',
      value: 'Bulk lock upload'
    }
  ];
  test('Renders Retail Bulk Upload', () => {
    const testpop = jest.fn();

    render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <RetailBulkUpload
            handlePopover={jest.fn()}
            uploadTypes={bulk_upload_types}
            popList={true}
            setPopList={testpop}
            inputForm={'RETAIL'}
            handleHistoryNavigation={jest.fn()}
            handleUploadOpen={jest.fn()}
          />
        </RoleContext.Provider>
      </Provider>
    );

    const btn = screen.getByLabelText('Upload');
    fireEvent.click(btn);
    expect(screen.getByLabelText('Upload')).toBeInTheDocument();
  });
  test('Renders Retail Bulk Upload', () => {
    const testpop = jest.fn();

    render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <RetailBulkUpload
            handlePopover={jest.fn()}
            uploadTypes={bulk_upload_types}
            popList={true}
            setPopList={testpop}
            inputForm={'RETAIL'}
            handleHistoryNavigation={jest.fn()}
            handleUploadOpen={jest.fn()}
          />
        </RoleContext.Provider>
      </Provider>
    );
    const btn = screen.getByLabelText('Upload');
    fireEvent.mouseEnter(btn);
    expect(screen.getByLabelText('Upload')).toBeInTheDocument();
  });
  test('Renders Retail Bulk Upload', () => {
    const testpop = jest.fn();

    render(
      <Provider store={store}>
        <RoleContext.Provider value={user}>
          <RetailBulkUpload
            handlePopover={jest.fn()}
            uploadTypes={bulk_upload_types}
            popList={true}
            setPopList={testpop}
            inputForm={'RETAIL'}
            handleHistoryNavigation={jest.fn()}
            handleUploadOpen={jest.fn()}
          />
        </RoleContext.Provider>
      </Provider>
    );
    const btn = screen.getByLabelText('Upload');
    fireEvent.mouseLeave(btn);
    expect(screen.getByLabelText('Upload')).toBeInTheDocument();
  });
});
