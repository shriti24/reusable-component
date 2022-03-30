import { setDecimalPlaces } from '@utils/helperFunctions';
export const percentFormatter = (params) => {
  const calcValue = setDecimalPlaces(params.value);
  if (params.column.aggFunc === 'count') {
    return params && params.value && params.value instanceof Object
      ? params.value
      : isNaN(Number(calcValue))
      ? ''
      : calcValue.toString() + '%';
  }
  return params && params.value ? calcValue.toString() + '%' : '';
};
