import { dataTypeCheck, getRandomInt, lockDurationArr, priceArr } from './dataTypeCheck';

describe('dataTypeCheck', () => {
  it('getRandomInt - should get random numbers within the provided max digit', () => {
    expect(getRandomInt(10) <= 10).toEqual(true);
  });
  it('dataTypeCheck - should return 1172 if data type id itemNbr', () => {
    expect(dataTypeCheck('itemNbr')).toEqual(1172);
  });
  it('dataTypeCheck - should return Complete dog Food Pedigree 55lb if data type id itemDesc', () => {
    expect(dataTypeCheck('itemDesc')).toEqual('Complete dog Food Pedigree 55lb');
  });
  it('dataTypeCheck - should return 1 - Dry goods if data type id cat', () => {
    expect(dataTypeCheck('cat')).toEqual('1 - Dry goods');
  });
  it('dataTypeCheck - should return 19 - Dog food if data type id subCat', () => {
    expect(dataTypeCheck('subCat')).toEqual('19 - Dog food');
  });
  it('dataTypeCheck - should return digit less than 8000 if data type id clubNbr', () => {
    expect(dataTypeCheck('clubNbr') <= 8000).toEqual(true);
  });
  it('dataTypeCheck - should return a priceArr amount if data type id retailAmount', () => {
    expect(priceArr.indexOf(dataTypeCheck('retailAmount') as string) !== -1).toEqual(true);
  });
  it('dataTypeCheck - should return a dateArr date if data type id effectiveDate', () => {
    const dateArr = ['6/20/21', '7/4/21', '6/10/21', '5/1/21', '6/4/21', '6/13/21'];
    expect(dateArr.indexOf(dataTypeCheck('effectiveDate') as string) !== -1).toEqual(true);
  });
  it('dataTypeCheck - should return a retailReasonArr value if data type id retailReason', () => {
    const retailReasonArr = ['Cost Change', 'Price Investment', 'Markdown'];
    expect(retailReasonArr.indexOf(dataTypeCheck('retailReason') as string) !== -1).toEqual(true);
  });
  it('dataTypeCheck - should return Bryan Solero 06/20/21 value if data type id creatorId', () => {
    expect(dataTypeCheck('creatorId')).toEqual('Bryan Solero 06/20/21');
  });
  it('dataTypeCheck - should return Current value if data type id status', () => {
    expect(dataTypeCheck('status')).toEqual('Current');
  });
  it('dataTypeCheck - should return a retailTypeArr value if data type id retailTypeTxt', () => {
    const retailTypeArr = ['Site', 'Distribution center', 'Ecomm fullfillment', 'Club'];
    expect(retailTypeArr.indexOf(dataTypeCheck('retailTypeTxt') as string) !== -1).toEqual(true);
  });
  it('dataTypeCheck - should return a regionArr value if data type id regionName', () => {
    const regionArr = ['Ecommerce', 'Mississippi Valley', 'South central'];
    expect(regionArr.indexOf(dataTypeCheck('regionName') as string) !== -1).toEqual(true);
  });
  it('dataTypeCheck - should return 998 value if data type id market', () => {
    expect(dataTypeCheck('market')).toEqual(998);
  });
  it('dataTypeCheck - should return TN value if data type id stateProvCode', () => {
    expect(dataTypeCheck('stateProvCode')).toEqual('TN');
  });
  it('dataTypeCheck - should return TN value if data type id orderableCost', () => {
    expect(priceArr.indexOf(dataTypeCheck('orderableCost') as string) !== -1).toEqual(true);
  });
  it('dataTypeCheck - should return value less than 600 if data type id orderableQty', () => {
    expect(dataTypeCheck('orderableQty') <= 600).toEqual(true);
  });
  it('dataTypeCheck - should return value less than 600 if data type id whpkSellAmt', () => {
    expect(priceArr.indexOf(dataTypeCheck('whpkSellAmt') as string) !== -1).toEqual(true);
  });
  it('dataTypeCheck - should return value -39.76% if data type id margin', () => {
    expect(dataTypeCheck('margin')).toEqual('-39.76%');
  });
  it('dataTypeCheck - should return value -78 if data type id onHandQty', () => {
    expect(dataTypeCheck('onHandQty')).toEqual('-78');
  });
  it('dataTypeCheck - should return value less than 2000 if data type id onOrderQty', () => {
    expect(dataTypeCheck('onOrderQty') <= 2000).toEqual(true);
  });
  it('dataTypeCheck - should return value 0 if data type id claimOnHandQty', () => {
    expect(dataTypeCheck('claimOnHandQty')).toEqual(0);
  });
  it('dataTypeCheck - should return a dateArr date value if data type id itemOnShelfDate', () => {
    const dateArr = ['6/20/21', '7/4/21', '6/10/21', '5/1/21', '6/4/21', '6/13/21'];
    expect(dateArr.indexOf(dataTypeCheck('itemOnShelfDate') as string) !== -1).toEqual(true);
  });
  it('dataTypeCheck - should return a dateArr date value if data type id oosd', () => {
    const dateArr = ['6/20/21', '7/4/21', '6/10/21', '5/1/21', '6/4/21', '6/13/21'];
    expect(dateArr.indexOf(dataTypeCheck('oosd') as string) !== -1).toEqual(true);
  });
  it('dataTypeCheck - should return a marketArr value if data type id piMarket', () => {
    const marketArr = [
      'Dallas, TX-full',
      'El Paso, TX - mini',
      'No Pi Market',
      'Georgetown, TX - mini',
      'Jacksonville, TX - mini',
      'Rancho Cucamonga, CA - Mini'
    ];
    expect(marketArr.indexOf(dataTypeCheck('piMarket') as string) !== -1).toEqual(true);
  });
  it('dataTypeCheck - should return a lockTypeArr value if data type id blockReasonCodeTxt', () => {
    const lockTypeArr = ['Price investment', 'Disaster'];
    expect(lockTypeArr.indexOf(dataTypeCheck('blockReasonCodeTxt') as string) !== -1).toEqual(true);
  });
  it('dataTypeCheck - should return a lockTypeArr date value if data type id lockDuration', () => {
    expect(lockDurationArr.indexOf(dataTypeCheck('lockDuration') as string) !== -1).toEqual(true);
  });
  it('dataTypeCheck - should return an array of object if data type id blockData', () => {
    expect(dataTypeCheck('blockData')).toEqual([
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
    ]);
  });
  it('dataTypeCheck - should return an empty value if invalid value provided', () => {
    expect(dataTypeCheck('testtesttest')).toEqual('');
  });
});
