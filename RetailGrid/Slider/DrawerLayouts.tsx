import React, { useState } from 'react';
import Styles from './layout.module.css';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import DialogBox from '../../../components/common/ts/DialogBox';
import useToastFeature from '@utils/useToastFeature';
import { GridContextAPI, Data } from '../contextAPI';
import FutureLayout from '../kebabActions/Future';
import Locks from '../../RetailGrid/kebabActions/Locks';

import Info from '../kebabActions/info';
import EditLock from '../kebabActions/EditLock';
import InfoLayout from './InfoLayout';
import { ILockData, IDrawerRetail } from '../../../types/Retails';
import * as priceLockService from '../../../services/priceLockService';
import LockClosedIcon from '../../../icons/LockClosedIcon';

const renderHeader = (clickedType: string, closeData): JSX.Element => {
  const _gridContext = React.useContext(GridContextAPI);
  const gobackToLocks = () => {
    _gridContext.setType('lock', closeData);
  };
  switch (clickedType) {
    case 'add': {
      return (
        <>
          <AddIcon fontSize="default" className={Styles.tabHeaderIcon} />
          Add
        </>
      );
    }
    case 'edit': {
      return (
        <>
          <EditIcon fontSize="default" className={Styles.tabHeaderIcon} />
          Edit
        </>
      );
    }
    case 'lock': {
      return (
        <>
          <LockClosedIcon width={24} height={24} className={Styles.tabHeaderIcon} fill="#0071e9" />
          Locks
        </>
      );
    }
    case 'addLock': {
      return (
        <>
          <ArrowBackIcon
            fontSize="default"
            className={Styles.tabHeaderIcon}
            onClick={() => gobackToLocks()}
          />
          Add Lock
        </>
      );
    }
    case 'editLock': {
      return (
        <>
          <ArrowBackIcon
            fontSize="default"
            className={Styles.tabHeaderIcon}
            onClick={() => gobackToLocks()}
          />
          Edit Lock
        </>
      );
    }
    case 'info': {
      return (
        <>
          <InfoIcon fontSize="default" className={Styles.tabHeaderIcon} />
          Info
        </>
      );
    }
    default:
      return null;
  }
};

