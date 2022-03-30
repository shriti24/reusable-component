import React from 'react';

import Button from '../../common/ts/CustomButton';

import { Grid } from '@material-ui/core';
import { GridContextAPI } from '../contextAPI';

import useStyles from '../../RetailExecutionDrawer/useStyles';
import UpdatedLocks from './UpdatedLocks';
import NoLocksImage from '../../../../public/static/NoLocksImage.png';
import { IDrawerRetail, ILockData } from '../../../types/Retails';
import { isMerchandiseOrRestrictedRole } from '../../common/HelperFunctions/CanValidator';
type TProps = {
  onEditClick: (data: IDrawerRetail, status, lock?: ILockData) => void;
  //  onClick: () => void;
  //  onClose: () => void;
  handleDeleteLock: (status, lock: ILockData | undefined, club, item) => void;
  //  handleAlertOpen: (msg, type?: string) => void;
  //  isDrawerOpen: boolean;
  data: IDrawerRetail;
};
// eslint-disable-next-line no-undef
//const Locks: FC<TProps> = ({ props: }) => {
const Locks = (props: TProps): JSX.Element => {
  const _gridContext = React.useContext(GridContextAPI);
  const classes = useStyles({});
  const isMerchandiseOrRestrictedUser = isMerchandiseOrRestrictedRole();

  const onHandleEditClick = (lock, status) => {
    if (lock) {
      props.onEditClick(props.data, status, lock);
    } else {
      props.onEditClick(_gridContext.data, status);
    }
  };

  const onHandleAddClick = () => {
    props.onEditClick(props.data, status);
  };

  return (
    <React.Fragment>
      {_gridContext.data && (_gridContext.data.currentBlock || _gridContext.data.futureBlocks) ? (
        <UpdatedLocks
          data={_gridContext.data}
          //  onHandleClick={props.onClick}
          onHandleEditClick={onHandleEditClick}
          onHandleDeleteLock={props.handleDeleteLock}
        />
      ) : (
        <div className={classes.root} data-testid="Data-Lock-Div">
          <Grid container>
            <Grid item xs={4} />
            <Grid item xs={6}>
              <img className={classes.card} src={NoLocksImage} />
              <p className={classes.noLockText}>No scheduled locks</p>
              <Button
                variant="contained"
                type="primary"
                onClick={onHandleAddClick}
                disabled={isMerchandiseOrRestrictedUser}
              >
                Add Lock
              </Button>
            </Grid>
            <Grid item xs={2} />
          </Grid>
        </div>
      )}
    </React.Fragment>
  );
};

export default Locks;
