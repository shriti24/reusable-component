import React, { useEffect, useState } from 'react';
import { getReasonCode } from '../../../services/retail/retailReasonCodeService';
import {
  createRetail,
  createCurrentRetail,
  modifyRetail
} from '../../../services/retailCreationService';
import { RetailReasonCodeType } from '../../../services/retail/type';
import moment from 'moment';
import useToastFeature from '@utils/useToastFeature';

export interface Reasons {
  value: string;
  label: string;
  type: string;
}
export interface Value {
  competitor: string;
  spread: string;
  floor: string;
  createdBy: string;
  ruleId: string;
  retailAmount: string | null;
  customerRetailAmt: string | null;
}
export interface ActiveBlock {
  priceBlockId: number;
  blockReasonCode: string;
  blockReasonCodeTxt: string;
  startDate: string;
  endDate: string;
  creatorId: string;
  createdTimeStamp: string;
  lastChangeId: string;
  lastChangeTimeStamp: string;
}
export interface OtherBlock {
  priceBlockId: number;
  blockReasonCode: string;
  blockReasonCodeTxt: string;
  startDate: string;
  endDate: string;
  creatorId: string;
  createdTimeStamp: string;
  lastChangeId: string;
  lastChangeTimeStamp: string;
}

export interface FutureBlock {
  priceBlockId: number;
  blockReasonCode: string;
  blockReasonCodeTxt: string;
  startDate: string;
  endDate: string;
  creatorId: string;
  createdTimeStamp: string;
  lastChangeId: string;
  lastChangeTimeStamp: string;
}

export interface Data {
  currentBlock: Array<ActiveBlock>;
  itemNbr: number;
  itemDesc: string;
  status: string;
  clubNbr: number;
  retailAmount: string | null;
  effectiveDate: string;
  expirationDate: string;
  retailType: string;
  retailReasonCode: string;
  retailReason?: string;
  activeBlock: Array<ActiveBlock>;
  otherBlocks: Array<OtherBlock>;
  futureBlocks: Array<FutureBlock>;
  baseRetailPrice: number;
  createTimestamp: string;
  creatorId: string;
  otherRetails: Array<IOtherRetails>;
  retailActionId?: number | string;
  retailReasonCodeTxt?: string;
  markDown?: MarkDown;
  customerRetailAmt: string | null;
  currentActiveRetailPrice: string | null;
}
export interface IOtherRetails {
  clubNbr: number;
  baseRetailPrice: number;
  createTimestamp: string;
  creatorId: string;
  retailAmount: string;
  effectiveDate: string;
  expirationDate: string;
  retailType: string;
  retailReasonCode: string;
  status: string;
}

interface MarkDown {
  markDownDenied: boolean;
  ruleId: string;
}
export interface IGridContext {
  selectedType: string;
  retailReasons: Array<Reasons>;
  markdownReasons: Array<Reasons>;
  isDisable: boolean;
  isDelete: boolean;
  errorMsg: string;
  setType?: (type: string, data?: Data) => void;
  clearType?: () => void;
  close?: () => void;
  save?: (data: Data) => void;
  data?: Data;
  refresh: boolean;
  setRefresh: () => void;
  getReasonData?: () => void;
  setDelete: () => void;
}

export const GridContext: IGridContext = {
  selectedType: '',
  retailReasons: [],
  markdownReasons: [],
  isDisable: false,
  isDelete: false,
  errorMsg: '',
  setType: () => {},
  clearType: () => {},
  close: () => {},
  save: () => {},
  refresh: false,
  setRefresh: () => {},
  getReasonData: () => {},
  setDelete: () => {}
};

