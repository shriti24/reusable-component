import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import { Table } from './table';
import {
  getRetailsData,
  getCompetitiorsData,
  getSalesData
} from '../../services/retail/retailInquiryService';
import { Loader } from '../../components/common/Loader';
// Util
import { constructRetailData, constructComp } from './util/genRetailData';
import { status, hearderOptions, salesHeaders, COMPETITOR_HEADERS } from './util/constants';
import { ColumnDetails } from './RetailColumn';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridColumn } from 'ag-grid-react';
import { makeStyles } from '@material-ui/core';
import { GridContextAPI } from './contextAPI';
import {
  setColumnChangeRetailData,
  removeColumnIdFromRetailData
} from '../../actions/commonActions';
import { setDrawerState } from '../../actions/recommendationActions';
import styles from './retailGrid.module.css';
import { getDeniedClubs } from '../../services/markdownRuleService';
import { useHasFeature } from '@utils/useHasFeature';
import useToastFeature from '@utils/useToastFeature';
import { getCountryCode } from '../../services/getConfig';
import { mockRetailData } from 'src/services/retail/mockData';
import { gridDetails } from './util/tourData/tourMockData';

const defaultColSize = 130;
const defaultKebabColSize = 56;
const useStyles = makeStyles(() => ({
  loader: {
    marginTop: '24%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  noRetailItem: {
    marginTop: '24%',
    fontSize: '16px',
    textAlign: 'center'
  }
}));

export const renderStatusCell = (params) => {
  const { value } = params;
  if (value === status.FUTURE) {
    return `<span class=${styles.futureStatus}>
        ${value}
      </span>`;
  } else if (value === status.BLOCKED) {
    return `<span class=${styles.blockedStatus}>
        Blocked
      </span>`;
  }
  return value;
};

type InfoProps = {
  items: number[];
  setSelectedRetailData: any;
  isRetailTour: boolean;
  showTable: React.Dispatch<React.SetStateAction<boolean>>;
};

