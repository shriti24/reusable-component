/* eslint-disable */
// Lib
import { jest } from '@jest/globals';
import moment from 'moment';

//Mocks
jest
  .spyOn(require('./../../../services/getConfig'), 'getCurrencySignByCountryCode')
  .mockImplementation(() => '$');

import {
  getLockStatus,
  getBlockReasonCode,
  lockModifyStringFormatter,
  getLockEffectiveDate,
  getLockEndDate,
  checkLock
} from './getLockStatus';

describe('getLockStatus', () => {
  test('both the argument is false', () => {
    expect(getLockStatus(false, false)).toEqual('(no locks)');
  });

  test('1st argument is false and 2nd argument is true', () => {
    expect(getLockStatus(false, true)).toEqual('Scheduled lock');
  });

  test('1st argument is false and 2nd argument is true', () => {
    expect(getLockStatus(true, false)).toEqual('Locked');
  });

  test('both argument are true', () => {
    expect(getLockStatus(true, true)).toEqual('Locked');
  });
});

describe('getBlockReasonCode', () => {
  test('both the argument is null', () => {
    expect(getBlockReasonCode(null, null)).toEqual('');
  });

  test('1st argument is passed and 2nd argument is null', () => {
    expect(getBlockReasonCode({ blockReasonCodeTxt: 'blockReasonCodeTxt' }, null)).toEqual(
      'blockReasonCodeTxt'
    );
  });

  test('1st argument is null and 2nd argument is passed', () => {
    expect(getBlockReasonCode(null, [{ blockReasonCodeTxt: 'otherblockReasonCodeTxt' }])).toEqual(
      'otherblockReasonCodeTxt'
    );
  });

  test('both argument are passed', () => {
    expect(
      getBlockReasonCode({ blockReasonCodeTxt: 'blockReasonCodeTxt' }, [
        { blockReasonCodeTxt: 'otherblockReasonCodeTxt' }
      ])
    ).toEqual('blockReasonCodeTxt');
  });
});

describe('lockModifyStringFormatter', () => {
  test('both the argument is null', () => {
    expect(lockModifyStringFormatter(null, null)).toEqual('');
  });

  test('1st argument is passed and 2nd argument is null', () => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    expect(
      lockModifyStringFormatter(
        { creatorId: 'testid', lastChangeTimeStamp: timestamp, createdTimeStamp: timestamp },
        null
      )
    ).toEqual(
      `testid | ${moment(timestamp).format('MM/DD/YY')} | ${moment(timestamp).format('hh:mm:ss a')}`
    );
  });

  test('1st argument is null and 2nd argument is passed', () => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    expect(
      lockModifyStringFormatter(null, [
        { creatorId: 'testId', lastChangeTimeStamp: timestamp, createdTimeStamp: timestamp }
      ])
    ).toEqual(
      `testId | ${moment(timestamp).format('MM/DD/YY')} | ${moment(timestamp).format('hh:mm:ss a')}`
    );
  });

  test('both the argument is passed', () => {
    const timestamp = moment('').format('YYYY-MM-DD HH:mm:ss');
    const lastTimestamp = moment('2021-02-12').format('YYYY-MM-DD HH:mm:ss');
    expect(
      lockModifyStringFormatter(
        { creatorId: 'creatertestid', lastChangeTimeStamp: timestamp, createdTimeStamp: timestamp },
        [
          {
            creatorId: 'testId',
            lastChangeTimeStamp: lastTimestamp,
            createdTimeStamp: lastTimestamp
          }
        ]
      )
    ).toEqual(
      `creatertestid | ${moment(timestamp).format('MM/DD/YY')} | ${moment(timestamp).format(
        'hh:mm:ss a'
      )}`
    );
  });

  test('Created timestamp is passed and lastChangeTimeStamp is empty', () => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    expect(
      lockModifyStringFormatter(null, [
        { creatorId: 'testId', lastChangeTimeStamp: null, createdTimeStamp: timestamp }
      ])
    ).toEqual(
      `testId | ${moment(timestamp).format('MM/DD/YY')} | ${moment(timestamp).format('hh:mm:ss a')}`
    );
  });

  test('both Created timestamp  and lastChangeTimeStamp is passed', () => {
    const timestamp = moment('').format('YYYY-MM-DD HH:mm:ss');
    const lastTimestamp = moment('2021-02-12').format('YYYY-MM-DD HH:mm:ss');
    expect(
      lockModifyStringFormatter(null, [
        { creatorId: 'testId', lastChangeTimeStamp: lastTimestamp, createdTimeStamp: timestamp }
      ])
    ).toEqual(
      `testId | ${moment(lastTimestamp).format('MM/DD/YY')} | ${moment(lastTimestamp).format(
        'hh:mm:ss a'
      )}`
    );
  });
});

describe('getLockEffectiveDate', () => {
  test('both the argument is null', () => {
    expect(getLockEffectiveDate(null, null)).toEqual('');
  });

  test('1st argument is passed and 2nd argument is null', () => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    expect(getLockEffectiveDate({ startDate: 'currentLock' }, null)).toEqual('currentLock');
  });

  test('1st argument is null and 2nd argument is passed', () => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    expect(getLockEffectiveDate(null, [{ startDate: 'otherLock' }])).toEqual('otherLock');
  });

  test('both the argument is passed', () => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    expect(
      getLockEffectiveDate({ startDate: 'currentLock' }, [{ startDate: 'otherLock' }])
    ).toEqual('currentLock');
  });
});

describe('getLockEndDate', () => {
  test('both the argument is null', () => {
    expect(getLockEndDate(null, null)).toEqual('');
  });

  test('1st argument is passed and 2nd argument is null', () => {
    expect(getLockEndDate({ endDate: 'currentLock' }, null)).toEqual('currentLock');
  });

  test('1st argument is null and 2nd argument is passed', () => {
    expect(getLockEndDate(null, [{ endDate: 'otherLock' }])).toEqual('otherLock');
  });

  test('both the argument is passed', () => {
    expect(getLockEndDate({ endDate: 'currentLock' }, [{ endDate: 'otherLock' }])).toEqual(
      'currentLock'
    );
  });
});

describe('checkLock', () => {
  test('blockReasonCodeTxt is not equal to priceinvestment', () => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    expect(
      checkLock({
        blockReasonCodeTxt: 'blockReasonCodeTxt',
        creatorId: 'testId',
        startDate: timestamp,
        endDate: timestamp
      })
    ).toEqual(
      `testId | ${moment(timestamp).format('MM/DD/YY')} - ${moment(timestamp).format('MM/DD/YY')}`
    );
  });

  test('blockReasonCodeTxt is equal to priceinvestment', () => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    expect(
      checkLock({
        blockReasonCodeTxt: 'priceinvestment',
        creatorId: 'testId',
        startDate: timestamp,
        endDate: timestamp
      })
    ).toEqual(`TESTID | ${moment(timestamp).format('MM/DD/YY')}`);
  });
});
