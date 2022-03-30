/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';
import { Container, FormHelperText } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InfoIcon from '@material-ui/icons/Info';
import DropDown from '../../common/DropDown';
import FormField from '../../common/FormField';
import DateField from '../../common/DateField';
import useStyles from './useStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { setDecimalPlaces } from '../../../utils/helperFunctions';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { SEE_MD_RULE, MD_NON_EDITABLE } from '../../../constants/appConstants';
import { useHasFeature } from '@utils/useHasFeature';

const EditFuture = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const retailReason =
    props.data.retailType.trim() === 'MD'
      ? props.data.retailType.trim()
      : props.data.retailReason.trim();
  const retailAmount = props.data.retailAmount ? props.data.retailAmount : '';
  const markDownReason =
    props.data.retailType.trim() === 'MD' ? props.data.retailReason.trim() : 'OS';
  const isMarkdownRetailType = props.data.retailType.trim() === 'MD';
  const reasonCodes =
    props.data.retailType.trim() !== 'MD'
      ? props.reasonCodes.retailReason.filter((reason) => reason.type !== 'MD')
      : props.reasonCodes.retailReason;

  const [values, setValues] = useState({
    reason: retailReason,
    retail: retailAmount,
    markdownReason: markDownReason
  });
  const blockedState = props.data && props.data.status === 'Review';
  const [isMarkdown, setMarkdown] = useState(isMarkdownRetailType);
  const [effectiveDate, setEffectiveDate] = useState(
    moment(props.data.effectiveDate).format('MM/DD/YYYY')
  );
  const [expirationDate, setExpirationDate] = useState(
    moment(props.data.expirationDate).format('MM/DD/YYYY')
  );
  const [differenceDateMsg, setDifferenceDateMsg] = useState(false);
  const [differenceDate, setDifferenceDate] = useState(
    moment(new Date(props.data.effectiveDate)).format('MM/DD/YYYY')
  );
  const [isPriceInvestMent, setPriceInvestMent] = useState(false);
  const [disableSave, setDisableSave] = useState(true);
  const [priceError, setPriceError] = useState(false);
  const [inputErrorTagMsg, setInputErrorTagMsg] = useState('');
  const [existingError, setExistingError] = useState(false);
  const [sameDatesError, setSameDatesError] = useState(false);
  const [sameDateErrMsg, setSameDateErrMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isOpenReasonDropdown, setIsOpenReasonDropdown] = useState(false);
  const [isOpenReasonMarkdownDropdown, setIsOpenReasonMarkdownDropdown] = useState(false);
  const isDenied = useHasFeature('SHOW_MARKDOWN_RULES')
    ? props.data.markDown?.markDownDenied
    : false;

  const calculatedExpirationDate = (dateValue) => {
    const calExpirationDate = new Date(dateValue);
    calExpirationDate.setDate(calExpirationDate.getDate() + 180);
    return calExpirationDate;
  };

  const handleToggleReasonDropdown = () => setIsOpenReasonDropdown(!isOpenReasonDropdown);
  const handleToggleReasonMarkdownDropdown = () => {
    isDenied
      ? setIsOpenReasonMarkdownDropdown(false)
      : setIsOpenReasonMarkdownDropdown(!isOpenReasonMarkdownDropdown);
  };

  const handleEffectiveDateChange = (date) => {
    if (moment(date).isValid()) {
      if (isMarkdown) {
        setExpirationDate(calculatedExpirationDate(date));
      }
      setExistingError(false);
      setPriceError(false);
      setInputErrorTagMsg('');
      setSameDateErrMsg('');
      setSameDatesError(false);
      setShowError(false);
    }
    setEffectiveDate(date);
  };

  const handleExpirationDateChange = (date) => {
    setExpirationDate(date);
    setExistingError(false);
    setPriceError(false);
    setInputErrorTagMsg('');
    setSameDateErrMsg('');
    setSameDatesError(false);
    setShowError(false);
  };

  const handleChange = (name) => (event) => {
    // setMarkdown(false);
    setPriceInvestMent(false);
    setExistingError(false);
    setPriceError(false);
    setInputErrorTagMsg('');
    setSameDateErrMsg('');
    setSameDatesError(false);
    setShowError(false);
    setValues({ ...values, [name]: event.target.value });
    if (name === 'markdownReason') setIsOpenReasonMarkdownDropdown(!isOpenReasonMarkdownDropdown);
    if (name === 'reason') {
      setIsOpenReasonDropdown(!isOpenReasonDropdown);
      if (event.target.value === 'MD') {
        setMarkdown(true);
      } else if (event.target.value.trim() === 'PI') {
        setPriceInvestMent(true);
      }
    }
  };

  const calculatePIEffectiveDate = (dateValue) => {
    const piEffectiveDate = new Date(dateValue);
    piEffectiveDate.setDate(piEffectiveDate.getDate() - 10);
    return piEffectiveDate;
  };

  // eslint-disable-next-line max-params
  const handleSubmit = async (data, _values, _effectiveDate, _expirationDate) => {
    setIsRequesting(true);
    props.modifyRetail(data, _values, _effectiveDate, _expirationDate);
    setIsRequesting(false);
    setShowError(true);
  };

  // TODO: Placeholder until We filter out this data somewhere else - b0s01sv
  const filterMarkDownReasonOptions = (markdownReasonData) => {
    const filterMD = markdownReasonData.filter((d) => d.value !== 'CG' && d.value !== 'DS');
    return filterMD;
  };

  useEffect(() => {
    if (retailReason === 'PI') {
      setPriceInvestMent(true);
    }
  }, []);

  useEffect(() => {
    const newEffectiveDate = moment(effectiveDate);
    const newCurrentDate = new Date();
    const diffDays = parseInt((newEffectiveDate - newCurrentDate) / (1000 * 60 * 60 * 24), 10);
    if (isPriceInvestMent && !props.data.isActive) {
      if (diffDays >= 10) {
        setDifferenceDateMsg(true);
        const newEffectivDate1 = calculatePIEffectiveDate(newEffectiveDate);
        const lockEffectiveDate = moment(new Date(newEffectivDate1)).format('MM/DD/YYYY');
        setDifferenceDate(lockEffectiveDate);
      } else if (diffDays < 10) {
        setDifferenceDateMsg(true);
        setDifferenceDate(moment(new Date(newCurrentDate)).format('MM/DD/YYYY'));
      }
    } else if (isMarkdown) {
      setDifferenceDateMsg(true);
      const lockEffectiveDate = moment(new Date(newEffectiveDate)).format('MM/DD/YYYY');
      setDifferenceDate(lockEffectiveDate);
    } else {
      setDifferenceDateMsg(false);
    }
  }, [isPriceInvestMent, effectiveDate]);
  useEffect(() => {
    const errMsg = props.errorMessages;
    if (errMsg && showError) {
      setDisableSave(true);
      if (errMsg.includes('Retail amount cannot end in 9 or 5')) {
        setPriceError(true);
        setInputErrorTagMsg(`${t('retailsPage.retail')} amount cannot end in 9 or 5`);
      } else if (errMsg.includes('Retail amount cannot end in 1')) {
        setPriceError(true);
        setInputErrorTagMsg(`${t('retailsPage.retail')} amount cannot end in 1`);
      } else if (errMsg.includes('Retails less than $300 cannot end in 00')) {
        setPriceError(true);
        setInputErrorTagMsg(`${t('retailsPage.retail')} less than $300 cannot end in 00`);
      } else if (errMsg.includes('Retail amount cannot end in 90')) {
        setPriceError(true);
        setInputErrorTagMsg(`${t('retailsPage.retail')} amount cannot end in 90`);
      } else if (errMsg.includes('Markdowns must end in 1')) {
        setPriceError(true);
        setInputErrorTagMsg('Markdowns must end in 1');
      } else if (errMsg.includes('already exists')) {
        setExistingError(true);
        setInputErrorTagMsg('This is a duplicate record');
      } else if (errMsg.includes('less than End Date')) {
        setSameDatesError(true);
        setSameDateErrMsg(
          `End Date must be after ${moment(new Date(effectiveDate)).format('MM/DD/YYYY')}`
        );
      } else {
        props.handleAlertOpen(errMsg, 'error');
        props.onClose();
      }
    }
  }, [props.errorMessages, showError]);

  useEffect(() => {
    const dateFormat = 'YYYY/MM/DD';
    const today = moment(new Date()).format(dateFormat);
    if (
      values.retail &&
      moment(effectiveDate).isValid() &&
      moment(expirationDate).isValid() &&
      moment(new Date(effectiveDate)).format(dateFormat) >= today &&
      moment(new Date(expirationDate)).format(dateFormat) >= today &&
      !blockedState
    ) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  }, [values, effectiveDate, expirationDate]);

  return (
    <React.Fragment>
      <div className={classes.slideOutHeader}>
        <div className={classes.DrawerHeader}>
          <EditIcon fontSize="default" className={classes.tabHeaderIcon} />
          Edit
        </div>
        <Button
          fontSize="large"
          className={classes.clearButton}
          onClick={props.onClose}
          startIcon={<ClearIcon />}
        />
      </div>
      <div className={classes.root}>
        <Container className={classes.form}>
          <Grid container spacing={3} className={classes.item} style={{ padding: '12px 0' }}>
            <Grid item xs={12} className={classes.itemText}>
              <span className={classes.formText}> Item:</span>
              <span> {props.data.itemNbr} </span>
            </Grid>
            <Grid item xs={12} className={clsx(classes.itemText, classes.item)}>
              <span className={classes.formText}> Description:</span>
              <span> {props.itemDescription} </span>
            </Grid>
            <Grid item xs={12} className={classes.itemText}>
              <span className={classes.formText}> Status:</span>
              {blockedState ? <span> Blocked </span> : <span> {props.data.status} </span>}
            </Grid>
            <Grid item xs={12} className={classes.itemText}>
              <span className={classes.formText}> Club:</span>
              <span> {props.data.clubNbr} </span>
            </Grid>
            <Grid item xs={12} className={classes.itemText}>
              <span className={classes.formText}> {t('retailsPage.retailPrice')}: </span>
              <span> ${setDecimalPlaces(props.data.retailAmount)} </span>
            </Grid>
          </Grid>
        </Container>
      </div>
      <div className={classes.root}>
        <Container className={classes.form}>
          <Grid container spacing={2} className={classes.item}>
            {isMarkdown ? (
              <Grid data-testid="retail-reason-md-container" item xs={12}>
                <FormHelperText className={classes.helperText}>Retail Reason</FormHelperText>
                {blockedState ? (
                  <DropDown
                    value={values.reason}
                    onChange={handleChange('reason')}
                    options={props.reasonCodes.markdownRetailReason}
                    disabled
                  />
                ) : (
                  <DropDown
                    value={values.reason}
                    onChange={handleChange('reason')}
                    options={props.reasonCodes.markdownRetailReason}
                    open={isOpenReasonDropdown}
                    handleToggleDropdown={handleToggleReasonDropdown}
                  />
                )}
              </Grid>
            ) : (
              <Grid data-testid="retail-reason-container" item xs={12}>
                <FormHelperText className={classes.helperText}>Retail Reason</FormHelperText>
                {blockedState ? (
                  <DropDown
                    value={values.reason}
                    onChange={handleChange('reason')}
                    options={reasonCodes}
                    disabled
                  />
                ) : (
                  <DropDown
                    value={values.reason}
                    onChange={handleChange('reason')}
                    options={reasonCodes}
                    open={isOpenReasonDropdown}
                    handleToggleDropdown={handleToggleReasonDropdown}
                  />
                )}
              </Grid>
            )}
            {isMarkdown && (
              <Grid data-testid="markdown-reason-container" item xs={12}>
                <FormHelperText className={classes.helperText}>Markdown Reason</FormHelperText>
                {blockedState ? (
                  <DropDown
                    disabled
                    value={values.markdownReason}
                    onChange={handleChange('markdownReason')}
                    options={filterMarkDownReasonOptions(props.reasonCodes.markdownReasons)}
                  />
                ) : (
                  <DropDown
                    value={values.markdownReason}
                    onChange={handleChange('markdownReason')}
                    options={filterMarkDownReasonOptions(props.reasonCodes.markdownReasons)}
                    open={isOpenReasonMarkdownDropdown}
                    handleToggleDropdown={handleToggleReasonMarkdownDropdown}
                    disabled={isDenied}
                  />
                )}
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl
                error={priceError}
                className={priceError ? classes.errorBlock : classes.gridBlock}
              >
                <FormField
                  value={values.retail}
                  onChange={handleChange('retail')}
                  helperText={isMarkdown ? 'Markdown price' : t('retailsPage.retailPrice')}
                  type="retail"
                  disabled={isMarkdown && isDenied}
                />
                {priceError && (
                  <FormHelperText data-testid="price-error-input-tag-mesg">
                    {' '}
                    {inputErrorTagMsg}{' '}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                error={existingError}
                className={existingError ? classes.errorBlock : classes.gridBlock}
              >
                <DateField
                  helperText={'Effective date'}
                  minDate={blockedState ? effectiveDate : new Date()}
                  selectedDate={effectiveDate}
                  handleChange={handleEffectiveDateChange}
                  disabled={blockedState || (isMarkdown && isDenied)}
                />
                {existingError && (
                  <FormHelperText data-testid="existing-error-input-tag-mesg">
                    {' '}
                    {inputErrorTagMsg}{' '}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {isMarkdown && (
              <Grid item xs={12}>
                <FormControl
                  error={sameDatesError}
                  className={sameDatesError ? classes.errorBlock : classes.gridBlock}
                >
                  <DateField
                    minDate={values.effectiveDate}
                    helperText={'Expiration Date'}
                    selectedDate={expirationDate}
                    handleChange={handleExpirationDateChange}
                    disabled={blockedState || (isMarkdown && isDenied)}
                  />
                  {sameDatesError && (
                    <FormHelperText data-testid="same-dates-error">
                      {' '}
                      {sameDateErrMsg}{' '}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}
            {blockedState && (
              <Grid item xs={12} className={classes.slideOutHeader}>
                <InfoIcon color="primary" />
                <p className={classes.infoBlockText}>
                  This retail is blocked and will require review.
                </p>
              </Grid>
            )}
          </Grid>
          {differenceDateMsg && (
            <Grid
              data-testid="difference-date-msg-container"
              item
              xs={12}
              style={{ whiteSpace: 'normal' }}
            >
              <div style={{ fontSize: '12px', display: 'flex' }}>
                <InfoIcon color="primary" fontSize="small" />
                <span style={{ paddingLeft: '5px' }}>
                  {' '}
                  A lock will go into effect on {differenceDate}. This retail will not be affected
                  by this lock.
                </span>
              </div>
            </Grid>
          )}
          {isMarkdown && isDenied && (
            <Grid item xs={12} style={{ whiteSpace: 'normal' }}>
              <div style={{ fontSize: '12px', display: 'flex' }}>
                <InfoIcon color="primary" fontSize="small" />
                <span style={{ paddingLeft: '5px' }}>
                  {MD_NON_EDITABLE}
                  <Link
                    href={`/markdown-rules/edit-rule?ruleid=${props.data.markDown.ruleId}&referrer=retail`}
                  >
                    <a>{SEE_MD_RULE}</a>
                  </Link>
                </span>
              </div>
            </Grid>
          )}
        </Container>
      </div>
      <div className={classes.navButtons}>
        <Button
          variant="outlined"
          color="primary"
          className={classes.backButton}
          onClick={props.onClose}
        >
          Cancel
        </Button>
        <Button
          data-testid="save-btn"
          variant="contained"
          color="primary"
          disabled={disableSave || isRequesting}
          className={classes.saveButton}
          onClick={() =>
            !disableSave &&
            !isRequesting &&
            handleSubmit(props.data, values, effectiveDate, expirationDate)
          }
        >
          {isRequesting ? <CircularProgress size={30} thickness={4} value={100} /> : 'Save'}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default EditFuture;
