export enum status {
  FUTURE = 'Future',
  BLOCKED = 'Blocked'
}

export const hearderOptions = [
  { value: '4 Week', label: '4 Week' },
  { value: '13 Week', label: '13 Week' },
  { value: '1 Week', label: '1 Week' }
];
export const salesHeaders = ['totalCost', 'totalSales', 'totalUnits', 'outOfStockDate'];

export const DEFAULT_DATE_FORMAT = 'MM/DD/YY';

export const LIMIT_ERROR = '10 item search limit max';
export const NAV_ALERT_MESSAGE =
  'You have made changes on this page, do you proceed without saving';
export const NAV_ALERT_MESSAGE_VIEWS = 'Save your table column settings, filter and positions for';
export const COMPETITOR_VIEWS_MESSAGE =
  'Competitor columns added into table, Please save the table before switching';
export const SHOW_MOCK_RETAILS = false;
/* eslint-disable quotes */
export const COMPETITOR_HEADERS = [
  'Costco retail',
  'Costco retail updated',
  "BJ's retail",
  "BJ's retail updated",
  'Costco.com retail',
  'Costco.com retail updated',
  'Amazon.com retail',
  'Amazon.com retail updated',
  'Walmart.com retail',
  'Walmart.com retail updated',
  'Bestbuy.com retail',
  'Bestbuy.com retail updated'
];
