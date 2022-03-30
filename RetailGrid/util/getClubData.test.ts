import { getClubDetails } from './getClubData';

const clubData = {
  clubName: 'FLORENCE, AL',
  marketAreaName: 'AL / MS / N. FL / GA',
  marketAreaNumber: 24,
  regionName: 'Mississippi Valley',
  stateProvCode: 'AL',
  type: 'Club'
};

describe('Club Data', () => {
  test('get Club Data', () => {
    const obj = {
      marketAreaNumber: 24,
      regionName: 'Mississippi Valley',
      stateProvCode: 'AL',
      type: 'Club'
    };
    expect(getClubDetails(clubData)).toStrictEqual(obj);
  });
  test('get Club data for empty value', () => {
    const obj = {
      marketAreaNumber: '',
      regionName: '',
      stateProvCode: '',
      type: ''
    };
    expect(getClubDetails(null)).toStrictEqual(obj);
  });
});
