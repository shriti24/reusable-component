import { percentFormatter } from './percentFormatter';

describe('percentFormatter', () => {
  test('Value = null and column-aggFunc is not count', () => {
    const expectedOutput = '';
    const actualOutput = percentFormatter({ column: { aggFunc: 'sum' } });
    expect(actualOutput).toEqual(expectedOutput);
  });

  xtest('Value is "Null" and column-aggFunc is not count', () => {
    const expectedOutput = 'NaN%';
    const actualOutput = percentFormatter({ value: 'null', column: { aggFunc: 'sum' } });
    expect(actualOutput).toEqual(expectedOutput);
  });

  xtest('Value <= 0 and column-aggFunc is not count', () => {
    const expectedOutput = '0.00%';
    const actualOutput = percentFormatter({ value: 0, column: { aggFunc: 'sum' } });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value >= 0 and column-aggFunc is not count', () => {
    const expectedOutput = '10.00%';
    const actualOutput = percentFormatter({ value: 10, column: { aggFunc: 'sum' } });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value >= "0" and column-aggFunc is not count', () => {
    const expectedOutput = '10.00%';
    const actualOutput = percentFormatter({ value: '10', column: { aggFunc: 'sum' } });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value = null and column-aggFunc is count', () => {
    const expectedOutput = '';
    const actualOutput = percentFormatter({ column: { aggFunc: 'count' } });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value is "Null" and column-aggFunc is count', () => {
    const expectedOutput = '';
    const actualOutput = percentFormatter({ column: { aggFunc: 'count' }, value: 'null' });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value <= 0 and column-aggFunc is count', () => {
    const expectedOutput = '0.00%';
    const actualOutput = percentFormatter({ column: { aggFunc: 'count' }, value: 0 });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value >= 0 and and column-aggFunc is count', () => {
    const expectedOutput = '10.00%';
    const actualOutput = percentFormatter({ column: { aggFunc: 'count' }, value: 10 });
    expect(actualOutput).toEqual(expectedOutput);
  });

  test('Value >= "0" and column-aggFunc is count', () => {
    const expectedOutput = '10.00%';
    const actualOutput = percentFormatter({ column: { aggFunc: 'count' }, value: '10' });
    expect(actualOutput).toEqual(expectedOutput);
  });
});
