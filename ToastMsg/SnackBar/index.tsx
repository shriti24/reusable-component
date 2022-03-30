import React, { FC } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import styles from './index.module.css';
import useToastFeature from '@utils/useToastFeature';

const ToastElement = ({ element }) => {
  const { removeAlert } = useToastFeature();
  const DEFAULT_HIDE_DURATION = 6000;
  const autoHideTime = element.autoHideDuration ? element.autoHideDuration : DEFAULT_HIDE_DURATION;

  const iconDetails = {
    success: {
      icon: CheckIcon,
      color: '#1aab5c'
    },
    error: {
      icon: PriorityHighIcon,
      color: '#d35318'
    }
  };

  const fadeStyle = element ? styles.fadeIn : styles.fadeOut;

  const IconData = iconDetails[element.status]?.icon;

  const iconShow = (status: string) => {
    if (['success', 'error'].includes(status)) {
      return (
        <div className={styles.toastContainer}>
          <span className={styles.circleCheck}>
            {
              <IconData
                fontSize="small"
                className={styles.icon}
                style={{ backgroundColor: iconDetails[element.status].color }}
              />
            }
          </span>
        </div>
      );
    } else {
      return null;
    }
  };

  const getStyle = (id) => {
    const value = id * 60 - 4;
    return `${value}px`;
  };

  const handleClose = (id: number) => {
    removeAlert(id);
  };

  const toastAction = (alertElement) => {
    if (alertElement.action) {
      return alertElement.action;
    } else {
      return (
        <div data-testid="close" onClick={() => handleClose(alertElement.id)}>
          <span className={styles.closeIcon}>
            <CloseIcon fontSize="small" />
          </span>
        </div>
      );
    }
  };

  React.useEffect(() => {
    setTimeout(() => removeAlert(element.id), autoHideTime);
  }, [element]);

  return element ? (
    <div style={{ bottom: getStyle(element.id) }} className={`${styles.snackbar} ${fadeStyle}`}>
      {iconShow(element.status)}
      <div className={styles.message} data-testid="alertMsg">
        {element.message}
      </div>
      <div className={styles.closeContainer}>{toastAction(element)}</div>
    </div>
  ) : null;
};

const SnackBar: FC = () => {
  const { alert } = useToastFeature();

  return (
    <>
      {alert ? alert.map((element) => <ToastElement key={element.id} element={element} />) : null}
    </>
  );
};

export default SnackBar;
