import { statusFormatter } from './statusFormatter';

describe('statusFormatter', () => {
  test('param is empty', () => {
    expect(statusFormatter(null)).toEqual('');
  });

  test('param status is equal to "Review"', () => {
    expect(statusFormatter({ data: { status: 'Review' } })).toEqual('Blocked');
  });

  test('param status is not equal to "Review"', () => {
    expect(statusFormatter({ data: { status: 'Not Review' } })).toEqual('Not Review');
  });
});
