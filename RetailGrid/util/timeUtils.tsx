import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from './constants';

export const formatDate = (date: string, format: string = DEFAULT_DATE_FORMAT) => {
  const t = moment(date);
  return t.isValid() ? t.format(format) : '--';
};

export const dateTimeFormatter = (date: string) => {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  } as const;

  const strToDate = new Date(date);
  return strToDate.toLocaleString([], options).replace(/,/g, '');
};

export const dateFormatter = (params): string => {
  if (params.column.colId === 'effectiveDate' && params.data?.retailType?.trim() === 'MD') {
    return params.data.endDate
      ? `${formatDate(params.data.effectiveDate)} - ${formatDate(params.data.endDate)}`
      : params.value
      ? formatDate(params.value)
      : params.value;
  } else if (['createTimestamp', 'lastChangedTimestamp'].includes(params.column.colId)) {
    return params.value ? dateTimeFormatter(params.value) : '';
  } else {
    return params.value ? formatDate(params.value) : params.value;
  }
};

export const dateComparator = (date1, date2): number => {
  if (!date1 && !date2) return 0;
  if (!date1) return 1;
  if (!date2) return -1;
  return new Date(date2).getTime() - new Date(date1).getTime();
};

export const dateFilter = (filterDate, cellValue): number | boolean => {
  const m = moment(cellValue).toDate();
  m.setHours(0);
  m.setMinutes(0);
  m.setSeconds(0);
  m.setMilliseconds(0);
  if (!cellValue || cellValue == '--') {
    return false;
  } else if (m < filterDate) {
    return -1;
  } else if (m > filterDate) {
    return 1;
  } else {
    return 0;
  }
};
