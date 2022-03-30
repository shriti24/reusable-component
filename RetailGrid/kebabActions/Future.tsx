import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import FormControl from '@material-ui/core/FormControl';
import InfoIcon from '@material-ui/icons/Info';
import DropDown from '../../common/DropDown';
import FormField from '../../common/FormField';
import DateField from '../../common/ts/DateField';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Styles from '../Slider/layout.module.css';
import { GridContextAPI } from '../contextAPI';
import CustomButton from '../../common/ts/CustomButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import useToastFeature from '@utils/useToastFeature';
import useStyle from './useStyles';
import { useHasFeature } from '@utils/useHasFeature';
import { Link, makeStyles } from '@material-ui/core';
import { SEE_MD_RULE, MD_NON_EDITABLE, DATE_US_FORMAT } from '../../../constants/appConstants';
import CustomCheckbox from '../../common/ts/CustomCheckbox';
import { getCurrencySignByCountryCode } from '../../../services/getConfig';
import { isMerchandising } from '../../common/HelperFunctions/CanValidator';

interface IFutureDetail {
  item: number;
  description: string;
  status: string;
  club: number;
  retailPrice: string;
  retailActioniD?: string;
  isEdit?: boolean;
  retailReason?: string;
  retailAmount?: number;
  retailReasonCodeTxt?: string;
  effectiveDate?: string;
  expirationDate?: string;
  retailType?: string;
}
const useStyles = makeStyles((_theme) => ({
  errorBlock: {
    minWidth: '100%',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red'
      }
    }
  }
}));

