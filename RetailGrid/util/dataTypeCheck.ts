export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

const dateArr = ['6/20/21', '7/4/21', '6/10/21', '5/1/21', '6/4/21', '6/13/21'];
export const priceArr = ['$4.67', '$5.69', '$3.53', '$2.00', '$5.53', '$4.44', '$5.08', '$3.57'];
const retailReasonArr = ['Cost Change', 'Price Investment', 'Markdown'];
const retailTypeArr = ['Site', 'Distribution center', 'Ecomm fullfillment', 'Club'];
const regionArr = ['Ecommerce', 'Mississippi Valley', 'South central'];
const marketArr = [
  'Dallas, TX-full',
  'El Paso, TX - mini',
  'No Pi Market',
  'Georgetown, TX - mini',
  'Jacksonville, TX - mini',
  'Rancho Cucamonga, CA - Mini'
];
const lockTypeArr = ['Price investment', 'Disaster'];
export const lockDurationArr = [
  '6/20/21',
  '6/20/21 - 8/15/20',
  '3/3/21 - 7/1/20',
  '8/20/21 - 9/15/20',
  '7/20/21 - 8/20/20'
];

export const dataTypeCheck = (type: string): string | number | unknown => {
  switch (type) {
    case 'itemNbr':
      return 1172;
    case 'itemDesc':
      return 'Complete dog Food Pedigree 55lb';
    case 'cat':
      return '1 - Dry goods';
    case 'subCat':
      return '19 - Dog food';
    case 'clubNbr':
      return getRandomInt(8000);
    case 'retailAmount':
      return priceArr[getRandomInt(priceArr.length)];
    case 'effectiveDate':
      return dateArr[getRandomInt(dateArr.length)];
    case 'retailReason':
      return retailReasonArr[getRandomInt(retailReasonArr.length)];
    case 'creatorId':
      return 'Bryan Solero 06/20/21';
    case 'status':
      return 'Current';
    case 'retailTypeTxt':
      return retailTypeArr[getRandomInt(retailTypeArr.length)];
    case 'regionName':
      return regionArr[getRandomInt(regionArr.length)];
    case 'market':
      return 998;
    case 'stateProvCode':
      return 'TN';
    case 'orderableCost':
      return priceArr[getRandomInt(priceArr.length)];
    case 'orderableQty':
      return getRandomInt(600);
    case 'whpkSellAmt':
      return priceArr[getRandomInt(priceArr.length)];
    case 'margin':
      return '-39.76%';
    case 'onHandQty':
      return '-78';
    case 'onOrderQty':
      return getRandomInt(2000);
    case 'claimOnHandQty':
      return 0;
    case 'itemOnShelfDate':
      return dateArr[getRandomInt(dateArr.length)];
    case 'oosd':
      return dateArr[getRandomInt(dateArr.length)];
    case 'piMarket':
      return marketArr[getRandomInt(marketArr.length)];
    case 'blockReasonCodeTxt':
      return lockTypeArr[getRandomInt(lockTypeArr.length)];
    case 'lockDuration':
      return lockDurationArr[getRandomInt(lockDurationArr.length)];
    case 'blockData':
      return [
        {
          itemNbr: '',
          itemDesc: '',
          clubNbr: '',
          retailAmount: '',
          effectiveDate: '',
          retailReason: '',
          creatorId: '',
          status: '',
          retailTypeTxt: '',
          regionName: '',
          stateProvCode: '',
          orderableCost: '',
          orderableQty: '',
          whpkSellAmt: '',
          margin: '',
          onHandQty: '88',
          onOrderQty: '',
          claimOnHandQty: '',
          itemOnShelfDate: '',
          itemOffShelfDate: '',
          lock: '',
          blockReasonCodeTxt: '',
          lastChangeTimeStamp: '',
          startDate: '',
          endDate: ''
        }
      ];
    default:
      return '';
  }
};
