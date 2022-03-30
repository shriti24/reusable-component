import * as React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';

import LockFilter, { SearchInput, FilterDatum } from './lockFilter';

describe('Search Input', () => {
  let onSearchStub, handleClickStub;

  beforeEach(() => {
    onSearchStub = jest.fn();
    handleClickStub = jest.fn();
  });

  afterEach(() => {
    onSearchStub.mockReset();
    handleClickStub.mockReset();
  });

  test('Filter Data is empty', () => {
    const { container } = render(
      <SearchInput onSearch={onSearchStub} handleClick={handleClickStub} filteredData={[]}>
        <div data-testid="children" />
      </SearchInput>
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.queryByTestId('children')).toBeNull();
    expect(screen.getByText('No matches.')).toBeInTheDocument();
    expect(container.querySelector('.clearBtn')).toBeInTheDocument();
  });

  test('Filter Data is not empty', () => {
    const { container } = render(
      <SearchInput onSearch={onSearchStub} handleClick={handleClickStub} filteredData={[1, 2, 3]}>
        <div data-testid="children" />
      </SearchInput>
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.queryByTestId('children')).toBeInTheDocument();
    expect(screen.queryByText('No matches.')).toBeNull();
    expect(container.querySelector('.clearBtn')).toBeInTheDocument();
  });

  test('User Click on Clear Btn', () => {
    const { container } = render(
      <SearchInput onSearch={onSearchStub} handleClick={handleClickStub} filteredData={[1, 2, 3]}>
        <div data-testid="children" />
      </SearchInput>
    );

    act(() => {
      fireEvent.click(container.querySelector('.clearBtn'));
    });

    expect(handleClickStub).toBeCalled();
  });

  test('User search on input', () => {
    const { container } = render(
      <SearchInput onSearch={onSearchStub} handleClick={handleClickStub} filteredData={[1, 2, 3]}>
        <div data-testid="children" />
      </SearchInput>
    );

    act(() => {
      fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Hi' } });
    });

    expect(onSearchStub).toBeCalled();
    expect(onSearchStub.mock.calls[0][0]).toBe('Hi');
  });
});

describe('FilterDatum', () => {
  let handleFilterDataStub;

  beforeEach(() => {
    handleFilterDataStub = jest.fn();
  });

  afterEach(() => {
    handleFilterDataStub.mockReset();
  });

  test('Value === Locked and selected === false', () => {
    render(
      <FilterDatum
        data={{ value: 'Locked', selected: false }}
        allCheck={0}
        handleFilterData={handleFilterDataStub}
      />
    );

    expect(screen.queryByTestId('locked-image')).toBeInTheDocument();
    expect(screen.queryByTestId('Scheduled-lock-image')).toBeNull();

    expect(screen.queryByTestId('check-box-icon')).toBeNull();
    expect(screen.queryByTestId('check-box-outlined-icon')).toBeInTheDocument();

    expect(screen.queryByText('Locked')).toBeInTheDocument();
  });

  test('Value === Scheduled lock and selected === true', () => {
    render(
      <FilterDatum
        data={{ value: 'Scheduled lock', selected: true }}
        allCheck={0}
        handleFilterData={handleFilterDataStub}
      />
    );

    expect(screen.queryByTestId('locked-image')).toBeNull();
    expect(screen.queryByTestId('Scheduled-lock-image')).toBeInTheDocument();

    expect(screen.queryByTestId('check-box-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('check-box-outlined-icon')).toBeNull();

    expect(screen.queryByText('Scheduled lock')).toBeInTheDocument();
  });

  test('Value === (Select All) and selected === true', () => {
    render(
      <FilterDatum
        data={{ value: '(Select All)', selected: false }}
        allCheck={0}
        handleFilterData={handleFilterDataStub}
      />
    );

    expect(screen.queryByTestId('locked-image')).toBeNull();
    expect(screen.queryByTestId('Scheduled-lock-image')).toBeNull();

    expect(screen.queryByText('(Select All)')).toBeInTheDocument();
  });

  test('User Click on item', () => {
    const { container } = render(
      <FilterDatum
        data={{ value: 'Scheduled lock', selected: true }}
        allCheck={0}
        handleFilterData={handleFilterDataStub}
      />
    );

    act(() => {
      fireEvent.click(container.querySelector('li'));
    });

    expect(handleFilterDataStub).toBeCalled();
  });
});

describe('Lock filter', () => {
  let filterChangedCallbackStub;

  beforeEach(() => {
    filterChangedCallbackStub = jest.fn();
  });

  afterEach(() => {
    filterChangedCallbackStub.mockReset();
  });

  test('initial render', () => {
    render(
      <LockFilter agGridReact={{}} filterChangedCallback={filterChangedCallbackStub}>
        <div data-testid="children" />
      </LockFilter>
    );
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  test('User Search on input', () => {
    render(
      <LockFilter
        agGridReact={{ gridOptions: { rowData: [{ lock: 'Locked' }] } }}
        filterChangedCallback={filterChangedCallbackStub}
      >
        <div data-testid="children" />
      </LockFilter>
    );

    act(() => {
      fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Hi' } });
    });
  });

  test('User Click on Clear btn', () => {
    const { container } = render(
      <LockFilter
        agGridReact={{ gridOptions: { rowData: [{ lock: 'Locked' }] } }}
        filterChangedCallback={filterChangedCallbackStub}
      >
        <div data-testid="children" />
      </LockFilter>
    );

    act(() => {
      fireEvent.click(container.querySelector('.clearBtn'));
    });

    expect(filterChangedCallbackStub).toBeCalled();
  });

  test('User Click on Item', () => {
    const { container } = render(
      <LockFilter
        agGridReact={{ gridOptions: { rowData: [{ lock: 'Locked' }] } }}
        filterChangedCallback={filterChangedCallbackStub}
      >
        <div data-testid="children" />
      </LockFilter>
    );

    act(() => {
      fireEvent.click(container.querySelector('li'));
    });

    expect(filterChangedCallbackStub).toBeCalled();
  });
});
