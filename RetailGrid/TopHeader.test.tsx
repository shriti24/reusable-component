import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TopHeader from './TopHeader';

const handleSalesDataChange = jest.fn();
const coordinateMapMock = { data: [[177.111083984375, 520]] };

describe('<TopHeader />', () => {
  test('Should render without errors', () => {
    render(
      <TopHeader handleSalesDataChange={handleSalesDataChange} coordinateMap={coordinateMapMock} />
    );
    expect(screen.getByTestId('top-header-0')).toBeInTheDocument();
  });
  test('Should open header drop down and change value', () => {
    render(
      <TopHeader handleSalesDataChange={handleSalesDataChange} coordinateMap={coordinateMapMock} />
    );
    const topHeader = screen.getByTestId('top-header-0');
    fireEvent.mouseDown(topHeader);
    expect(screen.getByTestId('header-dropdown-select-input')).toBeInTheDocument();
    waitFor(() => {
      const topHeaderContainer = screen.getByTestId('header-dropdown-item-1 Week');
      fireEvent.click(topHeaderContainer);
    });
    expect(handleSalesDataChange).toHaveBeenCalledTimes(1);
    expect(handleSalesDataChange).toHaveBeenCalledWith('1 Week');
  });
});
