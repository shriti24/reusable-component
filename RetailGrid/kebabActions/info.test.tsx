import * as React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// Mocks
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: () => 'Retail New Grid' })
}));

jest.mock('../../../components/Can', () => (props) => <div>{props.yes()}</div>);

const getCountryCodeStub = jest.spyOn(require('../../../services/getConfig'), 'getCountryCode');
getCountryCodeStub.mockReturnValue('US');

const getSingleCompRuleStub = jest.spyOn(
  require('../../../services/compRuleService'),
  'getSingleCompRule'
);
getSingleCompRuleStub.mockReturnValue({});

const useRouterPushStub = jest.fn();
jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => ({
  pathname: '/retail-search',
  push: useRouterPushStub
}));

import Info from './info';

describe('Info', () => {
  let createRetailStub, props, handleAlertOpenStub, onCloseStub, toggleFilterTypeStub;

  let data: any = {
    itemNbr: 'itemNbr',
    itemDesc: 'itemDesc',
    status: 'status',
    clubNbr: 'clubNbr',
    currentActiveRetailPrice: 'currentActiveRetailPrice',
    competitor: 'competitor',
    spread: '12',
    floor: '2',
    createdBy: 'test010',
    ruleId: '1',
    retailAmount: '12',
    customerRetailAmt: '13'
  };

  beforeEach(() => {
    createRetailStub = jest.fn();
    handleAlertOpenStub = jest.fn();
    onCloseStub = jest.fn();
    toggleFilterTypeStub = jest.fn();

    props = {
      isDrawerOpen: false,
      data,
      createRetail: createRetailStub,
      itemDescription: 'itemDescription',
      handleAlertOpen: handleAlertOpenStub,
      onClose: onCloseStub,
      toggleFilterType: toggleFilterTypeStub
    };

    getSingleCompRuleStub.mockReturnValue({ data: { ruleList: [props] } });
  });

  afterEach(() => {
    handleAlertOpenStub.mockReset();
    onCloseStub.mockReset();
    toggleFilterTypeStub.mockReset();
    getSingleCompRuleStub.mockReset();
    createRetailStub.mockReset();
    useRouterPushStub.mockReset();
  });

  test('Initial Render - API is not return data', async () => {
    getSingleCompRuleStub.mockReturnValue({});
    let wrapper;
    act(() => {
      wrapper = render(<Info {...props} />);
    });

    await waitFor(console.log, { timeout: 1000 * 10 });

    expect(screen.queryByTestId('club-competitor-rule-container')).toBeNull();

    // Buttons
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.queryByText('View Rule')).toBeNull();
  });

  test('User Click on View Rule Btn', async () => {
    act(() => {
      render(<Info {...props} />);
    });

    await waitFor(console.log, { timeout: 1000 * 10 });

    fireEvent.click(screen.getByText('View Rule'));

    expect(useRouterPushStub).toBeCalled();
    expect(useRouterPushStub.mock.calls[0][0]).toBe(
      `/comp-rules/rule-details?ruleid=${props.ruleId}`
    );

    expect(toggleFilterTypeStub).toBeCalled();
    expect(toggleFilterTypeStub.mock.calls[0][0]).toBe(1);
  });

  test('User Click on Cancel Btn', async () => {
    act(() => {
      render(<Info {...props} />);
    });

    await waitFor(console.log, { timeout: 1000 * 10 });

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCloseStub).toBeCalled();
  });
});
