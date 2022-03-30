import moment from 'moment';

import { DEFAULT_DATE_FORMAT } from './constants';
import { dateComparator, dateFilter, dateFormatter, formatDate } from './timeUtils';

describe('timeUtils', () => {
  it('formatDate - should format date to MM/DD/YY format if date is valid', () => {
    const t = moment(new Date());
    const date = t.format(DEFAULT_DATE_FORMAT);
    expect(formatDate(new Date().toDateString())).toEqual(date);
  });
  it('formatDate - should return -- if date is invalid', () => {
    expect(formatDate('99/99/99999')).toEqual('--');
  });
  it('dateFormatter - should return formatted effectiveDate and endDate if if col id is effectiveDate, retailType is empty and endDate is defined', () => {
    const result = `${formatDate(new Date().toDateString())} - ${formatDate(
      new Date().toDateString()
    )}`;
    const params = {
      column: {
        colId: 'effectiveDate'
      },
      data: {
        retailType: 'MD',
        endDate: new Date(),
        effectiveDate: new Date()
      }
    };
    expect(dateFormatter(params)).toEqual(result);
  });
  it('dateFormatter - should return formatted param value if col id is effectiveDate, retailType is empty, endDate is not defined and param value is provided', () => {
    const t = moment(new Date());
    const date = t.format(DEFAULT_DATE_FORMAT);
    const params = {
      value: new Date(),
      column: {
        colId: 'effectiveDate'
      },
      data: {
        retailType: 'MD',
        endDate: null
      }
    };
    expect(dateFormatter(params)).toEqual(date);
  });
  it('dateFormatter - should return param value if if col id is effectiveDate, retailType is empty, endDate and param value is not defined', () => {
    const params = {
      value: null,
      column: {
        colId: 'effectiveDate'
      },
      data: {
        retailType: 'MD',
        endDate: null
      }
    };
    expect(dateFormatter(params)).toEqual(null);
  });
  it('dateFormatter - should return param value if col id is createTimestamp and value is provided', () => {
    const params = {
      value: '01/01/2022',
      column: {
        colId: 'createTimestamp'
      },
      data: {
        retailType: 'MD',
        endDate: null
      }
    };
    expect(dateFormatter(params)).toEqual('01/01/22 12:00 AM');
  });
  it('dateFormatter - should return param value if col id is createTimestamp and value is not defined', () => {
    const params = {
      value: null,
      column: {
        colId: 'createTimestamp'
      },
      data: {
        retailType: 'MD',
        endDate: null
      }
    };
    expect(dateFormatter(params)).toEqual('');
  });
  it('dateFormatter - should return formatted param value date if col id is other than createTimestamp lastChangedTimestamp effectiveDate and value is defined', () => {
    const t = moment(new Date());
    const date = t.format(DEFAULT_DATE_FORMAT);
    const params = {
      value: new Date(),
      column: {
        colId: 'endDate'
      },
      data: {
        retailType: 'MD',
        endDate: null
      }
    };
    expect(dateFormatter(params)).toEqual(date);
  });
  it('dateFormatter - should return param value if col id is other than createTimestamp lastChangedTimestamp effectiveDate and value is not defined', () => {
    const params = {
      value: null,
      column: {
        colId: 'endDate'
      },
      data: {
        retailType: 'MD',
        endDate: null
      }
    };
    expect(dateFormatter(params)).toEqual(null);
  });
  it('dateComparator - should return 0 if both date is empty', () => {
    expect(dateComparator(null, null)).toEqual(0);
  });
  it('dateComparator - should return 1 if both startDate is empty', () => {
    expect(dateComparator(null, new Date())).toEqual(1);
  });
  it('dateComparator - should return -1 if both endDate is empty', () => {
    expect(dateComparator(new Date(), null)).toEqual(-1);
  });
  it('dateComparator - should return startDate and endDate difference', () => {
    expect(dateComparator('01/01/2022', '02/01/2022')).toEqual(2678400000);
  });
  it('dateFilter - should return false if date is not valid', () => {
    expect(dateFilter('', '--')).toEqual(false);
  });
  it('dateFilter - should return 1 if passed date is less than todays date', () => {
    expect(dateFilter('01', new Date())).toEqual(1);
  });
  it('dateFilter - should return -1 if passed date is greater than todays date', () => {
    expect(dateFilter('9999999999999999999', new Date())).toEqual(-1);
  });
});