export const GridContextAPI = React.createContext(GridContext);
export const GridContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [context, setContext] = useState<IGridContext>({ ...GridContext });
  const { addAlert } = useToastFeature();
  const _constructReasonData = (data: Array<RetailReasonCodeType>) => {
    const _retailReasons = [];
    const _markdownReasons = [];

    for (const reason of data) {
      if (reason.retailType !== 'MD' && reason.retailType !== 'CI') {
        _retailReasons.push({
          value: reason.retailReason,
          label: reason.retailReasonCodeTxt,
          type: reason.retailType
        });
      }

      if (
        reason.retailType === 'MD' &&
        reason.retailReason !== 'CG' &&
        reason.retailReason !== 'DS'
      ) {
        _markdownReasons.push({
          value: reason.retailReason,
          label: reason.retailReasonCodeTxt,
          type: reason.retailType
        });
      }
    }
    _retailReasons.push({
      value: 'MD',
      label: 'Markdown',
      type: 'MD'
    });
    setContext({
      selectedType: '',
      retailReasons: _retailReasons,
      markdownReasons: _markdownReasons,
      isDisable: false,
      isDelete: false,
      errorMsg: '',
      refresh: false,
      setRefresh: () => {},
      setDelete: () => {}
    });
  };

  const _setType = (type: string, data: Data) =>
    setContext({ ...context, selectedType: type, data });
  const _clearType = () => setContext({ ...GridContext, selectedType: '', refresh: true });
  // const _setRefresh = () => setContext({ ...GridContext, refresh: true });
  const _close = () => _clearType();
  const _setDelete = () => setContext({ ...GridContext, refresh: true });
  const _save = (_values) => {
    // Add API Here
    // 1) What is the type - > Add/Edit Future or Add/Edit Lock
    // 2) Submit Data to backend
    // 3) If failed use helper function (NEED TO BUILD) to parse error data
    setContext({ ...context, isDisable: true, errorMsg: '', refresh: false });
    const isEffectiveDateCurrent =
      moment(new Date()).format('MM/DD/YYYY') === _values.effectiveDate;
    const data = {
      itemNbr: _values.item,
      clubNbr: _values.club,
      status: _values.status,
      retailActionId: _values.retailActionId,
      retailReason: _values.retailReasonCode,
      retailType: _values.retailType,
      retailAmount: _values.retailPrice
    };

    const values = {
      retail: _values.retailAmount,
      type: _values.retailType,
      reason: _values.retailReasonCode
    };
    if (_values.isEdit) {
      modifyRetail(data, values, _values.effectiveDate, _values.expirationDate)
        .then(() => {
          addAlert(
            `Item ${data.itemNbr}/ Club ${data.clubNbr} retail Successfully Updated`,
            'success'
          );
          setContext({ ...context, isDisable: false, refresh: true, selectedType: '' });
        })
        .catch((err) => {
          console.log(err);
          setContext({
            ...context,
            errorMsg: err.response.data.errorMsgList[0],
            isDisable: false,
            refresh: true
          });
        });
    } else {
      if (isEffectiveDateCurrent) {
        createCurrentRetail(data, values, _values.effectiveDate, _values.expirationDate)
          .then(() => {
            addAlert(
              `Item ${data.itemNbr}/ Club ${data.clubNbr} retail Successfully Updated`,
              'success'
            );
            setContext({ ...context, isDisable: false, refresh: true, selectedType: '' });
          })
          .catch((err) => {
            setContext({
              ...context,
              errorMsg: err.response.data.errorMsgList[0],
              isDisable: false,
              refresh: true
            });
          });
      } else {
        createRetail(
          data,
          values,
          _values.effectiveDate,
          _values.expirationDate,
          _values.isClearanceSign
        )
          .then(() => {
            addAlert(
              `Item ${data.itemNbr}/ Club ${data.clubNbr} retail Successfully Updated`,
              'success'
            );
            setContext({ ...context, refresh: true, selectedType: '', isDisable: false });
          })
          .catch((err) => {
            setContext({
              ...context,
              errorMsg: err.response.data.errorMsgList[0],
              isDisable: false
            });
          });
      }
    }
  };

  const _getReasonData = async () => {
    await getReasonCode().then((data) => {
      if (data.status === 200) {
        _constructReasonData(data.reasonCode);
      }
    });
  };

  useEffect(() => {
    _getReasonData();
  }, []);
  return (
    <GridContextAPI.Provider
      value={{
        ...context,
        setType: _setType,
        clearType: _clearType,
        close: _close,
        save: _save,
        //  setRefresh: _setRefresh,
        setDelete: _setDelete,
        getReasonData: _getReasonData
      }}
    >
      {children}
    </GridContextAPI.Provider>
  );
};
