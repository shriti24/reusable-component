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

// eslint-disable-next-line complexity
const EditCurrent = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const retailReason =
    props.data.retailType.trim() === 'MD'
      ? props.data.retailType.trim()
      : props.data.retailReason.trim();
  const retailAmount = props.data.retailAmount ? props.data.retailAmount : '';
  const markDownReason =
    props.data.retailType.trim() === 'MD' ? props.data.retailReason.trim() : 'OS';

  const isMarkdownRetailType = props.data.retailType.trim() === 'MD';

  const [values, setValues] = useState({
    reason: retailReason,
    retail: retailAmount,
    markdownReason: markDownReason
  });

  const reasonCodes =
    props.data.retailType.trim() !== 'MD'
      ? props.reasonCodes.retailReason.filter((reason) => reason.type !== 'MD')
      : props.reasonCodes.retailReason;
  const startDate = isMarkdownRetailType ? new Date(props.data.effectiveDate) : new Date();
  const endDate = isMarkdownRetailType
    ? moment(props.data.expirationDate)
    : moment(new Date('12/31/2049'));
  const currentDate = new Date();
  const [isMarkdown, setMarkdown] = useState(isMarkdownRetailType);
  const [effectiveDate, setEffectiveDate] = useState(startDate);
  const [expirationDate, setExpirationDate] = useState(endDate);
  const [isPriceInvestMent, setPriceInvestMent] = useState(false); //React.useState(props.data.retailReason);
  const [disableSave, setDisableSave] = useState(true);
  const [priceError, setPriceError] = useState(false);
  const [inputErrorTagMsg, setInputErrorTagMsg] = useState('');
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

  const handleEffectiveDateChange = (date) => {
    if (isMarkdown) {
      setExpirationDate(calculatedExpirationDate(date));
    }
    setEffectiveDate(date);
    setPriceError(false);
    setInputErrorTagMsg('');
    setSameDateErrMsg('');
    setSameDatesError(false);
    setShowError(false);
  };

  const handleExpirationDateChange = (date) => {
    setExpirationDate(date);
    setPriceError(false);
    setInputErrorTagMsg('');
    setSameDateErrMsg('');
    setSameDatesError(false);
    setShowError(false);
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
    if (name === 'reason') {
      setIsOpenReasonDropdown(!isOpenReasonDropdown);
      if (event.target.value === 'MD') {
        setMarkdown(true);
      } else if (event.target.value.trim() === 'PI') {
        setPriceInvestMent(true);
      } else {
        setMarkdown(false);
        setPriceInvestMent(false);
      }
    }
    setPriceError(false);
    setInputErrorTagMsg('');
    setSameDateErrMsg('');
    setSameDatesError(false);
    setShowError(false);
    if (name === 'markdownReason') setIsOpenReasonMarkdownDropdown(!isOpenReasonMarkdownDropdown);
  };

  // TODO: Placeholder until We filter out this data somewhere else - b0s01sv
  const filterMarkDownReasonOptions = (markdownReasonData) => {
    const filterMD = markdownReasonData.filter((d) => d.value !== 'CG' && d.value !== 'DS');
    return filterMD;
  };

  const handleSubmit = (data, _values, _effectiveDate, _expirationDate) => {
    if (_expirationDate < _effectiveDate) {
      setDisableSave(true);
    } else {
      setIsRequesting(true);
      props.modifyRetail(data, _values, _effectiveDate, _expirationDate);
      setShowError(true);
      setIsRequesting(false);
    }
  };

  const handleToggleReasonDropdown = () => setIsOpenReasonDropdown(!isOpenReasonDropdown);
  const handleToggleReasonMarkdownDropdown = () =>
    setIsOpenReasonMarkdownDropdown(!isOpenReasonMarkdownDropdown);

  useEffect(() => {
    if (retailReason === 'PI') {
      setPriceInvestMent(true);
    }
  }, []);

  // eslint-disable-next-line complexity
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
        setPriceError(true);
        setInputErrorTagMsg('This is a duplicate record');
      } else if (errMsg.includes('less than End Date')) {
        setSameDatesError(true);
        setSameDateErrMsg(`End Date must be after ${effectiveDate}`);
      } else {
        props.handleAlertOpen(errMsg, 'error');
        props.onClose();
      }
    }
  }, [showError, props.errorMessages]);

  useEffect(() => {
    const dateFormat = 'YYYY/MM/DD';
    const today = moment(new Date()).format(dateFormat);
    if (
      values.retail &&
      moment(expirationDate).isValid() &&
      moment(new Date(expirationDate)).format(dateFormat) >= today
    )
      setDisableSave(false);
    else setDisableSave(true);
  }, [values, expirationDate]);

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
          <Grid container spacing={3} className={classes.item}>
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
              <span> {props.data.status} </span>
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
                <DropDown
                  value={values.reason}
                  onChange={handleChange('reason')}
                  options={props.reasonCodes.markdownRetailReason}
                  open={isOpenReasonDropdown}
                  handleToggleDropdown={handleToggleReasonDropdown}
                  disabled
                />
              </Grid>
            ) : (
              <Grid data-testid="retail-reason-container" item xs={12}>
                <FormHelperText className={classes.helperText}>Retail Reason</FormHelperText>
                <DropDown
                  value={values.reason}
                  onChange={handleChange('reason')}
                  options={reasonCodes}
                  open={isOpenReasonDropdown}
                  handleToggleDropdown={handleToggleReasonDropdown}
                />
              </Grid>
            )}
            {isMarkdown && (
              <Grid data-testid="markdown-reason-container" item xs={12}>
                <FormHelperText className={classes.helperText}>Markdown Reason</FormHelperText>
                <DropDown
                  value={values.markdownReason}
                  onChange={handleChange('markdownReason')}
                  options={filterMarkDownReasonOptions(props.reasonCodes.markdownReasons)}
                  open={isOpenReasonMarkdownDropdown}
                  handleToggleDropdown={handleToggleReasonMarkdownDropdown}
                  disabled
                />
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
                  disabled={isMarkdown}
                />
                {priceError && (
                  <FormHelperText data-testid="input-error-tags-msg">
                    {' '}
                    {inputErrorTagMsg}{' '}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {!props.data.status === 'Current' && (
              <Grid item xs={12}>
                <FormControl className={classes.gridBlock}>
                  <DateField
                    helperText={'Effective date'}
                    minDate={new Date()}
                    selectedDate={effectiveDate}
                    handleChange={handleEffectiveDateChange}
                    disabled={isMarkdown && isDenied}
                  />
                </FormControl>
              </Grid>
            )}
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
                    disabled={isDenied}
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
            {isPriceInvestMent && (
              <Grid
                data-testid="price-investment-container"
                item
                xs={12}
                style={{ whiteSpace: 'normal' }}
              >
                <div style={{ fontSize: '12px', display: 'flex' }}>
                  <InfoIcon color="primary" fontSize="small" />
                  <span style={{ paddingLeft: '5px' }}>
                    A lock will go into effect on{' '}
                    {moment(new Date(currentDate)).format('MM/DD/YYYY')}. This retail will not be
                    affected by this lock.
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
          </Grid>
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
          disabled={isRequesting || values.retail === '' || disableSave}
          color="primary"
          className={classes.saveButton}
          onClick={() =>
            !isRequesting &&
            !disableSave &&
            handleSubmit(props.data, values, effectiveDate, expirationDate)
          }
        >
          {isRequesting ? <CircularProgress size={30} thickness={4} value={100} /> : 'Save'}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default EditCurrent;
