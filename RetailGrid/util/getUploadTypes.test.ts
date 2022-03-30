import { jest } from '@jest/globals';
import * as utils from '../../../services/getConfig';
import * as flag from '@utils/useHasFeature';
import { getUploadTypes } from './getUploadTypes';

// jest.mock("@utils/useHasFeature", () => ({
//     useHasFeature: jest.fn(),
//   }));

const bulk_upload_types = [
  {
    title: 'retails',
    value: 'Bulk retail upload'
  },
  {
    title: 'locks',
    value: 'Bulk lock upload'
  }
];
// jest.mock('@utils/useHasFeature', () => {
//     return {
//         useHasFeature: ('US') => (true)
//     }
// })

describe('Get Upload Types', () => {
  test('Check immediate template', () => {
    jest.spyOn(flag, 'useHasFeature').mockReturnValue(true);
    jest.spyOn(utils, 'getCountryCode').mockReturnValue('US');
    expect(getUploadTypes(bulk_upload_types)).toBeInstanceOf(Array);
  });
  test('Check template for MX', () => {
    jest.spyOn(flag, 'useHasFeature').mockReturnValue(true);
    jest.spyOn(utils, 'getCountryCode').mockReturnValue('MX');
    expect(getUploadTypes(bulk_upload_types)).toBeInstanceOf(Array);
  });
  test('Check template for CN', () => {
    jest.spyOn(flag, 'useHasFeature').mockReturnValue(true);
    jest.spyOn(utils, 'getCountryCode').mockReturnValue('CN');
    expect(getUploadTypes(bulk_upload_types)).toBeInstanceOf(Array);
  });
  test('Check template to null', () => {
    jest.spyOn(flag, 'useHasFeature').mockReturnValue(false);
    jest.spyOn(utils, 'getCountryCode').mockReturnValue('');
    expect(getUploadTypes(bulk_upload_types)).toBe(null);
  });
  test('Check template for MX', () => {
    jest.spyOn(flag, 'useHasFeature').mockReturnValue(false);
    jest.spyOn(utils, 'getCountryCode').mockReturnValue('MX');
    expect(getUploadTypes(bulk_upload_types)).toBe(null);
  });
  test('Check template for US', () => {
    jest.spyOn(flag, 'useHasFeature').mockReturnValue(false);
    jest.spyOn(utils, 'getCountryCode').mockReturnValue('US');
    expect(getUploadTypes(bulk_upload_types)).toBe(null);
  });
  test('Check immediate template', () => {
    jest
      .spyOn(flag, 'useHasFeature')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    jest.spyOn(utils, 'getCountryCode').mockReturnValue('US');
    expect(getUploadTypes(bulk_upload_types)).toBeInstanceOf(Array);
  });
  test('Check immediate template', () => {
    jest
      .spyOn(flag, 'useHasFeature')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    jest.spyOn(utils, 'getCountryCode').mockReturnValue('MX');
    expect(getUploadTypes(bulk_upload_types)).toBeInstanceOf(Array);
  });
  test('Check immediate template', () => {
    jest
      .spyOn(flag, 'useHasFeature')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    jest.spyOn(utils, 'getCountryCode').mockReturnValue('MX');
    expect(getUploadTypes(bulk_upload_types)).toBeInstanceOf(Array);
  });
  test('Check immediate template', () => {
    jest
      .spyOn(flag, 'useHasFeature')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    jest.spyOn(utils, 'getCountryCode').mockReturnValue('US');
    expect(getUploadTypes(bulk_upload_types)).toBeInstanceOf(Array);
  });
  test('Check immediate template', () => {
    jest
      .spyOn(flag, 'useHasFeature')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    jest.spyOn(utils, 'getCountryCode').mockReturnValue('US');
    expect(getUploadTypes(bulk_upload_types)).toBeInstanceOf(Array);
  });
});
