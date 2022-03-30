import { useHasFeature } from '@utils/useHasFeature';
import { getCountryCode } from '../../../services/getConfig';

export const getUploadTypes = (bulk_upload_types) => {
  const country = getCountryCode();

  const checkFlag = (flag: string) => {
    const flagValue = `${getCountryCode()}_${flag}`;
    return useHasFeature(flagValue);
  };
  switch (country) {
    case 'MX':
    case 'CN':
      if (checkFlag('RETAIL_DOWNLOAD_TEMPLATE') && checkFlag('LOCK_DOWNLOAD_TEMPLATE')) {
        return bulk_upload_types;
      } else if (checkFlag('RETAIL_DOWNLOAD_TEMPLATE')) {
        return bulk_upload_types.filter((v) => v.title === 'retails');
      } else if (checkFlag('LOCK_DOWNLOAD_TEMPLATE')) {
        return bulk_upload_types.filter((v) => v.title === 'locks');
      } else return null;
    case 'US':
      if (
        (useHasFeature('US_RETAIL_IMMEDIATE_DOWNLOAD_TEMPLATE') ||
          useHasFeature('US_RETAIL_OVERNIGHT_DOWNLOAD_TEMPLATE')) &&
        useHasFeature('US_LOCK_DOWNLOAD_TEMPLATE')
      ) {
        return bulk_upload_types;
      } else if (
        useHasFeature('US_RETAIL_IMMEDIATE_DOWNLOAD_TEMPLATE') ||
        useHasFeature('US_RETAIL_OVERNIGHT_DOWNLOAD_TEMPLATE')
      ) {
        return bulk_upload_types.filter((v) => v.title === 'retails');
      } else if (useHasFeature('US_LOCK_DOWNLOAD_TEMPLATE')) {
        return bulk_upload_types.filter((v) => v.title === 'locks');
      } else return null;
    default:
      return null;
  }
};
