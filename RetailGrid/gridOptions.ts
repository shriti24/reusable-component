import PinIcon from '../../icons/pin.svg';

export default {
  defaultColDef: {
    editable: false,
    enableRowGroup: false,
    enablePivot: true,
    enableValue: true,
    sortable: true,
    resizable: true,
    filter: false,
    floatingFilter: false,
    filterParams: { newRowsAction: 'keep' }
  },
  rowHeight: 52,
  enableSorting: true,
  enableFilter: true,
  suppressCellSelection: true,
  suppressRowClickSelection: true,
  suppressDragLeaveHidesColumns: true,
  groupSelectsChildren: true,
  debug: true,
  enableRangeSelection: true,
  pagination: true,
  paginationPageSize: 600,
  suppressContextMenu: true,
  suppressMoveWhenRowDragging: true,
  suppressColumnVirtualisation: false,
  getMainMenuItems: (params) => {
    const defItems = params.defaultItems.slice(0);
    const pinItem = {
      name: 'Pin Column',
      icon: `<img src="${PinIcon}" style="display: block"/>`,
      subMenu: [
        {
          name: 'Pin Left',
          checked: params.column.pinned === 'left',
          action: function () {
            params.columnApi.setColumnPinned(params.column.colId, 'left');
          }
        },
        {
          name: 'No Pin',
          checked: !params.column.pinned,
          action: function () {
            params.columnApi.setColumnPinned(params.column.colId, null);
          }
        }
      ]
    };
    const pinIndex = defItems.indexOf('pinSubMenu');
    defItems.splice(pinIndex, Number(pinIndex) + 1, pinItem);
    return defItems;
  },
  onColumnPinned: (params) => {
    if (params.pinned === 'right') {
      params.columnApi.setColumnPinned(params.column.colId, null);
    }
  }
};