const FutureDetail: FC<IFutureDetail> = ({ item, description, status, club, retailPrice }) => {
  const { t } = useTranslation();
  return (
    <div className={Styles.root}>
      <div className={Styles.form}>
        <div className={`${Styles.item}`}>
          <div className={Styles.itemText}>
            <span className={Styles.formText}> Item:</span>
            <span> {item} </span>
          </div>
          <div className={clsx(Styles.itemText)}>
            <span className={Styles.formText}> Description:</span>
            <span> {description} </span>
          </div>
          <div className={Styles.itemText}>
            <span className={Styles.formText}> Status:</span>
            {status === 'Review' ? <span> Blocked </span> : <span> {status} </span>}
          </div>
          <div className={Styles.itemText}>
            <span className={Styles.formText}> Club:</span>
            <span> {club} </span>
          </div>
          <div className={Styles.itemText}>
            <span className={Styles.formText}> {t('retailsPage.retailPrice')}: </span>
            <span>
              {getCurrencySignByCountryCode()}
              {retailPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FutureLayout = (data) => {
  const { t } = useTranslation();
  const { item, description, status, club, retailPrice, effectiveDate } = data;
  const [isOpen, setIsOpen] = useState({
    isRetailOpen: false,
    isMarkdownOpen: false
  });

  const classes = useStyle();
  const isMerchUser = isMerchandising();

  const blockedState = data && data.status == 'Review';
  const currentState = data.isEdit && data.status == 'Current';

  const isEdit = data.isEdit; // use this to laod the edit symbol on the slider
  const retailReason =
    data.retailType?.trim() === 'MD' ? data.retailType?.trim() : data.retailReason?.trim();

  const isExistingMarkdown = retailReason == 'MD' ? true : false; // check if we are editing an existing markdown
  const [isMardownSelected, setIsMarkdownSelected] = useState(isExistingMarkdown);
  const markDownReason = data.retailReason?.trim(); // if it is a markdown, get the mardown reason

  const [isPriceInvestMent, setIsPriceInvestMent] = useState(false);
  const [disableSave, setDisableSave] = useState(true);
  const [differenceDateMsg, setDifferenceDateMsg] = useState(
    moment(new Date()).format(DATE_US_FORMAT)
  );
  const [inputErrorTagMsg, setInputErrorTagMsg] = useState('');
  const { addAlert } = useToastFeature();
  const [price, setPrice] = useState({
    error: false,
    value: data.retailAmount ? data.retailAmount : ''
  });
  const [isClearanceSign, setIsClearanceSign] = useState(false);
  const isDenied = useHasFeature('SHOW_MARKDOWN_RULES') ? data.markDown?.markDownDenied : false;
  const initialState = {
    effectiveDate: {
      error: false,
      value: data?.effectiveDate // if date exits assign otherwise make new declaration
        ? new Date(moment(data.effectiveDate).format(DATE_US_FORMAT))
        : new Date()
    },
    expirationDate: {
      error: false,
      value: data?.expirationDate // if date exits assign otherwise make new declaration
        ? new Date(moment(data.expirationDate).format(DATE_US_FORMAT))
        : new Date('12/31/2049')
    }
  };
  const [date, setDate] = useState(initialState);
  const _gridContext = React.useContext(GridContextAPI);
  const [values, setValues] = useState({
    reason: data.isEdit ? retailReason : 'Select', // if we are editing then set to retail reason otherwise set to edit
    retail: '',
    markdownReason: markDownReason,
    type: retailReason == 'MD' ? retailReason : data.retailType
  });
  /**
   * function filters out the retail reason data,
   * if mardown then only show mardown,
   * if not markdown then show all others besides mardown
   * if not editing then you are adding, show full list
   * @param retailReasonData
   * @returns fiiltered retail reasonlist (retailReasonData)
   */
  const filterRetailReasons = (retailReasonData) => {
    if (isEdit && isExistingMarkdown) {
      return retailReasonData.filter((d) => d.value === 'MD');
    } else if (isEdit && !isExistingMarkdown) {
      return retailReasonData.filter((d) => d.value !== 'MD');
    } else if (isMerchUser) {
      const filter = [...retailReasonData];
      filter.forEach((d) => {
        if (d.value === 'PI' || d.value === 'MD') {
          d['disabled'] = true;
        }
      });
      return filter;
    }
    return retailReasonData;
  };

  const setErrorMsgOnSave = (errorData) => {
    setDisableSave(true);
    if (errorData.includes('Retail amount cannot end in 9 or 5')) {
      setPrice({ ...price, error: true });
      setInputErrorTagMsg(`${t('retailsPage.retail')} amount cannot end in 9 or 5`);
    } else if (errorData.includes('Retail amount cannot end in 1')) {
      setPrice({ ...price, error: true });
      setInputErrorTagMsg(`${t('retailsPage.retail')} amount cannot end in 1`);
    } else if (errorData.includes('Retails less than $300 cannot end in 00')) {
      setPrice({ ...price, error: true });
      setInputErrorTagMsg(`${t('retailsPage.retail')} less than $300 cannot end in 00`);
    } else if (errorData.includes('Retail amount cannot end in 90')) {
      setPrice({ ...price, error: true });
      setInputErrorTagMsg(`${t('retailsPage.retail')} amount cannot end in 90`);
    } else if (errorData.includes('Markdowns must end in 1')) {
      setPrice({ ...price, error: true });
      setInputErrorTagMsg('Markdowns must end in 1');
    } else if (errorData.includes('already exists')) {
      setDate({ ...date, effectiveDate: { error: true, value: date.effectiveDate.value } });
      setInputErrorTagMsg('This is a duplicate record');
    } else {
      addAlert(errorData, 'error');
      _gridContext.close();
    }
  };
  const isDefaultClearanceSign = (markdownReason) => {
    if (markdownReason === 'EOL' || markdownReason === 'LT1') {
      setIsClearanceSign(true);
    } else {
      setIsClearanceSign(false);
    }
  };

  const _onChangeRetail = (event, option) => {
    const targetValue = event.target.value;
    targetValue === 'MD' ? setIsMarkdownSelected(true) : setIsMarkdownSelected(false);
    setValues({ ...values, reason: targetValue, type: option.type });
    setDate({ ...initialState });
    _toggleRetailReason();
  };

  const _onChangeMarkdown = (event, option) => {
    const targetValue = event.target.value;
    setValues({ ...values, markdownReason: targetValue, type: option.type });
    isDefaultClearanceSign(targetValue);
    _toggleMarkdown();
  };
  const calculatedExpirationDate = (dateValue) => {
    const calExpirationDate = new Date(dateValue);
    calExpirationDate.setDate(calExpirationDate.getDate() + 180);
    return calExpirationDate;
  };
  const _onHandleEffectiveDate = (selecteddate) => {
    if (!blockedState && isMardownSelected) {
      setDate({
        effectiveDate: { error: false, value: selecteddate },
        expirationDate: { error: false, value: calculatedExpirationDate(selecteddate) }
      });
      setDifferenceDateMsg(moment(selecteddate).format(DATE_US_FORMAT));
    } else {
      setDate({ ...date, effectiveDate: { error: false, value: selecteddate } });
    }
  };

  const _onHandleExpirationDate = (selectedDate) => {
    if (moment(selectedDate).isValid()) {
      setDate({ ...date, expirationDate: { error: false, value: selectedDate } });
    }
  };

  const _toggleRetailReason = () =>
    blockedState || currentState
      ? setIsOpen({ ...isOpen, isRetailOpen: isOpen.isRetailOpen })
      : setIsOpen({ ...isOpen, isRetailOpen: !isOpen.isRetailOpen });
  const _toggleMarkdown = () =>
    isDenied || blockedState || currentState
      ? setIsOpen({ ...isOpen, isMarkdownOpen: isOpen.isMarkdownOpen })
      : setIsOpen({ ...isOpen, isMarkdownOpen: !isOpen.isMarkdownOpen });

  const _submit = () => {
    // if condition to check whether it is edit functionality???
    _gridContext.save({
      ...data,
      retailAmount: price.value,
      effectiveDate: moment(date.effectiveDate.value).format(DATE_US_FORMAT),
      expirationDate: isMardownSelected
        ? moment(date.expirationDate.value).format(DATE_US_FORMAT)
        : moment(new Date('12/31/2049')).format(DATE_US_FORMAT),
      retailReasonCode: values.reason === 'MD' ? values.markdownReason : values.reason,
      retailType: values.type,
      isClearanceSign,
      retailActionId: data?.retailActionId,
      isEdit: isEdit
    });
  };
  const calculatePIEffectiveDate = (dateValue) => {
    const calExpirationDate = new Date(dateValue);
    calExpirationDate.setDate(calExpirationDate.getDate() - 10);
    return calExpirationDate;
  };
  useEffect(() => {
    if (blockedState) setDisableSave(true);
  });

  useEffect(() => {
    if (!blockedState && isMardownSelected) {
      setDate({
        ...date,
        expirationDate: {
          error: false,
          value: calculatedExpirationDate(date.effectiveDate.value)
        }
      });
    }
  }, [values.type]);

  useEffect(() => {
    if (_gridContext.errorMsg != '') {
      setErrorMsgOnSave(_gridContext.errorMsg);
    }
  }, [_gridContext.errorMsg]);

  useEffect(() => {
    if (!blockedState && values.reason != '' && price.value != '') {
      if (currentState) {
        if (
          !moment(date.expirationDate.value).isValid() ||
          date.expirationDate.value.getFullYear() > 2100 ||
          (values.reason === 'MD' && values.markdownReason === 'Select')
        ) {
          setDisableSave(true);
        } else {
          setDisableSave(false);
        }
      } else {
        if (
          !moment(date.effectiveDate.value).isValid() ||
          !moment(date.expirationDate.value).isValid() ||
          // moment(date.effectiveDate.value).format(DATE_US_FORMAT) <
          //   moment(new Date()).format(DATE_US_FORMAT) ||
          moment(new Date()).isAfter(date.effectiveDate.value, 'day') ||
          (values.reason === 'MD' &&
            moment(date.effectiveDate.value).isAfter(date.expirationDate.value, 'day')) ||
          date.effectiveDate.value.getFullYear() > 2100 ||
          date.expirationDate.value.getFullYear() > 2100 ||
          (values.reason === 'MD' && values.markdownReason === 'Select')
        ) {
          setDisableSave(true);
        } else {
          setDisableSave(false);
        }
      }
    } else setDisableSave(true);
    if (values.reason === 'PI') {
      setIsPriceInvestMent(true);
    } else setIsPriceInvestMent(false);
  }, [
    values.reason,
    price,
    values.markdownReason,
    date.effectiveDate.value,
    date.expirationDate.value
  ]);

  useEffect(() => {
    /**  For diff date msg calcultor */
    if (values.reason === 'MD' || isPriceInvestMent) {
      const newEffectiveDate = new Date(date.effectiveDate.value);
      const newCurrentDate = new Date();
      const diffDays = moment(newEffectiveDate).diff(newCurrentDate, 'days');
      const lockEffectiveDate = calculatePIEffectiveDate(date.effectiveDate.value);
      if (isPriceInvestMent) {
        if (diffDays >= 10) {
          setDifferenceDateMsg(moment(lockEffectiveDate).format(DATE_US_FORMAT));
        }
        if (diffDays < 10) {
          setDifferenceDateMsg(moment(newCurrentDate).format(DATE_US_FORMAT));
        }
      } else {
        setDifferenceDateMsg(moment(date.effectiveDate.value).format(DATE_US_FORMAT));
      }
    }
  }, [date.effectiveDate, isPriceInvestMent]);

  return (
    <div className={Styles.sliderContainer}>
      <FutureDetail
        item={item}
        description={description}
        status={status}
        club={club}
        retailPrice={retailPrice}
      />
      <div className={Styles.root}>
        <div className={Styles.form}>
          {/* {Dropdown for selecting Retail Reason} */}
          <div className={Styles.divBlock}>
            <small className={Styles.helperText}>Retail Reason</small>
            <DropDown
              data-testid="retail-reason-drop-down"
              value={values.reason}
              onChange={_onChangeRetail}
              options={filterRetailReasons(_gridContext.retailReasons)}
              open={isOpen.isRetailOpen}
              handleToggleDropdown={_toggleRetailReason}
              disabled={blockedState || currentState}
            />
          </div>
          {/* {Dropdown is visable if the retail reason selected is Markdown} */}
          <>
            {isMardownSelected && (
              <div data-testid="markdon-reason-container" className={Styles.divBlock}>
                <small className={Styles.helperText}>Markdown Reason</small>
                <DropDown
                  data-testid="markdon-reason-drop-down"
                  value={values.markdownReason}
                  onChange={_onChangeMarkdown}
                  options={_gridContext.markdownReasons}
                  open={isOpen.isMarkdownOpen}
                  handleToggleDropdown={_toggleMarkdown}
                  disabled={isDenied || blockedState || currentState}
                />
              </div>
            )}
          </>
          {/* {Number Input for Price - Text swaps depening if it's Markdown or Other Retail Reason} */}
          <>
            <FormControl
              error={price.error}
              className={price.error ? classes.errorBlock : Styles.divBlock}
            >
              <FormField
                value={price.value}
                onChange={(event) => {
                  setPrice({ value: event.target.value, error: false });
                }}
                className={price.error ? Styles.errorBox : Styles.divBlock}
                helperText={isMardownSelected ? 'Markdown price' : t('retailsPage.retailPrice')}
                type="retail"
                disabled={(isMardownSelected && isDenied) || currentState}
              />
              {price.error && (
                <small data-testid="error-message-text" style={{ color: 'red' }}>
                  {_gridContext.errorMsg}{' '}
                </small>
              )}
            </FormControl>
          </>
          {/* {Date Controller} */}
          {!currentState && (
            <>
              <FormControl
                error={date.effectiveDate?.error}
                className={date.effectiveDate?.error ? Styles.errorBlock : Styles.divBlock}
              >
                <DateField
                  helperText={'Effective date'}
                  minDate={blockedState ? effectiveDate : new Date()}
                  selectedDate={date.effectiveDate.value}
                  handleChange={_onHandleEffectiveDate}
                  disabled={blockedState || (isMardownSelected && isDenied)}
                />
                {date.effectiveDate.error && (
                  <small className="redMsg">
                    {inputErrorTagMsg != '' ? inputErrorTagMsg : _gridContext.errorMsg}
                  </small>
                )}
              </FormControl>
            </>
          )}
          <div style={{ marginBottom: '20px' }}>
            {isMardownSelected && (
              <FormControl
                error={date.expirationDate?.error}
                className={date.expirationDate?.error ? Styles.errorBlock : Styles.divBlock}
              >
                <DateField
                  minDate={date.effectiveDate.value}
                  helperText={'Expiration Date'}
                  selectedDate={date.expirationDate.value}
                  handleChange={_onHandleExpirationDate}
                  disabled={blockedState || (isMardownSelected && isDenied)}
                />
                {date.expirationDate.error && (
                  <small style={{ color: 'red' }}>{_gridContext.errorMsg} </small>
                )}
              </FormControl>
            )}
            {blockedState && (
              <div
                data-testid="retail-block-statement-container"
                style={{ whiteSpace: 'normal', marginTop: '30px' }}
              >
                <div style={{ fontSize: '12px', display: 'flex' }}>
                  {' '}
                  <InfoIcon color="primary" />
                  <p className={classes.infoBlockText}>
                    This retail is blocked and will require review.
                  </p>
                </div>
              </div>
            )}
            {!currentState && (isPriceInvestMent || (isMardownSelected && !isDenied)) && (
              <div className={classes.lockInfo}>
                <InfoIcon color="primary" fontSize="small" />
                <span style={{ paddingLeft: '5px' }}>
                  A lock will go into effect on {differenceDateMsg}. This retail will not be
                  affected by this lock.
                </span>
              </div>
            )}
            {!currentState && isMardownSelected && useHasFeature('RETAIL_SIGNAGE_CHECKBOX') && (
              <>
                <div style={{ whiteSpace: 'normal', marginTop: '10px' }}>
                  <CustomCheckbox
                    checked={isClearanceSign}
                    indeterminate={false}
                    onChange={() => setIsClearanceSign(!isClearanceSign)}
                  />
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    display: 'flex',
                    marginTop: '-25px',
                    marginLeft: '30px'
                  }}
                >
                  <label>Generate Clearance Sign</label>
                </div>
              </>
            )}
            {isMardownSelected && isDenied && (
              <div style={{ whiteSpace: 'normal' }}>
                <div style={{ fontSize: '12px', display: 'flex' }}>
                  <InfoIcon color="primary" fontSize="small" />
                  <span style={{ paddingLeft: '5px' }}>
                    {MD_NON_EDITABLE}
                    <Link
                      href={`/markdown-rules/edit-rule?ruleid=${data.markDown.ruleId}&referrer=retail`}
                    >
                      <a>{SEE_MD_RULE}</a>
                    </Link>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`${Styles.navButtons}`}>
        <div className={Styles.backButton}>
          <CustomButton
            variant="outlined"
            type="primary"
            disabled={false}
            onClick={_gridContext.close}
          >
            <span>Cancel</span>
          </CustomButton>
        </div>
        <CustomButton
          variant="contained"
          type="primary"
          disabled={disableSave || _gridContext.isDisable}
          onClick={() => _submit()}
        >
          {_gridContext.isDisable ? (
            <CircularProgress size={30} thickness={4} value={100} />
          ) : (
            'Save'
          )}
        </CustomButton>
      </div>
    </div>
  );
};
export default FutureLayout;
