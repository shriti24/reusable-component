export const getClubDetails = (clubLocationDetails: any) => {
  return {
    type: clubLocationDetails !== null ? clubLocationDetails.type : '',
    regionName: clubLocationDetails !== null ? clubLocationDetails.regionName : '',
    marketAreaNumber: clubLocationDetails !== null ? clubLocationDetails.marketAreaNumber : '',
    stateProvCode: clubLocationDetails !== null ? clubLocationDetails.stateProvCode : ''
  };
};
