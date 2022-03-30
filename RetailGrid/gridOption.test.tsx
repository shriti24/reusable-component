import gridOptions from './gridOptions';

describe('grid option', () => {
  it('should define', () => {
    expect(gridOptions).toHaveProperty('defaultColDef');
  });
  describe('getMainMenuItems', () => {
    const setColumnPinnedMock = jest.fn();
    const mainMenuItem = gridOptions.getMainMenuItems({
      defaultItems: ['pinSubMenu'],
      columnApi: { setColumnPinned: setColumnPinnedMock },
      column: { colId: 0, pinned: false }
    });

    it('should get main menu items', () => {
      expect(mainMenuItem[0].name).toEqual('Pin Column');
      expect(mainMenuItem[0].subMenu[0].name).toEqual('Pin Left');
      mainMenuItem[0].subMenu[0].action();
      expect(setColumnPinnedMock).toHaveBeenCalledTimes(1);
      expect(setColumnPinnedMock).toHaveBeenCalledWith(0, 'left');
      setColumnPinnedMock.mockReset();
      expect(mainMenuItem[0].subMenu[1].name).toEqual('No Pin');
      mainMenuItem[0].subMenu[1].action();
      expect(setColumnPinnedMock).toHaveBeenCalledTimes(1);
      expect(setColumnPinnedMock).toHaveBeenCalledWith(0, null);
    });
  });
  describe('onColumnPinned', () => {
    const setColumnPinnedMock = jest.fn();

    beforeEach(() => {
      setColumnPinnedMock.mockReset();
    });

    it('should call setColumnPinned with column id if column pinned on right', () => {
      gridOptions.onColumnPinned({
        pinned: 'right',
        columnApi: { setColumnPinned: setColumnPinnedMock },
        column: { colId: 0 }
      });
      expect(setColumnPinnedMock).toHaveBeenCalledTimes(1);
      expect(setColumnPinnedMock).toHaveBeenCalledWith(0, null);
    });
    it('should not call setColumnPinned with column id if column pinned is other than right', () => {
      gridOptions.onColumnPinned({
        pinned: 'left',
        columnApi: { setColumnPinned: setColumnPinnedMock },
        column: { colId: 0 }
      });
      expect(setColumnPinnedMock).not.toHaveBeenCalled();
    });
  });
});
