/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { getItemsSuggestions } from '../../services/commonPricingDataService';
import axios from 'axios';
import { useRouter } from 'next/router';
import { truncateLabel } from '../../utils/helperFunctions';
import { sentenceCase } from '../../utils/helperFunctions';
import { getRetailsData } from '../../services/retail/retailInquiryService';
import { setSelectedRetail, setSearchItemsRetail } from '../../actions/commonActions';
import BulkUploadModalContent from '../BulkUploadModalContent';
import * as uploadService from '../../services/BulkUpload/upload';
import { IRowData, TValues } from '../../types/Retails';
import InitialGridOptions from './gridOptions';
import { getCountryCode } from '../../services/getConfig';
// import DropDownTypeAhead from '../common/DropDownTypeAhead';
import AutoCompleteDropdown from '../common/AutoCompleteDropdown';

// Util
// import { constructRetailData } from '../../components/RetailGrid/util/genRetailData';
import { useHasFeature } from '@utils/useHasFeature';

import styles from './retailGrid.module.css';
import DialogBox from '../common/DialogBox';
import { getUploadTypes } from './util/getUploadTypes';
import {
  setNavAlert,
  setCompetitorsRetails,
  setGridItemLength,
  setGridUpdated
} from '../../actions/selectedViewsActions';

import { RetailBulkUpload } from './util/retailBulkUpload';
import { handleRefershUploadHistory } from '../../actions/uploadHistory';
import { _ } from 'ag-grid-community';
import underscore from 'underscore';
import { hasPermission } from '../../components/Can/permission';
import { staticPermission, USER_ACTIONS } from '../../constants/RoleBaseRules';

const SUGGESTION_PER_PAGE = 5;
const PAGE_NO = 1;
const FETCH_ON_LENGTH = 1;

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  itemSection: {
    height: '45px',
    width: '395px',
    marginLeft: '30px',
    zIndex: 1
  },
  filterSection: {
    height: '72px',
    paddingTop: '16px',
    paddingLeft: '23px',
    maxWidth: '250px'
  }
}));

