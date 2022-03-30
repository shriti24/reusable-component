/* eslint-disable */
// Lib
import { jest } from '@jest/globals';

//Mocks
jest
  .spyOn(require('./../../../services/getConfig'), 'getCurrencySignByCountryCode')
  .mockImplementation(() => '$');

import { currencyFormatter, currencyComparator } from './currencyFormatter';

describe('currencyFormatter', () => {
  test('Value = null and column-aggFunc is not count', () => {
    const expectedOutput = '';
    const actualOutput = currencyFormatter({});
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value is "Null" and column-aggFunc is not count', () => {
    const expectedOutput = '';
    const actualOutput = currencyFormatter({ value: 'null' });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value <= 0 and column-aggFunc is not count', () => {
    const expectedOutput = '$0.00';
    const actualOutput = currencyFormatter({ value: 0 });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value >= 0 and column-aggFunc is not count', () => {
    const expectedOutput = '$10.00';
    const actualOutput = currencyFormatter({ value: 10 });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value >= "0" and column-aggFunc is not count', () => {
    const expectedOutput = '$10.00';
    const actualOutput = currencyFormatter({ value: '10' });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value = null and column-aggFunc is count', () => {
    const expectedOutput = '';
    const actualOutput = currencyFormatter({ column: { aggFunc: 'count' } });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value is "Null" and column-aggFunc is count', () => {
    const expectedOutput = '';
    const actualOutput = currencyFormatter({ column: { aggFunc: 'count' }, value: 'null' });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value <= 0 and column-aggFunc is count', () => {
    const expectedOutput = '$0.00';
    const actualOutput = currencyFormatter({ column: { aggFunc: 'count' }, value: 0 });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value >= 0 and and column-aggFunc is count', () => {
    const expectedOutput = '$10.00';
    const actualOutput = currencyFormatter({ column: { aggFunc: 'count' }, value: 10 });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value >= "0" and column-aggFunc is count', () => {
    const expectedOutput = '$10.00';
    const actualOutput = currencyFormatter({ column: { aggFunc: 'count' }, value: '10' });
    expect(actualOutput).toEqual(expectedOutput);
  });
});

describe('currencyComparator', () => {
  test('both argument is null', () => {
    expect(currencyComparator(null, null)).toEqual(0);
  });

  test('both argument is zero', () => {
    expect(currencyComparator(0, 0)).toEqual(0);
  });

  test('1st argument is greater than zero and 2nd argument is less than zero', () => {
    expect(currencyComparator(10, null)).toEqual(-1);
  });

  test('1st argument is less than zero and 2nd argument is greater than zero', () => {
    expect(currencyComparator(null, 10)).toEqual(1);
  });

  test('1st argument is greater than zero and 2nd argument is greater than zero', () => {
    expect(currencyComparator(20, 10)).toEqual(-10);
  });
});
