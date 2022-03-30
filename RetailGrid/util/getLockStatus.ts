import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from './constants';

export const getLockStatus = (currentLock, otherLock) => {
  if (currentLock) {
    return 'Locked';
  } else if (otherLock) {
    return 'Scheduled lock';
  } else {
    return '(no locks)';
  }
};

export const getBlockReasonCode = (currentLock, otherLock) => {
  const blockReasonCodeTxt =
    currentLock !== null
      ? currentLock.blockReasonCodeTxt
      : otherLock !== null
      ? otherLock[0].blockReasonCodeTxt
      : '';
  return blockReasonCodeTxt;
};

export const lockModifyStringFormatter = (currentBlock, otherLock) => {
  if (currentBlock == null && otherLock == null) return '';
  else {
    const userId =
      currentBlock !== null
        ? currentBlock.creatorId
        : otherLock !== null
        ? otherLock[0].creatorId
        : '';
    const lastChangeTimeStamp =
      currentBlock !== null
        ? currentBlock.lastChangeTimeStamp
        : otherLock !== null
        ? otherLock[0].lastChangeTimeStamp
        : '';

    const createdTimeStamp =
      currentBlock !== null
        ? currentBlock.createdTimeStamp
        : otherLock !== null
        ? otherLock[0].createdTimeStamp
        : null;

    const monthDayYear =
      lastChangeTimeStamp !== null ? moment(lastChangeTimeStamp) : moment(createdTimeStamp);
    const hour =
      lastChangeTimeStamp !== null ? moment(lastChangeTimeStamp) : moment(createdTimeStamp);
    return `${userId} | ${monthDayYear.format(DEFAULT_DATE_FORMAT)} | ${hour.format('hh:mm:ss a')}`;
  }
};

export const getLockEffectiveDate = (currentLock, otherLock) => {
  const lockEffectiveDate =
    currentLock !== null ? currentLock.startDate : otherLock !== null ? otherLock[0].startDate : '';
  return lockEffectiveDate;
};

export const getLockEndDate = (currentLock, otherLock) => {
  const lockEndDate =
    currentLock !== null ? currentLock.endDate : otherLock !== null ? otherLock[0].endDate : '';
  return lockEndDate;
};

export const checkLock = (lock) => {
  if (lock.blockReasonCodeTxt?.toLowerCase().replace(/\s+/g, '') === 'priceinvestment')
    return (
      `${lock.creatorId.toUpperCase()} | ` + moment(lock.startDate).format(DEFAULT_DATE_FORMAT)
    );
  else
    return `${lock.creatorId} | ${moment(lock.startDate).format(DEFAULT_DATE_FORMAT)} - ${moment(
      lock.endDate
    ).format(DEFAULT_DATE_FORMAT)}`;
};
