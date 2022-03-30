import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { ColumnDetails } from './index';

let country = 'US';
const getCountry = () => {
  return country;
};

jest.mock('../../../services/getConfig', () => {
  return {
    getCountryCode: getCountry
  };
});

describe('retail column', () => {
  it('should return US columns if country is US', () => {
    country = 'US';
    expect(ColumnDetails()[0]).toEqual({
      headerName: 'Item number',
      field: 'itemNbr',
      toolPanelClass: 'disableItem',
      suppressFiltersToolPanel: true,
      sort: 'asc',
      sortOrder: 0
    });
  });
  it('should return undefined if country is empty', () => {
    country = null;
    expect(ColumnDetails()).toEqual(undefined);
  });
  it('should return effectiveTimestamp for Retail effective date column if effectiveTimestamp is defined', () => {
    country = 'US';
    const columnDetails = ColumnDetails();
    const retailEffDate = columnDetails.find(
      (column) => column.headerName === 'Retail effective date'
    );
    const date = retailEffDate.valueGetter({
      data: { effectiveTimestamp: '01/01/2022-10:10:00', effectiveDate: '01/01/2022' }
    });
    expect(date).toEqual('01/01/2022-10:10:00');
  });
  it('should return effectiveDate for Retail effective date column if effectiveTimestamp is not defined', () => {
    country = 'US';
    const columnDetails = ColumnDetails();
    const retailEffDate = columnDetails.find(
      (column) => column.headerName === 'Retail effective date'
    );
    const date = retailEffDate.valueGetter({
      data: { effectiveTimestamp: undefined, effectiveDate: '01/01/2022' }
    });
    expect(date).toEqual('01/01/2022');
  });
  it('should return creatorId for Lock last modified column if currentBlock creatorId is defined', () => {
    country = 'US';
    const columnDetails = ColumnDetails();
    const retailEffDate = columnDetails.find(
      (column) => column.headerName === 'Lock last modified'
    );
    const creatorId = retailEffDate.filterValueGetter({
      data: { currentBlock: { creatorId: 'testid' } }
    });
    expect(creatorId).toEqual('testid');
  });
  it('should return empty value as creatorId for Lock last modified column if currentBlock creatorId is not defined', () => {
    country = 'US';
    const columnDetails = ColumnDetails();
    const retailEffDate = columnDetails.find(
      (column) => column.headerName === 'Lock last modified'
    );
    const creatorId = retailEffDate.filterValueGetter({
      data: undefined
    });
    expect(creatorId).toEqual('');
  });
});
