import React, { useRef, useState, useEffect, FC } from 'react';
import { AgGridReact } from 'ag-grid-react';
import _ from 'underscore';
import ProgressBar from '../common/ts/ProgressBar';
import KababMenu from './KababMenu';

// Context API
import { GridContextAPI } from './contextAPI';

// Permission
import Can from '../Can/permission';
import { staticPermission } from '../../constants/RoleBaseRules';

import InitialGridOptions from './gridOptions';
import CustomViewsPanel from './customPanel/customViewsPanel';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import ShowAction from './kebabActions/ShowAction';
import { useHasFeature } from '@utils/useHasFeature';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { groupHeaderTemplate } from './templates/groupHeader';
import LockClosed from '../../../public/static/LockClosed.svg';
import ScheduledLock from '../../../public/static/ScheduledLock.svg';
import { Icon } from '@material-ui/core';
import style from './retailGrid.module.css';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import {
  setCurrentViewOrder,
  setGridLoaded,
  setGridUpdated
} from '../../actions/selectedViewsActions';
import TopHeader from './TopHeader';
import LocationType from './locationType';
import LockFilter from './lockFilter';
import { showTooltip } from './util/showTooltip';
import Tooltip from '@material-ui/core/Tooltip';

import { isAdmin, isMerchandising, isRestricted } from '../common/HelperFunctions/CanValidator';
import { getSalesData } from '../../services/retail/retailInquiryService';
import { checkSalesData } from './util/genRetailData';
import { salesHeaders } from './util/constants';
import useToastFeature from '@utils/useToastFeature';
import { getSalesCoordinates } from './util/getSalesCoordinates';
import { renderEffectiveDateTime } from '@utils/retailEffectiveTiming/getRetailEffectiveDateTime';

