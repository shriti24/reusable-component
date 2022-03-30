import * as React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

import ShowAction from './ShowAction';
import RoleContext from '../../../pages/RoleContext';

describe('Show Action', () => {
  let onActionSelectStub;
  const user = {
    user: { userID: 'T0E0S1T', username: 'Development Test User' },
    role: {
      adminRole: true,
      consumerRole: false,
      description: 'US',
      name: 'Admin',
      realmId: 'WINGMAN TEST DEVELOPMENT ROLE'
    },
    group: [],
    userGroup: { name: 'GMM-US', description: 'US' }
  };

  beforeEach(() => {
    onActionSelectStub = jest.fn();
  });

  afterEach(() => {
    onActionSelectStub.mockReset();
  });

  test('Status is Current and Retail Type = BP and CheckCurrent is True', () => {
    render(
      <RoleContext.Provider value={user}>
        <ShowAction
          checkCurrent
          onActionSelect={onActionSelectStub}
          retail={{ retailType: 'BP' }}
          status="Current"
        />
      </RoleContext.Provider>
    );

    expect(screen.getByTestId('lock')).toBeInTheDocument();
    expect(screen.getByTestId('add')).toBeInTheDocument();
  });

  test('Status is Current and Retail Type = BP and CheckCurrent is false', () => {
    render(
      <RoleContext.Provider value={user}>
        <ShowAction
          checkCurrent={false}
          onActionSelect={onActionSelectStub}
          retail={{ retailType: 'BP' }}
          status="Current"
        />
      </RoleContext.Provider>
    );

    expect(screen.queryByTestId('lock')).toBeNull();
    expect(screen.getByTestId('add')).toBeInTheDocument();
  });

  test('Status is Current and Retail Type = CI and CheckCurrent is false', () => {
    render(
      <RoleContext.Provider value={user}>
        <ShowAction
          checkCurrent={false}
          onActionSelect={onActionSelectStub}
          retail={{ retailType: 'CI' }}
          status="Current"
        />
      </RoleContext.Provider>
    );

    expect(screen.queryByTestId('lock')).toBeNull();
    expect(screen.getByTestId('add')).toBeInTheDocument();
    expect(screen.getByTestId('delete')).toBeInTheDocument();
    expect(screen.getByTestId('info')).toBeInTheDocument();
  });

  test('Status is Current and Retail Type = CI and CheckCurrent is false', () => {
    render(
      <RoleContext.Provider value={user}>
        <ShowAction
          checkCurrent={false}
          onActionSelect={onActionSelectStub}
          retail={{ retailType: 'MD' }}
          status="Current"
        />
      </RoleContext.Provider>
    );

    expect(screen.queryByTestId('lock')).toBeNull();
    expect(screen.getByTestId('add')).toBeInTheDocument();
    expect(screen.getByTestId('delete')).toBeInTheDocument();
    expect(screen.getByTestId('edit')).toBeInTheDocument();
  });

  test('Status is Current and Retail Type = CI and CheckCurrent is false And User Click on Add Button', () => {
    render(
      <RoleContext.Provider value={user}>
        <ShowAction
          checkCurrent={false}
          onActionSelect={onActionSelectStub}
          retail={{ retailType: 'MD' }}
          status="Current"
        />
      </RoleContext.Provider>
    );

    expect(screen.queryByTestId('lock')).toBeNull();
    expect(screen.getByTestId('add')).toBeInTheDocument();
    expect(screen.getByTestId('delete')).toBeInTheDocument();
    expect(screen.getByTestId('edit')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('add'));

    expect(onActionSelectStub).toBeCalled();
    expect(onActionSelectStub.mock.calls[0][0]).toEqual('add');
  });
});
