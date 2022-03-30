import { getCountryCode } from '../../../services/getConfig';
import US_RETAUL_COULMN from './column.us';
import MX_RETAUL_COULMN from './column.mx';
import CN_RETAUL_COULMN from './column.cn';

export const Columns = {
  US: US_RETAUL_COULMN,
  MX: MX_RETAUL_COULMN,
  CN: CN_RETAUL_COULMN
};

export const ColumnDetails = (): Array<{
  headerName: string;
  field: string;
  toolPanelClass: string;
  suppressFiltersToolPanel: boolean;
}> => {
  const country = getCountryCode();
  if (country) return Columns[country];
};
