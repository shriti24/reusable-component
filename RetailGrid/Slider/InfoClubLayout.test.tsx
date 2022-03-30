import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mocks
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: () => 'Retail New Grid' })
}));

const getCountryCodeStub = jest.spyOn(require('../../../services/getConfig'), 'getCountryCode');
getCountryCodeStub.mockReturnValue('US');

import InfoClubLayout, { getRetailAfterRule } from './InfoClubLayout';

describe('InfoClubLayout', () => {
  let props = {
    competitor: 'competitor',
    spread: '12',
    floor: '2',
    createdBy: 'test010',
    ruleId: '1',
    retailAmount: '12',
    customerRetailAmt: '13'
  };
  test('Initial Render', () => {
    render(<InfoClubLayout {...props} />);

    expect(screen.getByTestId('info-club-header')).toBeInTheDocument();
    expect(screen.getByTestId('info-club-header')).toHaveTextContent('Club competitor rule');

    expect(screen.getByTestId('info-club-competitor-text')).toBeInTheDocument();
    expect(screen.getByTestId('info-club-competitor-text')).toHaveTextContent('competitor');

    expect(screen.getByTestId('info-club-description-text')).toBeInTheDocument();
    expect(screen.getByTestId('info-club-description-text')).toHaveTextContent(
      `Gap 12% | Floor 2%`
    );

    expect(screen.getByTestId('info-club-amount-text')).toBeInTheDocument();
    expect(screen.getByTestId('info-club-amount-text')).toHaveTextContent('$12');

    expect(screen.getByTestId('info-club-created-by-text')).toBeInTheDocument();
    expect(screen.getByTestId('info-club-created-by-text')).toHaveTextContent('test010');
  });
});

describe('getRetailAfterRule', () => {
  let props = {
    competitor: 'competitor',
    spread: '12',
    floor: '2',
    createdBy: 'test010',
    ruleId: '1',
    retailAmount: '12',
    customerRetailAmt: '13'
  };

  test('Country === US', () => {
    expect(getRetailAfterRule(props)).toEqual(props.retailAmount);
  });

  test('Country === US', () => {
    getCountryCodeStub.mockReturnValue('MX');
    expect(getRetailAfterRule(props)).toEqual(props.customerRetailAmt);
  });
});