const renderLayout = (clickedType: string, data: Data): JSX.Element => {
  const _gridContext = React.useContext(GridContextAPI);
  const [editLockData, setEditLockData] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [editLock, setEditLock] = React.useState<boolean>(false);
  const { addAlert } = useToastFeature();
  const [lockProcessing, setLockProcessing] = React.useState<boolean>(false);
  const [lockData, setLockData] = React.useState<ILockData>({
    itemNbr: -1,
    clubNbr: -1,
    status: '',
    lock: {
      startDate: '',
      blockReasonCode: '',
      blockReasonCodeTxt: '',
      creatorId: '',
      createTimestamp: ''
    }
  });

  const [deleteLockPayLoad, setDeleteLockPayLoad] = React.useState({
    lockStatus: '',
    lock: {
      blockReasonCode: '',
      blockReasonCodeTxt: '',
      createdTimeStamp: '',
      creatorId: '',
      endDate: '',
      startDate: ''
    },
    club: '',
    item: ''
  });

  const onEditClick = (data, status, lock) => {
    setEditLockData(_gridContext.data);
    setEditLock(true);
    if (status) {
      _gridContext.setType('editLock');
    } else {
      _gridContext.setType('addLock');
    }
    setLockData({
      itemNbr: data.itemNbr,
      clubNbr: data.clubNbr,
      status,
      lock
    });
  };

  // eslint-disable-next-line no-shadow
  const handleEditLockSave = (data): void => {
    setLockProcessing(true);
    if (data.blockReasonCode) {
      priceLockService
        .editLockRetail(data, lockData.status)
        .then((response) => {
          if (
            response.status === 200 &&
            response.data.blockDetails.itemNbr === data.itemNbr &&
            response.data.blockDetails.clubNbr === data.clubNbr &&
            response.data.blockDetails &&
            Object.keys(response.data.blockDetails).length !== 0
          ) {
            addAlert('Lock updated successfully', 'success');
            // _gridContext.setRefresh();
            _gridContext.setType('lock', response.data.blockDetails);
            setLockProcessing(false);
          }
        })
        .catch((err) => {
          const errMsg =
            err.response &&
            err.response.data &&
            Object.keys(err.response.data.errorMsgList).length !== 0
              ? err.response.data.errorMsgList[0]
              : 'Error occurred while adding lock.';
          addAlert(errMsg, 'error');
          setLockProcessing(false);
        });
    } else {
      priceLockService
        .createLockRetail(data)
        .then((response) => {
          if (
            response.status === 200 &&
            response.data.blockDetails.itemNbr === data.itemNbr &&
            response.data.blockDetails.clubNbr === data.clubNbr &&
            response.data.blockDetails &&
            Object.keys(response.data.blockDetails).length !== 0
          ) {
            //  _gridContext.setRefresh();
            _gridContext.setType('lock', response.data.blockDetails);
            addAlert('Lock created', 'success');
            setLockProcessing(false);
          }
        })
        .catch((err) => {
          const errMsg =
            err.response &&
            err.response.data &&
            Object.keys(err.response.data.errorMsgList).length !== 0
              ? err.response.data.errorMsgList[0]
              : 'Error occurred while adding lock.';
          addAlert(errMsg, 'error');
          setLockProcessing(false);
        });
    }
  };

  const handleEditLockClose = () => {
    _gridContext.setType('lock', editLockData);
  };

  const handleDeleteLock = (lockStatus, lock, club, item) => {
    setDeleteLockPayLoad({
      lockStatus,
      lock,
      club,
      item
    });

    setOpen(true);
  };

  const handleDialogCancel = () => {
    setOpen(false);
  };

  const handleFirstButtonClick = () => {
    setOpen(false);
  };

  const handleSecondButtonClick = () => {
    priceLockService
      .deleteLockRetail(deleteLockPayLoad)
      .then((response) => {
        if (
          response.status === 200 &&
          response.data.blockDetails.itemNbr === deleteLockPayLoad.item &&
          response.data.blockDetails.clubNbr === deleteLockPayLoad.club &&
          response.data.blockDetails &&
          Object.keys(response.data.blockDetails).length !== 0
        ) {
          _gridContext.setType('lock', response.data.blockDetails);
          setOpen(false);
          addAlert('Lock Removed.', 'success');
        } else if (response.status === 204) {
          addAlert('Lock Removed.', 'success');
          setOpen(false);
          _gridContext.setType('lock', response.data.blockDetails);
        } else {
          const errMsg =
            response.data.errorMsgList && Object.keys(response.data.errorMsgList).length !== 0
              ? response.data.errorMsgList[0]
              : 'Error occurred while deleting lock.';
          addAlert(errMsg, 'error');
        }
      })
      .catch(() => {
        addAlert('Error occurred while deleting lock, Please try again.', 'error');
      });
  };

  switch (clickedType) {
    case 'add':
      return (
        <FutureLayout
          item={_gridContext.data.itemNbr}
          description={_gridContext.data.itemDesc}
          status={_gridContext.data.status}
          club={_gridContext.data.clubNbr}
          retailPrice={_gridContext.data.retailAmount}
          markDown={_gridContext.data.markDown}
        />
      );
    case 'edit': {
      return (
        <FutureLayout
          item={_gridContext.data.itemNbr}
          description={_gridContext.data.itemDesc}
          status={_gridContext.data.status}
          club={_gridContext.data.clubNbr}
          retailPrice={_gridContext.data.retailAmount}
          isEdit={true}
          retailReason={_gridContext.data.retailReason}
          retailActionId={data.retailActionId}
          retailAmount={data.retailAmount}
          retailReasonCodeTxt={data.retailReasonCodeTxt}
          effectiveDate={data.effectiveDate}
          expirationDate={data.expirationDate}
          retailType={data.retailType}
          markDown={_gridContext.data.markDown}
        />
      );
    }
    case 'lock': {
      return (
        <React.Fragment>
          <Locks
            data={_gridContext.data}
            onEditClick={(data, status, lock) => {
              onEditClick(data, status, lock);
            }}
            handleDeleteLock={(status, lock, club, item) => {
              handleDeleteLock(status, lock, club, item);
            }}
          />
          <DialogBox
            isOpen={open}
            handleClose={handleDialogCancel}
            title={'Confirm removal'}
            contentField={'Are you sure want to remove this lock?'}
            firstButtonText={'Cancel'}
            handleFirstButtonClick={handleFirstButtonClick}
            secondButtonText={'Yes, Remove'}
            handleSecondButtonClick={handleSecondButtonClick}
            disabledFirstButton={false}
            disabledSecondButton={false}
          />
        </React.Fragment>
      );
    }
    case 'editLock':
    case 'addLock':
      return (
        <React.Fragment>
          {editLock && (
            <EditLock
              handleEditLockClose={handleEditLockClose}
              handleEditLockSave={handleEditLockSave}
              lockData={lockData}
              lockProcessing={lockProcessing}
              data={_gridContext.data}
            />
          )}
        </React.Fragment>
      );
    case 'info':
      return <InfoLayout {...data} />; // TODO: Render locks here
    default:
      return null;
  }
};

export { renderHeader, renderLayout };
