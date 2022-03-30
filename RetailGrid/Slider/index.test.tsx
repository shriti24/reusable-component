import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { GridContextAPI } from '../contextAPI';

// Mocks
jest
  .spyOn(require('./DrawerLayouts'), 'renderHeader')
  .mockReturnValue(<div data-testid="render-header" />);
jest
  .spyOn(require('./DrawerLayouts'), 'renderLayout')
  .mockReturnValue(<div data-testid="render-layout" />);

// Component
import Slider from './index';

describe('Slider', () => {
  let gridContext, clearTypeStub, setRefreshStub;

  beforeEach(() => {
    clearTypeStub = jest.fn();
    setRefreshStub = jest.fn();
  });

  test('Inital Render', () => {
    gridContext = {
      selectedType: '',
      data: {},
      clearType: clearTypeStub,
      setRefresh: setRefreshStub
    };

    const { container } = render(
      <GridContextAPI.Provider value={gridContext}>
        <Slider type="add" />
      </GridContextAPI.Provider>
    );

    expect(container.querySelector('#sams-slider')).toBeInTheDocument();
    expect(screen.getByTestId('render-header')).toBeInTheDocument();
    expect(screen.getByTestId('render-layout')).toBeInTheDocument();
    expect(screen.getByTestId('close-btn')).toBeInTheDocument();
  });

  test('User Click on Close Button and Selected Type is empty', () => {
    gridContext = {
      selectedType: '',
      data: {},
      clearType: clearTypeStub,
      setRefresh: setRefreshStub
    };
    const { container } = render(
      <GridContextAPI.Provider value={gridContext}>
        <Slider type="add" />
      </GridContextAPI.Provider>
    );

    fireEvent.click(screen.getByTestId('close-btn'));

    expect(clearTypeStub).not.toBeCalled();
    expect(setRefreshStub).not.toBeCalled();
  });

  test('User Click on Close Button and Selected Type is ADD', () => {
    gridContext = {
      selectedType: 'ADD',
      data: {},
      clearType: clearTypeStub,
      setRefresh: setRefreshStub
    };
    const { container } = render(
      <GridContextAPI.Provider value={gridContext}>
        <Slider type="add" />
      </GridContextAPI.Provider>
    );

    fireEvent.click(screen.getByTestId('close-btn'));

    expect(clearTypeStub).toBeCalled();
    expect(setRefreshStub).toBeCalled();
  });
});
