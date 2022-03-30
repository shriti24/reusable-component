import * as _ from 'underscore';
import { setDecimalPlaces } from '@utils/helperFunctions';
import { getCurrencySignByCountryCode } from './../../../services/getConfig';

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

// currency formatter for retail grid
export const currencyFormatter = (params) => {
  const currencySign = getCurrencySignByCountryCode();
  const calcValue = setDecimalPlaces(params.value);
  if (params?.column?.aggFunc === 'count') {
    return params && params.value >= 0 && params.value instanceof Object
      ? params.value
      : isNaN(Number(calcValue))
      ? ''
      : currencySign + calcValue.toString();
  }
  return params &&
    params.value >= 0 &&
    !_.isNull(params.value) &&
    !_.isUndefined(params.value) &&
    isNumber(params.value)
    ? currencySign + calcValue.toString()
    : '';
};

export const currencyComparator = (a, b): number => {
  if (!a && parseFloat(a) !== 0 && !b && parseFloat(b) !== 0) {
    return 0;
  } else if (!a && parseFloat(a) !== 0) {
    return 1;
  } else if (!b && parseFloat(b) !== 0) {
    return -1;
  } else {
    return b - a;
  }
};
