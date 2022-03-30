import { effectiveDateTimeFilter } from '@utils/retailEffectiveTiming/getRetailEffectiveDateTime';
import { currencyFormatter, currencyComparator } from '../util/currencyFormatter';
import { percentFormatter } from '../util/percentFormatter';
import { statusFormatter } from '../util/statusFormatter';
import { dateComparator, dateFilter, dateFormatter } from '../util/timeUtils';

export const allowedAggFns = ['avg', 'count', 'first', 'last', 'sum', 'min', 'max'];

export const textFilterParams = {
  filters: [
    {
      filter: 'agTextColumnFilter',
      display: 'subMenu',
      filterParams: { buttons: ['clear'] }
    },
    {
      filter: 'agSetColumnFilter',
      filterParams: { buttons: ['clear'] }
    }
  ]
};

export const ITEM_NUMBER_COL = {
  headerName: 'Item number',
  field: 'itemNbr',
  toolPanelClass: 'disableItem',
  suppressFiltersToolPanel: true,
  sort: 'asc',
  sortOrder: 0
};

export const ITEM_DESCRIPTION_COL = {
  headerName: 'Item description',
  field: 'itemDesc',
  filter: 'agMultiColumnFilter',
  filterParams: textFilterParams
};

export const CATEGORY_COL = {
  headerName: 'Category',
  field: 'category',
  filter: 'agMultiColumnFilter',
  filterParams: textFilterParams
};

export const SUB_CATEGORY_COL = {
  headerName: 'Sub category',
  field: 'subCategory',
  filter: 'agMultiColumnFilter',
  filterParams: textFilterParams
};

export const CLUB_NUMBER_COL = {
  headerName: 'Club number',
  field: 'clubNbr',
  toolPanelClass: 'disableItem',
  enableValue: true,
  allowedAggFuncs: ['count'],
  sort: 'asc',
  sortOrder: 1
};

export const SALES_TOTAL_COST = {
  headerName: 'Total cost',
  field: 'totalCost',
  valueFormatter: currencyFormatter,
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  headerClass: 'headerAlign',
  comparator: currencyComparator
};

export const SALES_TOTAL_SALES = {
  headerName: 'Total sales',
  field: 'totalSales',
  valueFormatter: currencyFormatter,
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  headerClass: 'headerAlign',
  comparator: currencyComparator
};

export const SALES_TOTAL_UNITS = {
  headerName: 'Total units',
  field: 'totalUnits',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  headerClass: 'headerAlign'
};

export const SALES_OUT_OF_STOCK_DATE = {
  headerName: 'Projected out of stock date',
  field: 'outOfStockDate',
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  },
  cellClass: 'numberAlign',
  headerClass: 'headerAlign'
};

export const RETAIL_AMOUNT_COL = {
  headerName: 'Retail',
  field: 'retailAmount',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  toolPanelClass: 'disableItem',
  valueFormatter: currencyFormatter,
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  headerClass: 'headerAlign',
  comparator: currencyComparator
};

export const RETAIL_EFFECTIVE_DATE_COL = {
  headerName: 'Retail effective date',
  field: 'effectiveDate',
  valueGetter: (params) =>
    params?.data?.effectiveTimestamp ? params?.data?.effectiveTimestamp : params?.data?.effectiveDate,
  cellRenderer: 'effectiveDateTimeRender',
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: effectiveDateTimeFilter
  },
  cellClass: 'numberAlign',
  headerClass: 'headerAlign'
};

export const RETAIL_REASON_CODE_COL = {
  headerName: 'Retail reason code',
  field: 'retailReason',
  hide: true,
  filter: 'agMultiColumnFilter',
  filterParams: textFilterParams
};

export const RETAIL_REASON_COL = {
  headerName: 'Retail reason',
  field: 'retailReasonCodeTxt',
  filter: 'agMultiColumnFilter',
  filterParams: textFilterParams
};

export const RETAIL_STATUS_COL = {
  headerName: 'Retail status',
  field: 'status',
  valueGetter: statusFormatter
};