const RetailGrid: React.FC<InfoProps> = (props) => {
  const _gridContext = React.useContext(GridContextAPI);
  const [retailData, setRetailData] = React.useState([]);
  const [gridApi, setGridApi] = useState(null);

  const [gridColumnApi, setGridColumnApi] = useState(null);
  const selectedItems = props.items;
  const classes = useStyles({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasRowData, setHasRowData] = useState(false);
  const [isRowsGroupsExpanded, setIsRowsGroupsExpanded] = useState(true);
  const { addAlert } = useToastFeature();
  const week = hearderOptions[0].value.split(' ')[0];

  const dispatch = useDispatch();
  const columnData = useSelector((state: RootStateOrAny) => {
    return state.common.getColumnRetailData;
  });

  let expand = true;

  useEffect(() => {
    if (props.items) {
      setIsLoading(true);
      getCompData();
      _gridContext.getReasonData();
      getRetailData();
    }
  }, [props.items]);

  // useEffect(() => {
  //   setIsLoading(true);
  // }, []);

  // useEffect(() => {
  //   if (hasRowData) {
  //     setIsLoading(false);
  //   }
  // }, [hasRowData]);

  const getCompData = async () => {
    let competitorResult = await getCompetitiorsData();
    if (competitorResult !== null && competitorResult !== undefined) {
      constructComp(competitorResult);
      competitorResult = competitorResult?.competitorList?.map(function (item) {
        return {
          headerName: item.compName,
          field: item.compName.toLowerCase(),
          sortable: true,
          cellRenderer: 'compRender',
          cellClass: 'cellCenterAlign'
        };
      });
      Array.prototype.push.apply(ColumnDetails(), competitorResult);
    } else {
      addAlert('Error occurred while fetching Competitors', 'error');
    }
  };
  const checkSalesFlag = (duplicate, field) => {
    if (getCountryCode() === 'US' && !useHasFeature('US_SALES_DATA')) {
      return !duplicate && !salesHeaders.includes(field);
    }
    return !duplicate;
  };
  /* To remove duplicate objects from the array */
  const removeDuplicates = (arraySet) => {
    const filterDuplicate = new Set();
    const data = arraySet.filter((el) => {
      const duplicate = filterDuplicate.has(el.headerName);
      filterDuplicate.add(el.headerName);
      /* Remove the checkSalesFlag function and uncomment return value after sales data columns added for all markets */
      return checkSalesFlag(duplicate, el.field);
      // return !duplicate;
    });
    return data;
  };
  const getRetailData = async () => {
    let result, salesResult;
    if (props.isRetailTour) {
      result = gridDetails;
      const generatedData = constructRetailData(result.retailInquiryGridInfoList, null);
      setRetailData(generatedData);
      setHasRowData(true);
      setIsLoading(false);
    } else {
      if (useHasFeature('US_SALES_DATA')) {
        [result, salesResult] = await Promise.all([
          getRetailsData(selectedItems),
          getSalesData(selectedItems, week)
        ]);
      } else {
        result = await getRetailsData(selectedItems);
      }
      setIsLoading(false);
      if (
        result.retailInquiryGridInfoList !== null &&
        result.retailInquiryGridInfoList !== undefined
      ) {
        const generatedData = constructRetailData(
          result.retailInquiryGridInfoList,
          salesResult ? salesResult.salesData : null
        );
        props.setSelectedRetailData(generatedData);
        await updateMarkdownRulesToRetailData(generatedData);

        setHasRowData(true);
        setIsLoading(false);
      } else {
        props.setSelectedRetailData([]);
        setHasRowData(false);
        setIsLoading(false);
      }
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
    // getRetailData();
    let _window: Window = window;
    _window['agHandleClick'] = (event) => {
      groupExCol(params);
    };
  };

  /**
   *
   * @param colIds : list of column ids
   * @description : get coumn list which has been autosize and stored in redux store.
   */
  const getColumnWidthChangeIds = (colIds) => {
    dispatch(setColumnChangeRetailData([...new Set([...columnData, ...colIds])]));
  };

  /**
   *
   * @param colId: column id
   * @description: remove column id which has been resized from params.source === "uiColumnDragged"
   */
  const removeColumnIdOnUiColumnDrag = (colId) => {
    const filterData = columnData.filter((key) => key !== colId);
    dispatch(removeColumnIdFromRetailData(filterData));
  };

  // expand collapse all group header functionality
  const groupExCol = (params) => {
    expand ? params.api.collapseAll() : params.api.expandAll();
    expand = !expand;
    setIsRowsGroupsExpanded(expand);
  };

  const updateMarkdownRulesToRetailData = async (selectedValues) => {
    let modifiedRetailData = [];
    if (selectedValues.length > 0) {
      const clubArray = selectedValues.map(({ clubNbr }) => clubNbr);
      const itemRequestObj = { [selectedValues[0].itemNbr]: clubArray };
      if (useHasFeature('SHOW_MARKDOWN_RULES')) {
        getDeniedClubs(itemRequestObj)
          .then((res) => {
            const deniedClubs = [];
            const markDownData = [];
            const deniedData = res.data;
            if (deniedData && Object.keys(deniedData).length !== 0) {
              Object.keys(deniedData[selectedValues[0].itemNbr]).forEach((key) => {
                deniedData[selectedValues[0].itemNbr][key].map((club) => deniedClubs.push(club));
                markDownData.push({
                  ruleId: key,
                  clubs: deniedData[selectedValues[0].itemNbr][key]
                });
              });
              modifiedRetailData = selectedValues.map((obj) => {
                const markDownDetails = deniedClubs.includes(obj.clubNbr)
                  ? {
                      markDownDenied: true,
                      ruleId: markDownData.find((mdObj) => mdObj.clubs.includes(obj.clubNbr)).ruleId
                    }
                  : {
                      markDownDenied: false,
                      ruleId: ''
                    };
                return { ...obj, markDown: markDownDetails };
              });
              setRetailData(modifiedRetailData);
            } else {
              modifiedRetailData = selectedValues.map((obj) => {
                const markDownDetails = {
                  markDownDenied: false,
                  ruleId: ''
                };
                return { ...obj, markDown: markDownDetails };
              });
              setRetailData(modifiedRetailData);
            }
          })
          .catch((err) => {
            setRetailData(selectedValues);
            console.log(err);
            addAlert('Error occurred while fetching Markdown Rules.', 'error');
          });
      } else {
        modifiedRetailData = selectedValues.map((obj) => {
          const markDownDetails = {
            markDownDenied: false,
            ruleId: ''
          };
          return { ...obj, markDown: markDownDetails };
        });
        setRetailData(modifiedRetailData);
      }
    }
  };

  useEffect(() => {
    if (_gridContext.refresh) {
      getRetailData();
    }
  }, [_gridContext.refresh]);

  // default kebab column size
  const getDefaultColSize = (field) => {
    return field.toLowerCase() === 'kabab' ? defaultKebabColSize : defaultColSize;
  };

  // is tool panel visible on the right of the grid
  const isToolPanelShowing = () => {
    return gridApi ? gridApi.isToolPanelShowing() : false;
  };

  const checkCompetitorsColumn = (columnDetails) => {
    if (!useHasFeature('COMPETITORS_COLUMN')) {
      return columnDetails.filter((column) => !COMPETITOR_HEADERS.includes(column.headerName));
    }
    return columnDetails;
  };

  useEffect(() => {
    // calculate the kebab column width dynamically
    if (gridColumnApi && gridApi && _gridContext.selectedType.toUpperCase() !== 'DELETE') {
      const sidePanelWidth = 355;
      const withSidePanel = defaultKebabColSize + 65;
      const finalColWidth = _gridContext.selectedType
        ? !isToolPanelShowing()
          ? sidePanelWidth + 20
          : withSidePanel
        : defaultKebabColSize;
      gridColumnApi.setColumnWidth('kabab', finalColWidth, true);
    }
  }, [_gridContext.selectedType]);

  return (
    <div className={styles.wrapper}>
      {isLoading && <Loader />}
      {hasRowData && (
        <>
          <Table
            tableData={retailData}
            onGridReady={onGridReady}
            groupState={isRowsGroupsExpanded}
            getColumnWidthChangeIds={getColumnWidthChangeIds}
            removeColumnIdOnUiColumnDrag={removeColumnIdOnUiColumnDrag}
            gridApi={gridApi}
            gridColumnApi={gridColumnApi}
            selectedItems={selectedItems}
            showTable={props.showTable}
          >
            {removeDuplicates(checkCompetitorsColumn(ColumnDetails())).map((col) => {
              if (col.field === 'status')
                return (
                  <AgGridColumn
                    key={col.field}
                    cellRenderer={renderStatusCell}
                    {...col}
                    minWidth={getDefaultColSize(col.field)}
                  />
                );
              else
                return (
                  <AgGridColumn key={col.field} {...col} minWidth={getDefaultColSize(col.field)} />
                );
            })}
          </Table>
        </>
      )}

      {!hasRowData && (
        <div
          data-testid="no-retail-found-container"
          className={classes.noRetailItem}
        >{`No retails found for item number ${selectedItems.join(',')}`}</div>
      )}
    </div>
  );
};

export default RetailGrid;
