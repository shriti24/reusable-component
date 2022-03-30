import * as React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import moment from 'moment';

// Mocks
const useHasFeatureStub = jest
  .spyOn(require('@utils/useHasFeature'), 'useHasFeature')
  .mockReturnValue(false);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: () => 'Retail New Grid' })
}));

jest.mock('../../common/ts/DateField', () => (props) => (
  <input
    disabled={props.disabled}
    onChange={(event) => props.handleChange(event.target.value)}
    data-testid="Picker"
    placeholder={props.helperText}
  />
));
jest.mock('../../common/DropDown', () => (props) => (
  <input
    disabled={props.disabled}
    onChange={(event) => props.onChange(event, { type: 'Change' })}
    data-testid={props['data-testid'] || 'DropDown'}
    placeholder={props.helperText}
  />
));
jest.mock('../../common/FormField', () => (props) => (
  <input
    disabled={props.disabled}
    onChange={props.onChange}
    data-testid="FormField"
    placeholder={props.helperText}
  />
));
jest.mock('../../../components/common/ts/CustomButton', () => (props) => (
  <button {...props} data-testid={props.children}>
    {props.children}
  </button>
));

jest
  .spyOn(require('../../../services/getConfig'), 'getCurrencySignByCountryCode')
  .mockReturnValue('$');
jest
  .spyOn(require('../../common/HelperFunctions/CanValidator'), 'isMerchandising')
  .mockReturnValue(false);

import Future from './Future';
import { GridContextAPI } from '../contextAPI';
import { DATE_US_FORMAT } from '../../../constants/appConstants';

const _retailReason = [
  { value: 'CC', label: 'Cost Change', type: 'BP' },
  { value: 'COM', label: 'Competitor', type: 'BP' },
  { value: 'IR', label: 'Initial Retail', type: 'BP' },
  { value: 'MP', label: 'Private/Natl Gap', type: 'BP' },
  { value: 'PGG', label: 'Profit Go Get', type: 'BP' },
  { value: 'PI', label: 'Price Investment', type: 'BP' },
  { value: 'PT', label: 'Price Test', type: 'BP' },
  { value: 'MD', label: 'Markdown', type: 'MD' }
];

const _markdownreason = [
  { value: 'DG', label: 'Dated Goods', type: 'MD' },
  { value: 'EOL', label: 'End Of Life', type: 'MD' },
  { value: 'LT1', label: 'Last One', type: 'MD' },
  { value: 'OS', label: 'Overstock', type: 'MD' }
];

