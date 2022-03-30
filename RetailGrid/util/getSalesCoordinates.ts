export const getSalesCoordinates = (params) => {
  const viewportArr = params.columnApi.columnController.viewportColumns;
  let match = false;
  let prevMatch = '';
  const mapCoordinates = new Map();
  mapCoordinates['data'] = [];
  const viewportLeft = params.columnApi.columnController.viewportLeft;
  const leftWidth = params.columnApi.columnController.leftWidth;

  for (let leftPointer = 0; leftPointer < viewportArr.length; leftPointer++) {
    if (
      viewportArr[leftPointer].colId === 'totalCost' ||
      viewportArr[leftPointer].colId == 'totalSales' ||
      viewportArr[leftPointer].colId == 'totalUnits' ||
      viewportArr[leftPointer].colId == 'outOfStockDate'
    ) {
      let currWidth = viewportArr[leftPointer].actualWidth;
      let currStart = 0;

      if (match && prevMatch && mapCoordinates[prevMatch] != null) {
        const prevMatchArr = mapCoordinates[prevMatch];
        mapCoordinates[prevMatch].push(viewportArr[leftPointer].colId);
        currStart = prevMatchArr[0];
        currWidth += prevMatchArr[1];
      } else {
        currStart = viewportArr[leftPointer].left - viewportLeft + leftWidth;
      }
      if (currStart > 0) {
        mapCoordinates[viewportArr[leftPointer].colId] = [currStart, currWidth];
        match = true;
        prevMatch = viewportArr[leftPointer].colId;
      }
    } else {
      match = false;
      if (prevMatch) {
        mapCoordinates['data'].push(mapCoordinates[prevMatch]);
        prevMatch = '';
      }
    }
  }
  return mapCoordinates;
};
