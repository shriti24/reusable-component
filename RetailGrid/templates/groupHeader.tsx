export const groupHeaderTemplate = (groupState) => {
  return (
    '<div class="ag-cell-label-container" role="presentation">' +
    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
    (groupState
      ? '<i class="ag-icon ag-icon-tree-open" onclick="agHandleClick(event)"></i>'
      : '<i class="ag-icon ag-icon-tree-closed" onclick="agHandleClick(event)"></i>') +
    // '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
    // '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
    // '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
    // '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +

    //The line below is the key for achieving the solution
    '    <span ref="eText" class="ag-header-cell-text" style="padding-left:14px" role="columnheader"></span>' +
    // '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
    '  </div>' +
    '</div>'
  );
};
