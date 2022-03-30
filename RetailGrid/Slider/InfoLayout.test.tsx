import * as React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// Mocks
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: () => 'Retail New Grid' })
}));

jest.mock('../../../components/Can/permission', () => (props) => <div>{props.yes()}</div>);

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

import InfoLayout from './InfoLayout';

describe('InfoClubLayout', () => {
  let props: any = {
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
    getSingleCompRuleStub.mockReturnValue({ data: { ruleList: [props] } });
  });

  afterEach(() => {
    getSingleCompRuleStub.mockReset();
    useRouterPushStub.mockReset();
  });

  test('Initial Render - API is not return data', async () => {
    getSingleCompRuleStub.mockReturnValue({});
    let wrapper;
    act(() => {
      wrapper = render(<InfoLayout {...props} />);
    });

    await waitFor(console.log, { timeout: 1000 * 10 });

    expect(screen.queryByTestId('info-club-layout-container')).toBeNull();

    // Buttons
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.queryByText('View Rule')).toBeNull();

    // InfoItemLayout
    expect(screen.getByTestId('info-item-layout-container')).toBeInTheDocument();
  });

  test('User Click on View Rule Btn', async () => {
    act(() => {
      render(<InfoLayout {...props} />);
    });

    await waitFor(console.log, { timeout: 1000 * 10 });

    fireEvent.click(screen.getByText('View Rule'));

    expect(useRouterPushStub).toBeCalled();
    expect(useRouterPushStub.mock.calls[0][0]).toBe(
      `/comp-rules/rule-details?ruleid=${props.ruleId}`
    );
  });
});