const reqCancelMsg = '';
const ItemSearch = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [items, setItems] = React.useState([]);
  const [searchItems, setSearchItems] = useState([]);
  const [itemLoading, setItemLoading] = React.useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [, setStartTyping] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [inquiryValue, setInquiryValue] = useState('');
  const [lengthError, setLengthError] = useState(true);
  const [, setIsEmptyValue] = useState(false);
  const value = props.value;
  const setValue = props.setValue;
  // const setItem = props.setSelectedItems;
  // const selectedItems = props.selectedItems;
  const [, setSelectedItem] = useState(props && props.value ? props.value : '');
  const [, setRetailData] = useState([]);
  const [retailDataResponse, setRetailDataResponse] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  const [popList, setPopList] = useState<boolean>(false);
  const [type, setType] = useState<string>(null);

  const hasRetailUploadPermission = hasPermission({
    perform: staticPermission.NEW_RETAIL_UPLOAD_OPTION,
    permission: USER_ACTIONS.UPLOAD
  });

  const hasLockUploadPermission = hasPermission({
    perform: staticPermission.NEW_RETAIL_LOCK_UPLOAD_OPTION,
    permission: USER_ACTIONS.UPLOAD
  });
  const bulk_upload_types = [
    {
      title: 'retails',
      value: 'Bulk retail upload',
      disable: !hasRetailUploadPermission
    },
    {
      title: 'locks',
      value: 'Bulk lock upload',
      disable: !hasLockUploadPermission
    }
  ];

  const [selectedAction, setSelectedAction] = useState<string>('');
  const [retails, setRetails] = useState([]);
  const selectedRetailItem = {
    details: '',
    id: -1,
    label: ''
  };
  const handleDownload = () => {
    var downloadparams;
    downloadparams = {
      fileName: 'Retail_Inquiry_Export'
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    InitialGridOptions.api.exportDataAsExcel(downloadparams);
  };
  const retailData = useSelector((state: RootStateOrAny) => {
    const getSelectedRetail = underscore.get(state, ['common', 'getSelectedRetail'], []);
    if (Array.isArray(getSelectedRetail)) {
      return getSelectedRetail;
    }
    return [];
  });

  const searchDataRetail = useSelector(
    (state: RootStateOrAny) => state && state.common && state.common.getSearchItemsRetail
  );

  const [values, setValues] = useState<TValues>({
    selectedItem: selectedRetailItem,
    selectedItems: [],
    selectedClubs: [],
    selectedStatus: [],
    selectedReason: [],
    isClubDropDownOpen: false,
    isRetailDropDownOpen: false,
    isStatusDropDownOpen: false
  });
  const [dialogBoxContent, setDialogBoxContent] = useState<any>({
    title: '',
    content: '',
    firstButtonText: '',
    secondButtonText: '',
    buttonTextTransform: '',
    handleSecondButtonClick: () => null
  });
  const [rowData, setRowData] = useState<IRowData>({
    endDate: '',
    retailActionId: '',
    retailAmount: '',
    startDate: '',
    userId: '',
    retailType: '',
    retailReason: '',
    status: '',
    priceBlockId: '',
    onHandQty: 0,
    itemStatus: '',
    onOrderQty: 0,
    claimOnHandQty: 0
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [disabledSecondButtonDialog, setDisabledSecondButtonDialog] = useState<boolean>(false);
  const [actionButtonColors, setActionButtonColors] = useState<object>({
    border: 'solid 1px #0071ef',
    backgroundColor: '#0071e9',
    color: '#ffffff'
  });
  const [, setFileToUpload] = useState(null);
  const [uploadTypes, setUploadTypes] = useState(null);
  let resetModal = 0;
  let existingNameCounter = 0;

  const handleTypingOpt = (value) => {
    if (value === null) {
      setStartTyping(false);
      setItemLoading(false);
    } else if (value?.length >= FETCH_ON_LENGTH) {
      setStartTyping(false);
      setItemLoading(true);
    }
  };

  const handleChange = () => (_, searchedValue = null) => {
    if (searchedValue) {
      if (
        selectedItems.length !== 10 ||
        searchedValue.length !== 10 ||
        searchedValue.length === 0
      ) {
        setSelectedItems(searchedValue);
        props.setSelectedItems(searchedValue.map((itm: { id: Number }) => itm.id));
        setValue(searchedValue);
        dispatch(setSelectedRetail(searchedValue));
      }
      // setItem(searchedValue);
      // setSelectedItem(searchedValue);
      // if (searchedValue.length) getRetailData(searchedValue);
    } else {
      clearTags();
    }
  };

  const handleLengthError = (isError) => {
    setLengthError(isError);
  };

  // const getRetailData = async (itemObj) => {
  //   const itemNmbrs = itemObj.map((item) => item.id);
  //   const result = await getRetailsData(itemNmbrs);

  //   if (
  //     result.retailInquiryGridInfoList !== null &&
  //     result.retailInquiryGridInfoList !== undefined
  //   ) {
  //     const generatedData = constructRetailData(result.retailInquiryGridInfoList);
  //     props.setSelectedItemRetails(generatedData);
  //     setRetailData(generatedData);
  //     setRetailDataResponse(true);
  //   } else {
  //     // don't display download if list is empty
  //     setRetailDataResponse(false);
  //   }

  //   dispatch(setSelectedRetail(itemObj));
  // };

  // const updateSuggestions = () => () => {
  //   if (value.length > 0) {
  //     setValue({ ...value });
  //   }
  // };

  useEffect(() => {
    if (retailData) {
      setSelectedItems(retailData);
      props.setSelectedItems(retailData.map((itm: { id: Number }) => itm.id));
      setValue(retailData);
      setSearchItems(searchDataRetail);
      dispatch(setSelectedRetail(retailData));
    }
  }, []);

  // this useEffct will be called when there is a change in suggested options or if we don't find any options.
  useEffect(() => {
    // filtering out the options typed by the user.
    const filteredItems = selectedItems.filter((option) => option.loading);
    filteredItems.forEach((option) => {
      // to check whether the option typed by the user found in suggested options.
      const itemFound = items.find((item) => item.id === option.id);
      if (itemFound) {
        // If found then replace the object with the object from suggestions.
        const itemIndex = selectedItems.findIndex((item) => item.id === itemFound.id);
        if (itemIndex >= 0) {
          const selectedItemsClone = [...selectedItems];
          selectedItemsClone[itemIndex] = itemFound;
          setSelectedItems(selectedItemsClone);
        }
      } else {
        // If Item not found then update the option as invalid.
        const invalidItemIndex = selectedItems.findIndex((item) => item.id === option.id);
        if (invalidItemIndex >= 0) {
          const selectedItemsClone = [...selectedItems];
          selectedItemsClone[invalidItemIndex] = {
            ...selectedItemsClone[invalidItemIndex],
            loading: false,
            valid: false
          };

          setSelectedItems(selectedItemsClone);
        }
      }
    });
  }, [items, isNotFound]);

  useEffect(() => {
    let suggestions = [];
    setIsNotFound(false);
    if (inquiryValue?.length >= FETCH_ON_LENGTH) {
      const cancelToken = axios.CancelToken;
      const source = cancelToken.source();
      setItemLoading(true);
      if (useHasFeature('SHOW_RETAIL_MOCKDATA')) {
        setTimeout(() => {
          setItemLoading(false);
          setItems([
            {
              id: 1,
              details: 'REESE’S- Mock - 1',
              label: `${inquiryValue}2444 - mockData - 1`
            }
          ]);
        }, 0);
      } else {
        getItemsSuggestions(parseInt(inquiryValue), PAGE_NO, SUGGESTION_PER_PAGE, source)
          .then((response) => {
            if (response.status === 204) {
              setIsNotFound(true);
            } else {
              const data = response.data;
              setItemLoading(false);
              if (data?.totalResults === 0 || response.status === 204) {
                setIsNotFound(true);
              } else {
                suggestions = Object.values(data.typeAheadResults).map(
                  ({ itemNbr, signingDesc }) => ({
                    id: itemNbr,
                    details: signingDesc,
                    label: truncateLabel(itemNbr, sentenceCase(signingDesc))
                  })
                );

                // filtering the options already selected by the user
                const updatedSuggestions = suggestions.filter((opt) => {
                  if (selectedItems.find((itm) => itm.id === opt.id)) {
                    return false;
                  } else {
                    return true;
                  }
                });

                setItems(updatedSuggestions);
                setSearchItems([...updatedSuggestions, ...searchItems]);
                dispatch(setSearchItemsRetail([...updatedSuggestions, ...searchItems]));
              }
            }
          })
          .catch((error) => {
            if (error.message !== reqCancelMsg) {
              setItemLoading(false);
              setIsNotFound(true);
            }
          });
      }
      return () => {
        source.cancel(reqCancelMsg);
      };
    }
  }, [inquiryValue]);

  const updateItemSuggestions = () => async (value) => {
    // handleTypingOpt(value);
    setInquiryValue(value);
  };

  useEffect(() => {
    if (!selectedItems.length) {
      dispatch(setGridItemLength(false));
      dispatch(setNavAlert(false));
      dispatch(setCompetitorsRetails(false));
      dispatch(setGridUpdated(false));
    }
  }, [selectedItems]);

  const clearTags = () => {
    setSelectedItems([]);
    props.setSelectedItems([]);
    handleTypingOpt(null);
    setItems([]);
    setSearchItems([]);
    setValue([]);
    setIsEmptyValue(false);
    setInquiryValue('');
    setSelectedItem('');
    dispatch(setSelectedRetail({}));
    setRetailDataResponse(false);
  };

  let syncFileToUpload = null;
  let isTimedUpload = false;
  const enableUploadForBulkUpload = (str, file, isTimed = false) => {
    setDisabledSecondButtonDialog(false);
    bulkUploadDialogContent.secondButtonText = str;
    isTimedUpload = isTimed;
    if (str === 'Retry') {
      bulkUploadDialogContent.handleSecondButtonClick = () => retryUpload();
      setDialogBoxContent(bulkUploadDialogContent);
    }
    if (str === 'Upload') {
      setFileToUpload(file);
      syncFileToUpload = file;
    }
    setActionButtonColors({
      border: 'solid 1px #0071ef',
      backgroundColor: '#0071e9',
      color: '#ffffff'
    });
    setDialogBoxContent(bulkUploadDialogContent);
  };
  const handleUpload = () => {
    if (syncFileToUpload !== null) {
      setUploadProgress(true);
      uploadService
        .uploadFile(syncFileToUpload, sentenceCase(type.slice(0, -1)), isTimedUpload)
        .then((response) => {
          setUploadProgress(false);
          if (response.status === 200) {
            props.dispatch(handleRefershUploadHistory(true)); // Notifying the Upload Drawer about the new File
            if (useHasFeature('UPLOAD_HISTORY_SHOW_INPROGRESS_FILE')) {
              router.push('/retails/upload-history');
            }
            bulkUploadDialogContent = {
              title: `Upload ${type} by .xlsx`,
              content: (
                <BulkUploadModalContent
                  enableUpload={enableUploadForBulkUpload}
                  retryCounter={resetModal}
                  existingNameCounter={existingNameCounter}
                  uploadType={type}
                />
              ),
              firstButtonText: 'Cancel',
              secondButtonText: 'Upload',
              buttonTextTransform: 'Capitalize',
              handleSecondButtonClick: () => handleUpload()
            };
            setDialogBoxContent(bulkUploadDialogContent);
            setDialogOpen(false);
          } else {
            router.push('/retails/upload-failed');
          }
        })
        .catch((error) => {
          setUploadProgress(false);
          if (
            error &&
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500
          ) {
            const errorMsg =
              getCountryCode() == 'MX'
                ? error.response && error.response.data
                : error.response && error.response.data && error.response.data.errorMessage;
            existingNameCounter++;
            bulkUploadDialogContent = {
              title: `Upload ${type} by .xlsx`,
              content: (
                <BulkUploadModalContent
                  enableUpload={enableUploadForBulkUpload}
                  retryCounter={resetModal}
                  errorMessage={errorMsg !== '' ? errorMsg : ''}
                  existingNameCounter={existingNameCounter}
                  uploadType={type}
                />
              ),
              firstButtonText: 'Cancel',
              secondButtonText: 'Retry',
              buttonTextTransform: 'Capitalize',
              handleSecondButtonClick: () => retryUpload()
            };
            setDialogBoxContent(bulkUploadDialogContent);
            setDisabledSecondButtonDialog(false);
            setActionButtonColors({
              border: 'solid 1px #0071ef',
              backgroundColor: '#0071e9',
              color: '#ffffff'
            });
            setDialogOpen(true);
          } else {
            router.push('/retails/upload-failed');
          }
        });
    }
  };
  const retryUpload = () => {
    resetModal++;
    bulkUploadDialogContent = {
      title: `Upload ${type} by .xlsx`,
      content: (
        <BulkUploadModalContent
          enableUpload={enableUploadForBulkUpload}
          retryCounter={resetModal}
          existingNameCounter={existingNameCounter}
          uploadType={type}
        />
      ),
      firstButtonText: 'Cancel',
      secondButtonText: 'Upload',
      buttonTextTransform: 'Capitalize',
      handleSecondButtonClick: () => handleUpload()
    };
    setDialogBoxContent(bulkUploadDialogContent);
    handleUploadOpen(type);
  };

  let bulkUploadDialogContent = {
    title: `Upload ${type} by .xlsx`,
    content: (
      <BulkUploadModalContent
        enableUpload={enableUploadForBulkUpload}
        retryCounter={resetModal}
        existingNameCounter={existingNameCounter}
        uploadType={type}
      />
    ),
    firstButtonText: 'Cancel',
    secondButtonText: 'Upload',
    buttonTextTransform: 'Capitalize',
    handleSecondButtonClick: () => handleUpload()
  };
  const handleClose = () => {
    setDialogOpen(false);
  };
  useEffect(() => {
    if (type) {
      setDialogBoxContent({
        ...bulkUploadDialogContent,
        title: `Upload ${type} by .xlsx`,
        content: (
          <BulkUploadModalContent
            enableUpload={enableUploadForBulkUpload}
            retryCounter={resetModal}
            existingNameCounter={existingNameCounter}
            uploadType={type}
          />
        )
      });
    }
  }, [type]);

  const handleUploadOpen = (bulkType: string) => {
    setType(bulkType);
    setDisabledSecondButtonDialog(true);
    setActionButtonColors({
      border: 'solid 1px #c9c9ca',
      color: '#9e9e9e',
      backgroundColor: '#f5f6f8'
    });
    handlePopover();
    setDialogOpen(true);
  };
  const handleHistoryNavigation = () => {
    router.push('/retails/upload-history');
  };

  const handlePopover = () => {
    if (popList) setPopList(false);
  };

  useEffect(() => {
    if (popList && !uploadTypes) {
      const tempUploadType = getUploadTypes(bulk_upload_types);
      if (tempUploadType) {
        if (tempUploadType.length === 1) {
          handleUploadOpen(tempUploadType[0].title);
        }
        setUploadTypes(tempUploadType);
      }
    }
  }, [popList]);

  return (
    <>
      {props.inputForm === 'UPLOAD_HISTORY' || props.inputForm === 'NEW_UPLOAD_HISTORY' ? (
        <>
          <div className={styles.headerContainerUpload}>
            <RetailBulkUpload
              handleDownload={handleDownload}
              handlePopover={handlePopover}
              selectedItems={selectedItems}
              retailData={props.retailData}
              uploadTypes={uploadTypes}
              popList={popList}
              inputForm={props.inputForm}
              setPopList={setPopList}
              handleHistoryNavigation={handleHistoryNavigation}
              handleUploadOpen={handleUploadOpen}
            />
          </div>
          <div>
            <DialogBox
              classNameDialogTitle={styles.dialogTitle}
              classNameDialogCloseIcon={styles.dialogCloseBtnIcon}
              title={dialogBoxContent.title}
              contentField={<div> {dialogBoxContent.content} </div>}
              firstButtonText={dialogBoxContent.firstButtonText}
              secondButtonText={dialogBoxContent.secondButtonText}
              isOpen={dialogOpen}
              firstButtonTextTransform={dialogBoxContent.buttonTextTransform}
              secondButtonTextTransform={dialogBoxContent.buttonTextTransform}
              handleFirstButtonClick={handleClose}
              handleSecondButtonClick={() =>
                dialogBoxContent.handleSecondButtonClick(
                  selectedAction,
                  rowData,
                  retails,
                  values.selectedItem.id
                )
              }
              handleClose={handleClose}
              actionButtonColors={actionButtonColors}
              disabledSecondButton={disabledSecondButtonDialog}
              uploadProgress={uploadProgress}
            />
          </div>
        </>
      ) : (
        <div className={`${classes.container}`}>
          <div className={styles.headerContainer}>
            <p className={styles.retailHeader}>Retails</p>
            <RetailBulkUpload
              handleDownload={handleDownload}
              handlePopover={handlePopover}
              selectedItems={selectedItems}
              retailData={props.retailData}
              uploadTypes={uploadTypes}
              popList={popList}
              inputForm={'RETAIL'}
              setPopList={setPopList}
              handleHistoryNavigation={handleHistoryNavigation}
              handleUploadOpen={handleUploadOpen}
            />
          </div>
          <div>
            <DialogBox
              classNameDialogTitle={styles.dialogTitle}
              classNameDialogCloseIcon={styles.dialogCloseBtnIcon}
              title={dialogBoxContent.title}
              contentField={<div> {dialogBoxContent.content} </div>}
              firstButtonText={dialogBoxContent.firstButtonText}
              secondButtonText={dialogBoxContent.secondButtonText}
              isOpen={dialogOpen}
              firstButtonTextTransform={dialogBoxContent.buttonTextTransform}
              secondButtonTextTransform={dialogBoxContent.buttonTextTransform}
              handleFirstButtonClick={handleClose}
              handleSecondButtonClick={() =>
                dialogBoxContent.handleSecondButtonClick(
                  selectedAction,
                  rowData,
                  retails,
                  values.selectedItem.id
                )
              }
              handleClose={handleClose}
              actionButtonColors={actionButtonColors}
              disabledSecondButton={disabledSecondButtonDialog}
              uploadProgress={uploadProgress}
            />
          </div>
          <div className={classes.itemSection} style={lengthError ? { marginBottom: '20px' } : {}}>
            <AutoCompleteDropdown
              placeHolderText="Search items"
              options={items}
              selectedItems={selectedItems.length ? selectedItems : retailData}
              searchItems={searchItems.length ? searchItems : searchDataRetail}
              itemLoading={itemLoading}
              updateSuggestions={updateItemSuggestions()}
              onChange={handleChange()}
              handleLengthError={(isError) => handleLengthError(isError)}
              isRetailTour={props.isRetailTour}
              currentStep={props.currentStep}
            />
            {/* <DropDownTypeAhead
          options={items}
          value={selectedItem}
          helperText={''}
          updateSuggestions={updateItemSuggestions()}
          onChange={handleChange()}
          handleClear={() => clearTags()}
          placeHolderText="Item number"
          itemLoading={itemLoading}
          hideArrowDropDown
          startTyping={startTyping}
          isNotFound={isNotFound}
          isEmptyValue={isEmptyValue}
          setIsEmptyValue={setIsEmptyValue}
          restrictions={{ maxLength: 9 }}
          selectedRetail={
            selectedRetail
              ? selectedRetail
              : useSelector(
                  (state: RootStateOrAny) => state && state.common && state.common.getSelectedRetail
                )
          }
          retailData={retailData}
        /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default connect()(ItemSearch);
