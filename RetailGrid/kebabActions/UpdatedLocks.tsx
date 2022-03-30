import React from 'react';
import { Button } from '@material-ui/core';
import { BaseCSSProperties } from '@material-ui/core/styles/withStyles';
import LockCard from './LockCard';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { IDrawerRetail, ILockData, IBlock } from '../../../types/Retails';
import { isAdmin, isMerchandiseOrRestrictedRole } from '../../common/HelperFunctions/CanValidator';

interface StyleProps {
  lockButton: BaseCSSProperties;
  lockHeader: BaseCSSProperties;
}

// type PropsClasses = Record<keyof StyleProps, string>

const baseStyle: StyleProps = {
  lockButton: {
    bottom: '5%',
    right: '10px',
    width: '310px',
    height: '40px',
    position: 'fixed',
    borderRadius: '4px'
  },
  lockHeader: {
    marginLeft: '20px',
    fontFamily: 'Roboto',
    fontWeight: 500,
    color: '#8492a8'
  }
};

const useStyles = makeStyles<Theme, StyleProps>(() => baseStyle as any);

type TProps = {
  onHandleEditClick: (lock: ILockData | undefined, status) => void;
  onHandleDeleteLock: (status, lock: ILockData | undefined, club, item) => void;
  onHandleClick?: () => void;
  data: IDrawerRetail;
};

const UpdatedLocks = (props: TProps): JSX.Element => {
  const classes = useStyles({} as StyleProps);
  const isAdminUser = isAdmin();
  const isMerchandiseOrRestrictedUser = isMerchandiseOrRestrictedRole();

  const onHandleEditClick = (lock: ILockData | undefined, status): void => {
    props.onHandleEditClick(lock, status);
  };

  const hideKebabActionIcon = (lock: IBlock) => {
    return isMerchandiseOrRestrictedUser || (!isAdminUser && lock.blockReasonCode === 'DIS');
  };

  return (
    <React.Fragment>
      <section style={{ overflowY: 'auto', height: '80vh' }}>
        {props.data.currentBlock && (
          <React.Fragment>
            <span className={classes.lockHeader}>Current</span>
            <LockCard
              item={props.data.itemNbr}
              club={props.data.clubNbr}
              lock={props.data.currentBlock}
              status={'Active'}
              handleEditLock={onHandleEditClick}
              onHandleDeleteLock={props.onHandleDeleteLock}
              hideKebabMenu={hideKebabActionIcon(props.data.currentBlock)}
            />
          </React.Fragment>
        )}
        {props.data.futureBlocks && props.data.futureBlocks.length > 0 && (
          <React.Fragment>
            <span className={classes.lockHeader}>Future</span>
            {props.data.futureBlocks.map((block: IBlock, index) => (
              <LockCard
                key={index}
                item={props.data.itemNbr}
                club={props.data.clubNbr}
                lock={block}
                status={'Future'}
                handleEditLock={onHandleEditClick}
                onHandleDeleteLock={props.onHandleDeleteLock}
                hideKebabMenu={hideKebabActionIcon(block)}
              />
            ))}
          </React.Fragment>
        )}
      </section>
      <Button
        variant="contained"
        color="primary"
        className={classes.lockButton}
        disabled={isMerchandiseOrRestrictedUser}
        onClick={() => onHandleEditClick(undefined, undefined)}
      >
        Add Lock
      </Button>
    </React.Fragment>
  );
};

export default UpdatedLocks;