export const LOCATION_TYPE_COL = {
  headerName: 'Location type',
  field: 'type',
  filter: 'agMultiColumnFilter',
  filterParams: textFilterParams,
  cellRenderer: 'typeItemRender'
};

export const REGION_COL = {
  headerName: 'Region',
  field: 'regionName'
};

export const MARKET_AREA_NUMBER_COL = {
  headerName: 'Market',
  field: 'marketAreaNumber',
  filter: 'agNumberColumnFilter'
};

export const STATE_PROV_CODE_COL = {
  headerName: 'State',
  field: 'stateProvCode',
  filter: 'agMultiColumnFilter',
  filterParams: textFilterParams
};

export const ORDERABLE_COST_COL = {
  headerName: 'Orderable cost',
  field: 'orderableCost',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  valueFormatter: currencyFormatter,
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  headerClass: 'headerAlign',
  comparator: currencyComparator
};

export const ORDERABLE_QUANTITY_COL = {
  headerName: 'Orderable quantity',
  field: 'orderableQty',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  cellClass: 'numberAlign',
  headerClass: 'headerAlign'
};

export const WAREHOUSE_PACK_COST_COL = {
  headerName: 'Warehouse pack cost',
  field: 'whpkSellAmt',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  valueFormatter: currencyFormatter,
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  headerClass: 'headerAlign',
  comparator: currencyComparator
};

export const MARGIN_COL = {
  headerName: 'Margin',
  field: 'margin',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  valueFormatter: percentFormatter,
  headerClass: 'headerAlign'
};

export const ON_HAND_QTY_COL = {
  headerName: 'On hand',
  field: 'onHandQty',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  headerClass: 'headerAlign'
};

export const ON_ORDER_QTY_COL = {
  headerName: 'On order',
  field: 'onOrderQty',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  headerClass: 'headerAlign'
};

export const CLAIM_ON_HAND_QTY_COL = {
  headerName: 'Claims',
  field: 'claimOnHandQty',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  headerClass: 'headerAlign'
};

export const ITEM_STATUS_COL = {
  headerName: 'Item Status',
  field: 'itemStatus'
};

export const ITEM_EFFECTIVE_DATE_COL = {
  headerName: 'Item effective date',
  field: 'itemOnShelfDate',
  filter: 'agDateColumnFilter',
  valueFormatter: dateFormatter,
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  }
};

export const OUT_OF_STOCK_DATE_COL = {
  headerName: 'Out of stock date',
  field: 'itemOffShelfDate',
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  }
};

export const PI_MARKET_COL = {
  headerName: 'PI market',
  field: 'piMarket',
  sortable: true
};

export const PI_MARKET_TYPE_COL = {
  headerName: 'PI market type',
  field: 'piMarketType',
  sortable: true
};

export const PI_ITEM_COL = {
  headerName: 'PI item',
  field: 'piItem',
  sortable: true,
  cellRenderer: 'piItemRender',
  cellClass: 'cellCenterAlign'
};

export const CREATED_BY_USER_COL = {
  headerName: 'Created by user',
  field: 'creatorId'
};

export const CREATED_DATE_AND_TIME_COL = {
  headerName: 'Created date and time',
  field: 'createTimestamp',
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  }
};

export const MODIFIED_BY_USER_COL = {
  headerName: 'Modified by user',
  field: 'lastChangeId'
};

export const MODIFIED_DATE_AND_TIME_COL = {
  headerName: 'Modified date and time',
  field: 'lastChangedTimestamp',
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  }
};

export const BLOCK_DATA_COL = {
  field: 'blockData',
  hide: true,
  suppressFiltersToolPanel: true,
  suppressColumnsToolPanel: true,
  menuTabs: []
};

export const LOCK_STATUS_COL = {
  headerName: 'Lock status',
  field: 'lock',
  cellRenderer: 'lockItemRender',
  filter: 'lockTypeFilter'
};

export const LOCK_TYPE_COL = {
  headerName: 'Lock type',
  field: 'blockReasonCodeTxt'
};

