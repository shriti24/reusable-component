import style from '../retailGrid.module.css';
import { checkLock } from './getLockStatus';

export const showTooltip = (param, lock) => {
  return (
    <>
      <p className={style.tooltipLockDetails}>
        <span className={style.lockHeader}>{param.data.lock}:</span>{' '}
        <span>{lock.blockReasonCodeTxt}</span>
      </p>
      <p className={style.tooltipLockDetails}>{checkLock(lock)}</p>
    </>
  );
};