describe('Edit Current', () => {
  let props: any,
    gridContext,
    setTypeStub,
    clearTypeStub,
    closeStub,
    saveStub,
    setRefreshStub,
    getReasonDataStub,
    setDeleteStub;

  beforeEach(() => {
    setTypeStub = jest.fn();
    clearTypeStub = jest.fn();
    closeStub = jest.fn();
    saveStub = jest.fn();
    setRefreshStub = jest.fn();
    getReasonDataStub = jest.fn();
    setDeleteStub = jest.fn();
    props = {
      isEdit: false,
      retailType: 'retailType',
      effectiveDate: new Date(),
      expirationDate: null,
      retailReason: 'retailReason',
      item: 'item-text',
      description: 'description-text',
      club: 'club-text',
      retailPrice: 'retailPrice-text',
      status: 'status-content',
      markDown: 'markDown'
    };

    gridContext = {
      selectedType: '',
      retailReasons: _retailReason,
      markdownReasons: _markdownreason,
      isDisable: false,
      isDelete: false,
      errorMsg: '',
      setType: setTypeStub,
      clearType: clearTypeStub,
      close: closeStub,
      save: saveStub,
      refresh: false,
      setRefresh: setRefreshStub,
      getReasonData: getReasonDataStub,
      setDelete: setDeleteStub
    };
  });

  afterEach(() => {
    setTypeStub.mockReset();
    clearTypeStub.mockReset();
    closeStub.mockReset();
    saveStub.mockReset();
    setRefreshStub.mockReset();
    getReasonDataStub.mockReset();
    setDeleteStub.mockReset();
  });

  test('Status === "status-content" and Retail reason !== MD', () => {
    render(
      <GridContextAPI.Provider value={gridContext}>
        <Future {...props} />
      </GridContextAPI.Provider>
    );

    // Retail Amout
    expect(screen.getByText('$retailPrice-text')).toBeInTheDocument();
    // Club Number
    expect(screen.getByText('club-text')).toBeInTheDocument();
    // Item Number
    expect(screen.getByText('item-text')).toBeInTheDocument();
    // Status
    expect(screen.getByText('status-content')).toBeInTheDocument();
    // itemDescription
    expect(screen.getByText('description-text')).toBeInTheDocument();

    expect(screen.queryByPlaceholderText('Retail New Grid')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Effective date')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Expiration Date')).toBeNull();

    // Btn
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('Status === Review and Retail reason !== MD', () => {
    props.status = 'Review';
    render(
      <GridContextAPI.Provider value={gridContext}>
        <Future {...props} />
      </GridContextAPI.Provider>
    );

    // Retail Amout
    expect(screen.getByText('$retailPrice-text')).toBeInTheDocument();
    // Club Number
    expect(screen.getByText('club-text')).toBeInTheDocument();
    // Item Number
    expect(screen.getByText('item-text')).toBeInTheDocument();
    // Status
    expect(screen.getByText('Blocked')).toBeInTheDocument();
    // itemDescription
    expect(screen.getByText('description-text')).toBeInTheDocument();

    expect(screen.queryByPlaceholderText('Retail New Grid')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Effective date')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Expiration Date')).toBeNull();

    expect(screen.queryByTestId('retail-block-statement-container')).toBeInTheDocument();

    // Btn
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('Status === Current and Retail reason !== MD', () => {
    props.status = 'Current';
    props.isEdit = true;

    render(
      <GridContextAPI.Provider value={gridContext}>
        <Future {...props} />
      </GridContextAPI.Provider>
    );

    // Retail Amout
    expect(screen.getByText('$retailPrice-text')).toBeInTheDocument();
    // Club Number
    expect(screen.getByText('club-text')).toBeInTheDocument();
    // Item Number
    expect(screen.getByText('item-text')).toBeInTheDocument();
    // Status
    expect(screen.getByText('Current')).toBeInTheDocument();
    // itemDescription
    expect(screen.getByText('description-text')).toBeInTheDocument();

    expect(screen.queryByPlaceholderText('Retail New Grid')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Effective date')).toBeNull();
    expect(screen.queryByPlaceholderText('Expiration Date')).toBeNull();

    expect(screen.queryByTestId('retail-block-statement-container')).toBeNull();

    // Btn
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('Status === Current and Retail reason == MD', () => {
    props.status = 'Current';
    props.isEdit = true;
    props.retailType = 'MD';

    render(
      <GridContextAPI.Provider value={gridContext}>
        <Future {...props} />
      </GridContextAPI.Provider>
    );

    // Retail Amout
    expect(screen.getByText('$retailPrice-text')).toBeInTheDocument();
    // Club Number
    expect(screen.getByText('club-text')).toBeInTheDocument();
    // Item Number
    expect(screen.getByText('item-text')).toBeInTheDocument();
    // Status
    expect(screen.getByText('Current')).toBeInTheDocument();
    // itemDescription
    expect(screen.getByText('description-text')).toBeInTheDocument();

    expect(screen.queryByPlaceholderText('Retail New Grid')).toBeNull();
    expect(screen.queryByPlaceholderText('Markdown price')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Effective date')).toBeNull();
    expect(screen.queryByPlaceholderText('Expiration Date')).toBeInTheDocument();

    expect(screen.queryByTestId('retail-block-statement-container')).toBeNull();

    expect(screen.queryByTestId('markdon-reason-container')).toBeInTheDocument();

    // Btn
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('User Change the retail reason to MD and Status === CUREENT', () => {
    props.status = 'Current';
    props.isEdit = true;

    render(
      <GridContextAPI.Provider value={gridContext}>
        <Future {...props} />
      </GridContextAPI.Provider>
    );

    expect(screen.queryByPlaceholderText('Retail New Grid')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Markdown price')).toBeNull();
    expect(screen.queryByPlaceholderText('Effective date')).toBeNull();
    expect(screen.queryByPlaceholderText('Expiration Date')).toBeNull();

    expect(screen.queryByTestId('retail-block-statement-container')).toBeNull();
    expect(screen.queryByTestId('markdon-reason-container')).toBeNull();

    // Btn
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByTestId('Save')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    act(() => {
      fireEvent.change(screen.getByTestId('retail-reason-drop-down'), { target: { value: 'MD' } });
      fireEvent.change(screen.queryByPlaceholderText('Retail New Grid'), {
        target: { value: 100 }
      });
    });

    expect(screen.getByTestId('Save')).not.toBeDisabled();
  });

  test('User Change the retail reason to MD and Status !== CUREENT', () => {
    render(
      <GridContextAPI.Provider value={gridContext}>
        <Future {...props} />
      </GridContextAPI.Provider>
    );

    // Btn
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByTestId('Save')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    act(() => {
      fireEvent.change(screen.getByTestId('retail-reason-drop-down'), { target: { value: 'MD' } });
      fireEvent.change(screen.queryByPlaceholderText('Retail New Grid'), {
        target: { value: 100 }
      });
    });

    expect(screen.getByText('Save')).not.toBeDisabled();
  });

  test('User Change effective date', () => {
    props.retailType = 'MD';

    render(
      <GridContextAPI.Provider value={gridContext}>
        <Future {...props} />
      </GridContextAPI.Provider>
    );

    const date = new Date();

    act(() => {
      fireEvent.change(screen.queryByPlaceholderText('Effective date'), {
        target: { value: date }
      });
    });

    let data = `A lock will go into effect on ${moment(date).format(
      DATE_US_FORMAT
    )}. This retail will not be affected by this lock.`;

    expect(screen.getByText(data)).toBeInTheDocument();
  });

  test('User Change effective date', () => {
    props.retailType = 'MD';

    render(
      <GridContextAPI.Provider value={gridContext}>
        <Future {...props} />
      </GridContextAPI.Provider>
    );

    const date = new Date();

    act(() => {
      fireEvent.change(screen.queryByPlaceholderText('Effective date'), {
        target: { value: date }
      });
    });

    let data = `A lock will go into effect on ${moment(date).format(
      DATE_US_FORMAT
    )}. This retail will not be affected by this lock.`;

    expect(screen.getByText(data)).toBeInTheDocument();
  });

  test('Show Error - Retail amount cannot end in 9 or 5', () => {
    props.retailType = 'MD';
    gridContext.errorMsg = 'Retail amount cannot end in 9 or 5';

    render(
      <GridContextAPI.Provider value={gridContext}>
        <Future {...props} />
      </GridContextAPI.Provider>
    );
    expect(screen.getByTestId('error-message-text')).toBeInTheDocument();
  });

  test('Show Error - Custom Error Message', () => {
    props.retailType = 'MD';
    gridContext.errorMsg = 'Custom Error';

    render(
      <GridContextAPI.Provider value={gridContext}>
        <Future {...props} />
      </GridContextAPI.Provider>
    );

    expect(closeStub).toBeCalled();
  });

  test('User Click on Submit Button', () => {
    props.status = 'Current';
    props.isEdit = true;

    render(
      <GridContextAPI.Provider value={gridContext}>
        <Future {...props} />
      </GridContextAPI.Provider>
    );

    act(() => {
      fireEvent.change(screen.getByTestId('retail-reason-drop-down'), { target: { value: 'MD' } });
      fireEvent.change(screen.queryByPlaceholderText('Retail New Grid'), {
        target: { value: 100 }
      });
    });

    expect(screen.getByTestId('Save')).not.toBeDisabled();

    fireEvent.click(screen.getByTestId('Save'));

    expect(saveStub).toBeCalled();
  });

  test('Changes on ', () => {
    props.status = 'Current';
    props.isEdit = false;
    props.retailType = 'MD';

    render(
      <GridContextAPI.Provider value={gridContext}>
        <Future {...props} />
      </GridContextAPI.Provider>
    );

    fireEvent.change(screen.getByTestId('markdon-reason-drop-down'), { target: { value: 'MD' } });
    fireEvent.change(screen.getByPlaceholderText('Effective date'), {
      target: { value: new Date() }
    });
  });
});