interface ITable {
  tableData: unknown[];
  // columnData: unknown[];
  // eslint-disable-next-line no-unused-vars
  onGridReady(params: unknown): void;
  getColumnWidthChangeIds(colIds: unknown): void;
  removeColumnIdOnUiColumnDrag(colId: unknown): void;
  groupState: boolean;
  gridColumnApi: any;
  gridApi: any;
  selectedItems: any;
  showTable: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Table: FC<ITable> = ({
  tableData,
  onGridReady,
  getColumnWidthChangeIds,
  removeColumnIdOnUiColumnDrag,
  groupState,
  gridColumnApi,
  gridApi,
  selectedItems,
  children,
  showTable
}) => {
  const _tableRef = useRef(null);
  const _gridContext = React.useContext(GridContextAPI);
  const [updatedView, setUpdatedView] = useState({});
  const [changeOrder, setChangeOrder] = useState(false);
  const [gridAlreadyLoaded, setGridAlreadyLoaded] = useState(false);
  const [salesCoordinates, setSalesCoordinates] = useState(new Map());
  const [autoGroupColumnDefminWidth, setAutoGroupColumnDefminWidth] = useState(200);
  const [showHeader, toggleHeader] = useState(false);
  const [initialResize, setResize] = useState(false);

  let intervalDebounceSAGCW = null;

  const dispatch = useDispatch();
  const { addAlert } = useToastFeature();
  const isMerchandisingUser = isMerchandising();
  const isRestrictedUser = isRestricted();

  const renderPI = (params) => {
    const isDataPresent = params.data && true;
    if (isDataPresent) {
      return params.data && params.data.piItem == true ? (
        <CheckIcon className={style.checkMark} />
      ) : (
        <CloseIcon style={{ color: '#9e9e9e' }} />
      );
    } else {
      return null;
    }
  };

  const renderCompetitor = (params) => {
    if (params) {
      if (params.value) {
        return <CheckIcon style={{ color: '#0071e9' }} />;
      } else {
        return <CloseIcon style={{ color: '#9e9e9e' }} />;
      }
    } else return null;
  };

  const renderLock = (params) => {
    if (params?.data?.currentBlock) {
      return (
        <Tooltip title={showTooltip(params, params.data.currentBlock)}>
          <Icon className={style.lock}>
            <img src={LockClosed} />{' '}
          </Icon>
        </Tooltip>
      );
    } else if (params?.data?.futureBlocks) {
      return (
        <Tooltip title={showTooltip(params, params.data.futureBlocks[0])}>
          <Icon className={style.lock} style={{ lineHeight: '50px' }}>
            <img src={ScheduledLock} />{' '}
          </Icon>
        </Tooltip>
      );
    } else {
      return null;
    }
  };
  const renderType = (params) => {
    return <LocationType params={params} />;
  };
  const renderKabab = (data, disableVert) => {
    const {
      status,
      clubNbr,
      itemNbr,
      retailType,
      retailReasonCodeTxt,
      retailTypeTxt,
      retailReason
    } = data;
    return (
      <KababMenu disableVert={disableVert}>
        <ShowAction
          index={1}
          status={status}
          propsData={''}
          itemNum={itemNbr}
          clubNum={clubNbr}
          retailRows={''}
          retail={{
            retailType: retailType,
            retailReasonCodeTxt: retailReasonCodeTxt,
            retailTypeTxt: retailTypeTxt,
            retailReason: retailReason
          }}
          checkCurrent={true}
          onActionSelect={(type) => {
            _gridContext.setType(type, data);
          }}
        />
      </KababMenu>
    );
  };
  const renderKababRoleBased = ({ data }) => {
    if (!data) return null;
    return (
      <Can
        perform={staticPermission.NEW_RETAIL_PATH}
        category={data.category}
        yes={() => renderKabab(data, disableKebab(data))}
        no={() => renderKabab(data, true)}
      />
    );
  };

  const disableKebab = ({
    retailType,
    retailReasonCodeTxt,
    country,
    status
  }: {
    retailType: string;
    retailReasonCodeTxt: string;
    country: string;
    status: string;
  }): boolean => {
    return (
      (isRestrictedUser && retailType !== 'CI') ||
      (country === 'MX' && status === 'Review' && (retailType === 'BP' || retailType === 'MD')) ||
      (isMerchandisingUser &&
        country === 'MX' &&
        (status === 'Review' || status === 'Current') &&
        retailType === 'BP') ||
      (isMerchandisingUser && (retailType === 'MD' || retailReasonCodeTxt === 'Price Investment'))
    );
  };

  const customStatsPanel = (gridOptions) => {
    return <CustomViewsPanel gridOptions={gridOptions} />;
  };

  const ViewPanel = useHasFeature('SAVE_USER_VIEW')
    ? [
        {
          id: 'customStats',
          labelDefault: 'Views',
          labelKey: 'customStats',
          iconKey: 'custom-stats',
          toolPanel: 'customStatsToolPanel'
        }
      ]
    : [];
  const customSideBar = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressPivotMode: true,
          suppressValues: false,
          suppressRowGroups: false,
          suppressPivots: true,
          suppressColumnSelectAll: true
        }
      },
      ...ViewPanel
    ],
    defaultToolPanel: 'columns'
  };

  const groupRowFormatter = (params) => {
    if (params && params.node && params.node.group) {
      const groupDef =
        params.node && params.node.rowGroupColumn
          ? params.node.rowGroupColumn.getUserProvidedColDef()
          : null;
      const displayLabel = groupDef ? groupDef.headerName + ': ' + params.value : params.value;
      return displayLabel;
    }
    return 'Club ' + params.value;
  };

  const isSelectedView = useSelector((state: RootStateOrAny) => {
    return state.selectedView.getSelectedView;
  });

  const gridViewStatus = useSelector((state: RootStateOrAny) => {
    return state.selectedView.gridItemLength;
  });

  const dataRendered = () => {
    dispatch(setGridLoaded(true));
    setGridAlreadyLoaded(true);
  };

  const onFilterChanged = (params) => {
    dispatch(setGridUpdated(false));
    const columnUpdated = {
      detail: {
        // set column width default pixel size
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        colState: params.columnApi.getColumnState(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filterState: params.api.getFilterModel()
      }
    };

    setUpdatedView(columnUpdated.detail);
    if (
      (!_.isEqual(isSelectedView.filterState, params.api.getFilterModel()) ||
        params.api.getDisplayedRowCount()) &&
      gridAlreadyLoaded
    ) {
      dispatch(setGridUpdated(true));
    }
  };

  const onViewportChanged = (params) => {
    setSalesCoordinates(getSalesCoordinates(params));
  };

  const onColumnMoved = (params) => {
    setSalesCoordinates(getSalesCoordinates(params));

    const columnUpdated = {
      detail: {
        // set column width default pixel size
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        colState: params.columnApi.getColumnState(),
        // colState: params.columnApi.getColumnState().map((item) => {
        //   if (item.colId.toLowerCase() === 'kabab') {
        //     return Object.assign({ ...item, width: 56 });
        //   }
        //   return item;
        // }),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filterState: params.api.getFilterModel()
      }
    };

    // condition where type = "columnResized" and source =  "autosizeColumns" in this get columns list
    // which has been autosize and autosizeall
    if (params.type === 'columnResized' && params.source === 'autosizeColumns') {
      const colIds = params.columns
        .map((item) => item.colId)
        .filter((key) => key.toLowerCase() !== 'kabab');
      getColumnWidthChangeIds(colIds);
    }

    // condition where type = "columnResized" and source =  "uiColumnDragged" in this get column
    // which has been uiColumnDragged
    if (params.type === 'columnResized' && params.source === 'uiColumnDragged') {
      const colId = params?.column?.colId;
      removeColumnIdOnUiColumnDrag(colId);
    }

    setUpdatedView(columnUpdated.detail);
    setChangeOrder(!changeOrder);
    dispatch(setCurrentViewOrder(true));
  };

  useEffect(() => {
    const onPageReload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    const onPageReloadDoNothing = (e) => {
      delete e['returnValue'];
    };
    if (!_.isEqual(isSelectedView, updatedView)) {
      window.addEventListener('beforeunload', onPageReload);
      return () => {
        window.removeEventListener('beforeunload', onPageReload);
      };
    } else {
      window.addEventListener('beforeunload', onPageReloadDoNothing);
    }
  }, [changeOrder]);

  const scrollEffect = (params) => {
    if (!initialResize && salesCoordinates && salesCoordinates['data']?.length) {
      setResize(true);
    }
    setSalesCoordinates(getSalesCoordinates(params));
  };

  const debounceSetAutoGroupColumnDefnWidth = (params) => {
    if (intervalDebounceSAGCW) {
      clearTimeout(intervalDebounceSAGCW);
    }
    intervalDebounceSAGCW = setTimeout(() => {
      setAutoGroupColumnDefminWidth(params?.column?.actualWidth);
      setSalesCoordinates(getSalesCoordinates(params));
    }, 100);
  };

  const resizesColumn = (params) => {
    if (params?.column?.colId === 'ag-Grid-AutoColumn') {
      debounceSetAutoGroupColumnDefnWidth(params);
      return;
    }
    setSalesCoordinates(getSalesCoordinates(params));
  };
  const handleSalesDataChange = (value: string) => {
    setSalesData(value.split(' ')[0]);
  };

  const setSalesData = async (week: string) => {
    gridApi.showLoadingOverlay();
    const salesResult = await getSalesData(selectedItems, week);
    if (salesResult.errorMsg) {
      addAlert(salesResult.errorMsg, 'error');
    }
    const mapData = new Map();
    const salesData = salesResult.salesData;
    gridApi.forEachNode((rowNode) => {
      if (rowNode.data) {
        checkSalesData(rowNode.data.itemNbr, rowNode.data.clubNbr, salesData, mapData);
        const salesInfo = mapData.get(`${rowNode.data.itemNbr}_${rowNode.data.clubNbr}`);
        salesHeaders.forEach((element: string) => {
          rowNode.setDataValue(element, salesInfo ? salesInfo[element] : '');
        });
      }
    });
    gridApi.refreshClientSideRowModel();
    gridApi.hideOverlay();
  };

  useEffect(() => {
    if (salesCoordinates['data']?.length && !showHeader) {
      toggleHeader(true);
    }
  }, [salesCoordinates['data']?.length]);

  useEffect(() => {
    showTable(true);
  }, _tableRef.current);

  return (
    <div
      data-testid="retail-grid-table-container"
      className={'agGridTable ag-theme-alpine ag-retail-table'}
      style={{
        overflow: 'hidden',
        marginTop:
          showHeader && !salesCoordinates['data']?.length && initialResize ? '70px' : '30px'
      }}
    >
      <div className={style.noFilteredItem}>
        {gridViewStatus ? (
          <div className="noFilteredText">This View/Filter has no results</div>
        ) : (
          ''
        )}
      </div>
      {salesCoordinates && salesCoordinates['data']?.length && initialResize ? (
        <TopHeader handleSalesDataChange={handleSalesDataChange} coordinateMap={salesCoordinates} />
      ) : null}

      <AgGridReact
        onBodyScroll={scrollEffect}
        onColumnResized={resizesColumn}
        gridOptions={InitialGridOptions}
        defaultColDef={{
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          filterParams: { buttons: ['clear'] },
          sortable: true,
          resizable: true,
          minWidth: 100,
          filter: true,
          enableRowGroup: true
        }}
        groupDefaultExpanded={-1}
        autoGroupColumnDef={{
          width: autoGroupColumnDefminWidth,
          headerName: 'Row groups',
          pinned: 'left',
          suppressFiltersToolPanel: true,
          suppressColumnsToolPanel: true,

          suppressMovable: true,
          lockPosition: true,
          lockPinned: true,
          sortable: false,
          // enables filtering on the group column
          filter: false,
          field: 'clubNbr',
          resizable: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {
            innerRenderer: groupRowFormatter
          },
          headerComponentParams: {
            template: groupHeaderTemplate(groupState)
          }
        }}
        onFirstDataRendered={dataRendered}
        excelStyles={[
          {
            id: 'header',
            font: { bold: true }
          },
          {
            id: 'cell',
            alignment: { horizontal: 'Left' }
          }
        ]}
        rowData={tableData}
        frameworkComponents={{
          customLoadingOverlay: ProgressBar,
          btnKababRenderer: renderKababRoleBased,
          customStatsToolPanel: customStatsPanel,
          piItemRender: renderPI,
          lockItemRender: renderLock,
          typeItemRender: renderType,
          compRender: renderCompetitor,
          lockTypeFilter: LockFilter,
          effectiveDateTimeRender: renderEffectiveDateTime
        }}
        loadingOverlayComponent={'customLoadingOverlay'}
        noRowsOverlayComponent={'customLoadingOverlay'}
        onGridReady={onGridReady}
        ref={_tableRef}
        sideBar={customSideBar}
        onColumnMoved={onColumnMoved}
        onSortChanged={onColumnMoved}
        onFilterChanged={onFilterChanged}
        onColumnRowGroupChanged={onColumnMoved}
        onColumnEverythingChanged={onColumnMoved}
        multiSortKey={'ctrl'}
        onViewportChanged={onViewportChanged}
      >
        {children}
      </AgGridReact>
    </div>
  );
};
