import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import HeaderDropdown from './HeaderDropdown';

describe('HeaderDropdown', () => {
  let onChangeStub, options;

  beforeEach(() => {
    onChangeStub = jest.fn();
    options = [{ label: 'title', value: 'value' }];
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('initial render', () => {
    render(
      <HeaderDropdown
        name="HeaderDropdown"
        value={null}
        onChange={onChangeStub}
        options={options}
        open={false}
      />
    );

    expect(screen.getByTestId('header-dropdown-select-container')).toBeInTheDocument();
    expect(screen.queryByTestId('header-dropdown-item-value')).toBeNull();
  });

  test('Value - props is passed', () => {
    render(
      <HeaderDropdown
        name="HeaderDropdown"
        value={options[0].label}
        onChange={onChangeStub}
        options={options}
        open={false}
      />
    );
    expect(screen.getByTestId('header-dropdown-select-container')).toBeInTheDocument();
    expect(screen.getByTestId('header-dropdown-select-input')).toBeInTheDocument();
    expect(screen.getByTestId('header-dropdown-select-input')).toHaveValue(options[0].label);

    expect(screen.queryByTestId('header-dropdown-item-value')).toBeNull();
  });

  test('Open - Props is true', () => {
    render(
      <HeaderDropdown
        name="HeaderDropdown"
        value={options[0].value}
        onChange={onChangeStub}
        options={options}
        open={true}
      />
    );
    expect(screen.getByTestId('header-dropdown-select-container')).toBeInTheDocument();
    expect(screen.getByTestId('header-dropdown-select-input')).toBeInTheDocument();
    expect(screen.getByTestId('header-dropdown-select-input')).toHaveValue(options[0].value);

    expect(screen.getByTestId('header-dropdown-item-value')).toBeInTheDocument();
  });

  test('User Click on options', () => {
    render(
      <HeaderDropdown
        name="HeaderDropdown"
        value={options[0].label}
        onChange={onChangeStub}
        options={options}
        open={true}
      />
    );

    expect(screen.getByTestId('header-dropdown-select-container')).toBeInTheDocument();
    expect(screen.getByTestId('header-dropdown-select-input')).toBeInTheDocument();
    expect(screen.getByTestId('header-dropdown-select-input')).toHaveValue(options[0].label);

    expect(screen.getByTestId('header-dropdown-item-value')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('header-dropdown-item-value'));

    expect(onChangeStub).toBeCalled();
  });
  test('Value - props is passed as Select', () => {
    render(
      <HeaderDropdown
        name="HeaderDropdown"
        value={'Select'}
        onChange={onChangeStub}
        options={[{ label: 'Please select', value: 'Select' }]}
        open={true}
      />
    );
    expect(screen.getByTestId('header-dropdown-select-container')).toBeInTheDocument();
    expect(screen.getByTestId('header-dropdown-select-input')).toBeInTheDocument();
    expect(screen.getByTestId('header-dropdown-select-input')).toHaveValue('Select');
    expect(screen.getByTestId('header-dropdown-item-Select')).toBeInTheDocument();
  });
});
