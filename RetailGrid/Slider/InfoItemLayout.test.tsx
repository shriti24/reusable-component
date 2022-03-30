import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mocks
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: () => 'Retail New Grid' })
}));

const getCountryCodeStub = jest.spyOn(require('../../../services/getConfig'), 'getCountryCode');
getCountryCodeStub.mockReturnValue('US');

import InfoItemLayout from './InfoItemLayout';

describe('InfoClubLayout', () => {
  let props: any = {
    itemNbr: 'itemNbr',
    itemDesc: 'itemDesc',
    status: 'status',
    clubNbr: 'clubNbr',
    currentActiveRetailPrice: 'currentActiveRetailPrice'
  };

  test('Initial Render', () => {
    render(<InfoItemLayout {...props} />);
    expect(screen.getByTestId('info-item-layout-itemNbr')).toBeInTheDocument();
    expect(screen.getByTestId('info-item-layout-itemNbr')).toHaveTextContent(props.itemNbr);

    expect(screen.getByTestId('info-item-layout-itemDesc')).toBeInTheDocument();
    expect(screen.getByTestId('info-item-layout-itemDesc')).toHaveTextContent(props.itemDesc);

    expect(screen.getByTestId('info-item-layout-status')).toBeInTheDocument();
    expect(screen.getByTestId('info-item-layout-status')).toHaveTextContent(props.status);

    expect(screen.getByTestId('info-item-layout-clubNbr')).toBeInTheDocument();
    expect(screen.getByTestId('info-item-layout-clubNbr')).toHaveTextContent(props.clubNbr);

    expect(screen.getByTestId('info-item-layout-currentActiveRetailPrice')).toBeInTheDocument();
    expect(screen.getByTestId('info-item-layout-currentActiveRetailPrice')).toHaveTextContent(
      props.currentActiveRetailPrice
    );
  });
});