export const LOCK_LAST_MODIFIED_COL = {
  headerName: 'Lock last modified',
  field: 'lastChangeTimeStamp',
  filterValueGetter: function (params) {
    return params.data && params.data.currentBlock?.creatorId
      ? params.data.currentBlock.creatorId
      : '';
  }
};

export const LOCK_EFFECTIVE_DATE_COL = {
  headerName: 'Lock effective date',
  field: 'startDate',
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  }
};

export const LOCK_END_DATE_COL = {
  headerName: 'Lock end date',
  field: 'endDate',
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  }
};

export const KEBAB_MENU_COL = {
  headerName: '',
  field: 'kabab',
  cellRenderer: 'btnKababRenderer',
  filter: false,
  width: 56,
  supressExcelExport: false,
  cellClass: 'kababmenu',
  resizable: false,
  maxWidth: 56,
  suppressFiltersToolPanel: true,
  suppressColumnsToolPanel: true,
  suppressMovable: true,
  lockPosition: true,
  lockPinned: true,
  sortable: false,
  pinned: 'right',
  enableRowGroup: false,
  menuTabs: []
};

export const COSTCO_RETAIL_COL = {
  headerName: 'Costco retail',
  field: 'costcoAmount',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  valueFormatter: currencyFormatter,
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  comparator: currencyComparator
};

export const COSTCO_RETAIL_UPDATED_COL = {
  headerName: 'Costco retail updated',
  field: 'costcoDate',
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  },
  cellClass: 'numberAlign'
};

export const BJS_RETAIL_COL = {
  // eslint-disable-next-line quotes
  headerName: "BJ's retail",
  field: 'bjsAmount',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  valueFormatter: currencyFormatter,
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  headerClass: 'normalizedHeaderText',
  comparator: currencyComparator
};

export const BJS_RETAIL_UPDATED_COL = {
  // eslint-disable-next-line quotes
  headerName: "BJ's retail updated",
  field: 'bjsDate',
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  },
  cellClass: 'numberAlign',
  headerClass: 'normalizedHeaderText'
};

export const COSTCO_MINT_RETAIL_COL = {
  headerName: 'Costco.com retail',
  field: 'costcoMintAmount',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  valueFormatter: currencyFormatter,
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  comparator: currencyComparator
};

export const COSTCO_MINT_RETAIL_UPDATED_COL = {
  headerName: 'Costco.com retail updated',
  field: 'costcoMintDate',
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  },
  cellClass: 'numberAlign'
};

export const AMAZON_MINT_RETAIL_COL = {
  headerName: 'Amazon.com retail',
  field: 'amazonMintAmount',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  valueFormatter: currencyFormatter,
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  comparator: currencyComparator
};

export const AMAZON_MINT_RETAIL_UPDATED_COL = {
  headerName: 'Amazon.com retail updated',
  field: 'amazonMintDate',
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  },
  cellClass: 'numberAlign'
};

export const WALMART_MINT_RETAIL_COL = {
  headerName: 'Walmart.com retail',
  field: 'walmartMintAmount',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  valueFormatter: currencyFormatter,
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  comparator: currencyComparator
};

export const WALMART_MINT_RETAIL_UPDATED_COL = {
  headerName: 'Walmart.com retail updated',
  field: 'walmartMintDate',
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  },
  cellClass: 'numberAlign'
};

export const BESTBUY_MINT_RETAIL_COL = {
  headerName: 'Bestbuy.com retail',
  field: 'bestBuyMintAmount',
  filter: 'agNumberColumnFilter',
  filterParams: { defaultOption: 'inRange' },
  valueFormatter: currencyFormatter,
  enableValue: true,
  allowedAggFuncs: allowedAggFns,
  cellClass: 'numberAlign',
  comparator: currencyComparator
};

export const BESTBUY_MINT_RETAIL_UPDATED_COL = {
  headerName: 'Bestbuy.com retail updated',
  field: 'bestBuyMintDate',
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  comparator: dateComparator,
  filterParams: {
    comparator: dateFilter
  },
  cellClass: 'numberAlign'
};
