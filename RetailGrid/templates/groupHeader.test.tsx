/* eslint-disable max-len */
import { groupHeaderTemplate } from './groupHeader';

describe('group header', () => {
  it('should return template for groupState defined', () => {
    const groupState = true;
    const headerTemplate = groupHeaderTemplate(groupState);
    expect(headerTemplate).toEqual(
      // eslint-disable-next-line quotes
      `<div class="ag-cell-label-container" role="presentation">  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>  <div ref="eLabel" class="ag-header-cell-label" role="presentation"><i class="ag-icon ag-icon-tree-open" onclick="agHandleClick(event)"></i>    <span ref="eText" class="ag-header-cell-text" style="padding-left:14px" role="columnheader"></span>  </div></div>`
    );
  });
  it('should return template for groupState not defined', () => {
    const groupState = undefined;
    const headerTemplate = groupHeaderTemplate(groupState);
    expect(headerTemplate).toEqual(
      // eslint-disable-next-line quotes
      `<div class="ag-cell-label-container" role="presentation">  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>  <div ref="eLabel" class="ag-header-cell-label" role="presentation"><i class="ag-icon ag-icon-tree-closed" onclick="agHandleClick(event)"></i>    <span ref="eText" class="ag-header-cell-text" style="padding-left:14px" role="columnheader"></span>  </div></div>`
    );
  });
});
