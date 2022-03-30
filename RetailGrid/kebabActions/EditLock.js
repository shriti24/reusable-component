import React, { useEffect, useState } from 'react';
import { Button, Grid, Container, FormHelperText } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import DropDown from '../../common/DropDown';
import DateField from '../../common/DateField';
import useStyles from './useStyles';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getUser } from '../../../services/getConfig';
import { isAdmin } from '../../common/HelperFunctions/CanValidator';

/* eslint-disable complexity */
const EditLock = (props) => {
  const lockData = props.lockData && props.lockData.lock ? props.lockData.lock : {};
  const processing = props.lockProcessing;
  const priceLockStatus = props.lockData && props.lockData.status ? props.lockData.status : '';
  const classes = useStyles();
  const isAdminUser = isAdmin();
  const lockType = [
    {
      value: 'DIS',
      label: 'Disaster',
      disabled: !isAdminUser
    },
    {
      value: 'PII',
      label: 'Price Investment'
    },
    {
      value: 'TPR',
      label: 'Temporary Price Reduction'
    }
  ];
  const [values, setValues] = React.useState({
    selectedLock:
      Object.keys(lockData).length !== 0
        ? lockData.blockReasonCode
        : isAdminUser
        ? lockType[0].value
        : lockType[1].value
  });
  // eslint-disable-next-line no-unused-vars
  const [basePriceExpiry, setBasePriceExpiry] = React.useState('12/31/2049');
  const currentDate = moment(new Date()).subtract(1, 'day');
  const [endDatePicker, setEndDatePicker] = React.useState(false);
  const gridSize = endDatePicker ? 6 : 7;
  const [effectiveDate, setEffectiveDate] =
    Object.keys(lockData).length !== 0
      ? React.useState(moment(lockData.startDate).format('MM/DD/YYYY'))
      : React.useState(new Date());
  const [expirationDate, setExpirationDate] =
    Object.keys(lockData).length !== 0
      ? React.useState(moment(lockData.endDate).format('MM/DD/YYYY'))
      : React.useState(basePriceExpiry);
  const [requiredExpirationDate, setRequiredExpirationDate] = useState(
    values.selectedLock !== 'PII'
  );
  const [disableEndDatePicker, setDisableEndDatePicker] = useState(values.selectedLock === 'PII');
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const handleToggleDropdown = () => setIsOpenDropdown(!isOpenDropdown);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
    if (Object.keys(lockData).length === 0) {
      setExpirationDate(new Date(basePriceExpiry));
      setRequiredExpirationDate(name === 'selectedLock' && event.target.value !== 'PII');
    }
    if (name === 'selectedLock') setIsOpenDropdown(!isOpenDropdown);
  };

  const handleSubmit = () => {
    let finalExpirationDate = moment(expirationDate).format('MM/DD/YYYY');
    if (values.selectedLock === 'DIS' && !endDatePicker) {
      finalExpirationDate = basePriceExpiry;
    }
    if (Object.keys(lockData).length !== 0) {
      if (priceLockStatus === 'Active') {
        props.handleEditLockSave({
          blockReasonCode: values.selectedLock,
          clubNbr: props.lockData.clubNbr,
          itemNbr: props.lockData.itemNbr,
          newStopDate: expirationDate ? finalExpirationDate : basePriceExpiry,
          userId: getUser(),
          priceBlockId: lockData.priceBlockId
        });
      } else {
        if (values.selectedLock === 'DIS' && !endDatePicker) {
          finalExpirationDate = null;
        }
        props.handleEditLockSave({
          blockReasonCode: values.selectedLock,
          clubNbr: props.lockData.clubNbr,
          itemNbr: props.lockData.itemNbr,
          newStartDate: moment(effectiveDate).format('MM/DD/YYYY'),
          newStopDate: expirationDate ? finalExpirationDate : null,
          userId: getUser(),
          priceBlockId: lockData.priceBlockId
        });
      }
    } else {
      props.handleEditLockSave({
        clubNbr: props.lockData.clubNbr,
        itemNbr: props.lockData.itemNbr,
        selectedLock: values.selectedLock,
        effectiveDate,
        expirationDate: expirationDate ? finalExpirationDate : basePriceExpiry,
        creatorId: getUser()
      });
    }
  };

  const handleEffectiveDateChange = (date) => {
    setEffectiveDate(date);
    if (values.selectedLock === 'TPR') {
      setExpirationDate(moment(date).add(30, 'days'));
    }
    if (values.selectedLock === 'DIS') {
      setExpirationDate(
        endDatePicker ? moment(date).add(14, 'days') : setExpirationDate(basePriceExpiry)
      );
    }
  };

  const handleExpirationDateChange = (date) => {
    setExpirationDate(date);
  };

  const showEditDate = () => {
    setDisableEndDatePicker(!disableEndDatePicker);
    setEndDatePicker(!endDatePicker);
    if (endDatePicker) {
      setExpirationDate('');
    } else {
      setExpirationDate(moment(lockData.endDate).format('MM/DD/YYYY'));
    }
  };

  useEffect(() => {
    if (Object.keys(lockData).length === 0) {
      if (values.selectedLock === 'TPR') {
        setExpirationDate(moment(effectiveDate).add(30, 'days'));
      }
      if (values.selectedLock === 'DIS' && !endDatePicker) {
        setExpirationDate(basePriceExpiry);
      }
    }
  }, [effectiveDate, values.selectedLock]);

  useEffect(() => {
    if (values.selectedLock === 'DIS' && !lockData.endDate) {
      if (endDatePicker) {
        setExpirationDate(endDatePicker ? moment(effectiveDate).add(14, 'days') : basePriceExpiry);
      }
      if (!endDatePicker) {
        setExpirationDate();
      }
    }
    if (
      lockData.endDate === moment(basePriceExpiry).format('YYYY-MM-DD') &&
      values.selectedLock === 'DIS'
    ) {
      if (props.lockData.status === 'Future') {
        const endDateDisaster = moment(lockData.startDate).add(14, 'days').format('MM/DD/YYYY');
        setExpirationDate(endDateDisaster);
      }
      if (props.lockData.status === 'Active') {
        const endDateDisaster = moment(new Date()).add(14, 'days').format('MM/DD/YYYY');
        setExpirationDate(endDateDisaster);
      }
    }
  }, [endDatePicker]);

  useEffect(() => {
    if (Object.keys(lockData).length === 0) {
      setDisableEndDatePicker(values.selectedLock === 'PII' || values.selectedLock === 'DIS');
      setEndDatePicker(values.selectedLock === 'TPR');
    }
  }, [values]);

  useEffect(() => {
    if (Object.keys(lockData).length !== 0) {
      if (lockData.endDate) {
        setEndDatePicker(true);
      }
      if (basePriceExpiry === moment(lockData.endDate).format('MM/DD/YYYY')) {
        setEndDatePicker(false);
        setDisableEndDatePicker(!disableEndDatePicker);
      }
    }
  }, []);

  const getEndDatPicker = () => {
    if (!requiredExpirationDate) {
      return null;
    }
    return (
      <React.Fragment>
        {!disableEndDatePicker && (
          <Grid item xs={12}>
            <DateField
              disabled={processing}
              minDate={moment(effectiveDate).add(1, 'day')}
              helperText={'Expiration Date'}
              selectedDate={expirationDate}
              handleChange={handleExpirationDateChange}
            />
          </Grid>
        )}
        <Grid item xs={gridSize} />
        {values.selectedLock !== 'TPR' && (
          <Grid item xs={endDatePicker ? 6 : 5}>
            {endDatePicker ? (
              <span
                className={classes.endDateTag}
                onClick={!processing ? showEditDate : null}
                data-testid={'remove-end-date'}
              >
                <DeleteIcon />
                <p className={classes.endDateText}>Remove End Date </p>
              </span>
            ) : (
              <span
                className={classes.endDateTag}
                onClick={!processing ? showEditDate : null}
                data-testid={'add-end-date'}
              >
                <AddIcon />
                <p className={classes.endDateText}>Add End Date</p>
              </span>
            )}
          </Grid>
        )}
      </React.Fragment>
    );
    // return null;
  };
  return (
    <React.Fragment>
      <div className={classes.root}>
        <Container className={classes.form}>
          <Grid container spacing={2} className={classes.item}>
            <Grid item xs={12}>
              <FormControl className={classes.gridBlock}>
                <FormHelperText className={classes.helperText}>Type</FormHelperText>
                {processing || priceLockStatus ? (
                  <DropDown
                    disabled
                    value={values.selectedLock}
                    onChange={handleChange('selectedLock')}
                    options={lockType}
                  />
                ) : (
                  <DropDown
                    value={values.selectedLock}
                    onChange={handleChange('selectedLock')}
                    options={lockType}
                    open={isOpenDropdown}
                    handleToggleDropdown={handleToggleDropdown}
                  />
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <DateField
                helperText={'Effective date'}
                disabled={processing || priceLockStatus === 'Active'}
                minDate={priceLockStatus === 'Active' ? '' : new Date()}
                selectedDate={effectiveDate}
                handleChange={handleEffectiveDateChange}
              />
            </Grid>
            {getEndDatPicker()}
          </Grid>
        </Container>
      </div>
      <div className={classes.navButtons}>
        <Button
          variant="outlined"
          color="primary"
          className={classes.backButton}
          onClick={props.handleEditLockClose}
        >
          Cancel
        </Button>
        <Button
          data-testid="test-button-id"
          variant="contained"
          color="primary"
          disabled={
            processing ||
            (expirationDate && expirationDate < effectiveDate) ||
            (effectiveDate && effectiveDate < currentDate)
          }
          className={classes.saveButton}
          onClick={handleSubmit}
        >
          {processing ? <CircularProgress size={30} thickness={4} value={100} /> : 'Save'}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default EditLock;
