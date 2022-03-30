export interface blockedRetail {
  blockCreateUserId: string;
  blockEndDate: string;
  blockReasonCd: string;
  blockReasonCdText: string;
  blockStartDate: string;
  clubNumber: number;
  effectiveDate: string;
  effectiveTimestamp: string;
  expirationDate: string;
  lastUpdateUserId: string;
  retailActionId: number;
  retailCreateTs: string;
  retailCreateUserId: string;
  retailReason: string;
  retailReasonCodeTxt: string;
  retailType: string;
  retailTypeTxt: string;
  selected?: boolean;
  itemNbr?: number;
  proposedRetail: number | string; //no value, pre-tax retail
  currentRetail: number | string; //current pre-tax retail
  proposedCustomerRetail: number | string; //customer retail
  currentCustomerRetail: number | string; //current customer retail
}

export interface PendingRetailInfo {
  categoryDesc: string;
  categoryNbr: number;
  itemDesc: string;
  itemNbr: number;
  blockedRetails: Array<blockedRetail>;
  selectedAll?: boolean;
}
