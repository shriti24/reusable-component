import * as React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// Mocks
const useHasFeatureStub = jest
  .spyOn(require('@utils/useHasFeature'), 'useHasFeature')
  .mockReturnValue(false);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: () => 'Retail New Grid' })
}));

jest.mock('../../common/DateField', () => (props) => (
  <input
    onChange={(event) => props.handleChange(event.target.value)}
    data-testid="Picker"
    placeholder={props.helperText}
  />
));
jest.mock('../../common/DropDown', () => (props) => (
  <input onChange={props.onChange} data-testid="DropDown" placeholder={props.helperText} />
));

import EditCurrent from './EditCurrent';

// Not able to test Status - Current

describe('Edit Current', () => {
  let props: any, modifyRetailStub, handleAlertOpenStub, onCloseStub;
  beforeEach(() => {
    modifyRetailStub = jest.fn();
    handleAlertOpenStub = jest.fn();
    onCloseStub = jest.fn();

    props = {
      modifyRetail: modifyRetailStub,
      handleAlertOpen: handleAlertOpenStub,
      errorMessages: '',
      onClose: onCloseStub,
      itemDescription: 'itemDescription-Content',
      reasonCodes: {
        retailReason: [],
        markdownRetailReason: [],
        markdownReasons: []
      },
      data: {
        retailType: 'DIS',
        effectiveDate: new Date(),
        expirationDate: null,
        retailReason: 'retailReason',
        itemNbr: 100,
        clubNbr: 101,
        retailAmount: 10,
        status: 'status-content',
        markDown: 'markDown'
      }
    };
  });

  afterEach(() => {
    modifyRetailStub.mockReset();
    handleAlertOpenStub.mockReset();
    onCloseStub.mockReset();
  });

  test('Retail Type is NOT MD and Status is not Current', () => {
    render(<EditCurrent {...props} />);

    // Retail Amout
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    // Club Number
    expect(screen.getByText('101')).toBeInTheDocument();
    // Item Number
    expect(screen.getByText('100')).toBeInTheDocument();
    // Status
    expect(screen.getByText('status-content')).toBeInTheDocument();
    // itemDescription
    expect(screen.getByText('itemDescription-Content')).toBeInTheDocument();

    expect(screen.getByText('Retail New Grid')).toBeInTheDocument();
    expect(screen.queryByText('Markdown price')).toBeNull();

    // Form Fields
    expect(screen.queryByTestId('retail-reason-container')).toBeInTheDocument();
    expect(screen.queryByTestId('retail-reason-md-container')).toBeNull();
    expect(screen.queryByTestId('markdown-reason-container')).toBeNull();

    // expect(screen.queryByPlaceholderText('Effective date')).toBeNull();
    expect(screen.queryByPlaceholderText('Expiration Date')).toBeNull();

    // Button
    expect(screen.queryByText('Cancel')).toBeInTheDocument();
    expect(screen.queryByTestId('save-btn')).toBeInTheDocument();
  });

  test('Retail Type is MD and Status is not Current', () => {
    props.data.retailType = 'MD';

    render(<EditCurrent {...props} />);

    // Retail Amout
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    // Club Number
    expect(screen.getByText('101')).toBeInTheDocument();
    // Item Number
    expect(screen.getByText('100')).toBeInTheDocument();
    // Status
    expect(screen.getByText('status-content')).toBeInTheDocument();
    // itemDescription
    expect(screen.getByText('itemDescription-Content')).toBeInTheDocument();

    expect(screen.queryByText('Retail New Grid')).toBeNull();
    expect(screen.queryByText('Markdown price')).toBeInTheDocument();

    // Form Fields
    expect(screen.queryByTestId('retail-reason-container')).toBeNull();
    expect(screen.queryByTestId('retail-reason-md-container')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-reason-container')).toBeInTheDocument();

    // expect(screen.queryByPlaceholderText('Effective date')).toBeNull();
    expect(screen.queryByPlaceholderText('Expiration Date')).toBeInTheDocument();

    // Button
    expect(screen.queryByText('Cancel')).toBeInTheDocument();
    expect(screen.queryByTestId('save-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('save-btn')).toBeDisabled();
  });

  test('Retail Type is MD and Status is Current', () => {
    props.data.retailType = 'MD';
    props.data.status = 'Current';

    render(<EditCurrent {...props} />);

    // Retail Amout
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    // Club Number
    expect(screen.getByText('101')).toBeInTheDocument();
    // Item Number
    expect(screen.getByText('100')).toBeInTheDocument();
    // Status
    expect(screen.getByText('Current')).toBeInTheDocument();
    // itemDescription
    expect(screen.getByText('itemDescription-Content')).toBeInTheDocument();

    expect(screen.queryByText('Retail New Grid')).toBeNull();
    expect(screen.queryByText('Markdown price')).toBeInTheDocument();

    // Form Fields
    expect(screen.queryByTestId('retail-reason-container')).toBeNull();
    expect(screen.queryByTestId('retail-reason-md-container')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-reason-container')).toBeInTheDocument();

    // expect(screen.queryByPlaceholderText('Effective date')).toBeNull();
    expect(screen.queryByPlaceholderText('Expiration Date')).toBeInTheDocument();

    // Button
    expect(screen.queryByText('Cancel')).toBeInTheDocument();
    expect(screen.queryByTestId('save-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('save-btn')).toBeDisabled();
  });

  test('Retail Type is MD and Status is Current', () => {
    props.data.retailType = 'MD';
    props.data.status = 'Current';

    render(<EditCurrent {...props} />);

    // Retail Amout
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    // Club Number
    expect(screen.getByText('101')).toBeInTheDocument();
    // Item Number
    expect(screen.getByText('100')).toBeInTheDocument();
    // Status
    expect(screen.getByText('Current')).toBeInTheDocument();
    // itemDescription
    expect(screen.getByText('itemDescription-Content')).toBeInTheDocument();

    expect(screen.queryByText('Retail New Grid')).toBeNull();
    expect(screen.queryByText('Markdown price')).toBeInTheDocument();

    // Form Fields
    expect(screen.queryByTestId('retail-reason-container')).toBeNull();
    expect(screen.queryByTestId('retail-reason-md-container')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-reason-container')).toBeInTheDocument();

    // expect(screen.queryByPlaceholderText('Effective date')).toBeNull();
    expect(screen.queryByPlaceholderText('Expiration Date')).toBeInTheDocument();

    // Button
    expect(screen.queryByText('Cancel')).toBeInTheDocument();
    expect(screen.queryByTestId('save-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('save-btn')).toBeDisabled();
  });

  test('User Change Expiration Date', async () => {
    props.data.retailType = 'MD';
    props.data.status = 'Current';

    render(<EditCurrent {...props} />);

    expect(screen.queryByTestId('save-btn')).toBeDisabled();

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Expiration Date'), {
        target: { value: new Date() }
      });
    });
    expect(screen.queryByTestId('save-btn')).not.toBeDisabled();
  });

  test('User Click Save Btn', async () => {
    props.data.retailType = 'MD';
    props.data.status = 'Current';

    render(<EditCurrent {...props} />);

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Expiration Date'), {
        target: { value: new Date() }
      });
    });

    act(() => {
      fireEvent.click(screen.queryByTestId('save-btn'));
    });

    expect(modifyRetailStub).toBeCalled();
  });

  test('Show Error Message - Retail amount cannot end in 9 or 5', async () => {
    props.data.retailType = 'MD';
    props.data.status = 'Current';
    props.data.expirationDate = new Date();

    const { rerender } = render(<EditCurrent {...props} />);

    expect(screen.queryByTestId('save-btn')).not.toBeDisabled();

    act(() => {
      fireEvent.click(screen.queryByTestId('save-btn'));
    });

    props.errorMessages = 'Retail amount cannot end in 9 or 5';

    act(() => {
      rerender(<EditCurrent {...props} />);
    });

    expect(screen.queryByTestId('save-btn')).toBeDisabled();
    expect(modifyRetailStub).toBeCalled();

    expect(screen.getByTestId('input-error-tags-msg')).toBeInTheDocument();
    expect(screen.queryByTestId('same-dates-error')).toBeNull();
  });

  test('Show Error Message - Retail amount cannot end in 1', async () => {
    props.data.retailType = 'MD';
    props.data.status = 'Current';
    props.data.expirationDate = new Date();

    const { rerender } = render(<EditCurrent {...props} />);

    expect(screen.queryByTestId('save-btn')).not.toBeDisabled();

    act(() => {
      fireEvent.click(screen.queryByTestId('save-btn'));
    });

    props.errorMessages = 'Retail amount cannot end in 1';

    act(() => {
      rerender(<EditCurrent {...props} />);
    });

    expect(screen.queryByTestId('save-btn')).toBeDisabled();
    expect(modifyRetailStub).toBeCalled();

    expect(screen.getByTestId('input-error-tags-msg')).toBeInTheDocument();
    expect(screen.queryByTestId('same-dates-error')).toBeNull();
  });

  test('Show Error Message - Retails less than $300 cannot end in 00', async () => {
    props.data.retailType = 'MD';
    props.data.status = 'Current';
    props.data.expirationDate = new Date();

    const { rerender } = render(<EditCurrent {...props} />);

    expect(screen.queryByTestId('save-btn')).not.toBeDisabled();

    act(() => {
      fireEvent.click(screen.queryByTestId('save-btn'));
    });

    props.errorMessages = 'Retails less than $300 cannot end in 00';

    act(() => {
      rerender(<EditCurrent {...props} />);
    });

    expect(screen.queryByTestId('save-btn')).toBeDisabled();
    expect(modifyRetailStub).toBeCalled();

    expect(screen.getByTestId('input-error-tags-msg')).toBeInTheDocument();
    expect(screen.queryByTestId('same-dates-error')).toBeNull();
  });

  test('Show Error Message - Retail amount cannot end in 90', async () => {
    props.data.retailType = 'MD';
    props.data.status = 'Current';
    props.data.expirationDate = new Date();

    const { rerender } = render(<EditCurrent {...props} />);

    expect(screen.queryByTestId('save-btn')).not.toBeDisabled();

    act(() => {
      fireEvent.click(screen.queryByTestId('save-btn'));
    });

    props.errorMessages = 'Retail amount cannot end in 90';

    act(() => {
      rerender(<EditCurrent {...props} />);
    });

    expect(screen.queryByTestId('save-btn')).toBeDisabled();
    expect(modifyRetailStub).toBeCalled();

    expect(screen.getByTestId('input-error-tags-msg')).toBeInTheDocument();
    expect(screen.queryByTestId('same-dates-error')).toBeNull();
  });

  test('Show Error Message - Markdowns must end in 1', async () => {
    props.data.retailType = 'MD';
    props.data.status = 'Current';
    props.data.expirationDate = new Date();

    const { rerender } = render(<EditCurrent {...props} />);

    expect(screen.queryByTestId('save-btn')).not.toBeDisabled();

    act(() => {
      fireEvent.click(screen.queryByTestId('save-btn'));
    });

    props.errorMessages = 'Markdowns must end in 1';

    act(() => {
      rerender(<EditCurrent {...props} />);
    });

    expect(screen.queryByTestId('save-btn')).toBeDisabled();
    expect(modifyRetailStub).toBeCalled();

    expect(screen.getByTestId('input-error-tags-msg')).toBeInTheDocument();
    expect(screen.queryByTestId('same-dates-error')).toBeNull();
  });

  test('Show Error Message - already exists', async () => {
    props.data.retailType = 'MD';
    props.data.status = 'Current';
    props.data.expirationDate = new Date();

    const { rerender } = render(<EditCurrent {...props} />);

    expect(screen.queryByTestId('save-btn')).not.toBeDisabled();

    act(() => {
      fireEvent.click(screen.queryByTestId('save-btn'));
    });

    props.errorMessages = 'already exists';

    act(() => {
      rerender(<EditCurrent {...props} />);
    });

    expect(screen.queryByTestId('save-btn')).toBeDisabled();
    expect(modifyRetailStub).toBeCalled();

    expect(screen.getByTestId('input-error-tags-msg')).toBeInTheDocument();
    expect(screen.queryByTestId('same-dates-error')).toBeNull();
  });

  test('Show Error Message - less than End Date', async () => {
    props.data.retailType = 'MD';
    props.data.status = 'Current';
    props.data.expirationDate = new Date();

    const { rerender } = render(<EditCurrent {...props} />);

    expect(screen.queryByTestId('save-btn')).not.toBeDisabled();

    act(() => {
      fireEvent.click(screen.queryByTestId('save-btn'));
    });

    props.errorMessages = 'less than End Date';

    act(() => {
      rerender(<EditCurrent {...props} />);
    });

    expect(screen.queryByTestId('save-btn')).toBeDisabled();
    expect(modifyRetailStub).toBeCalled();

    expect(screen.getByTestId('same-dates-error')).toBeInTheDocument();
    expect(screen.queryByTestId('input-error-tags-msg')).toBeNull();
  });

  test('Retial Type is Not MD and User Change the Reason to MD', () => {
    const { rerender } = render(<EditCurrent {...props} />);

    expect(screen.queryByTestId('retail-reason-container')).toBeInTheDocument();
    expect(screen.queryByTestId('retail-reason-md-container')).toBeNull();
    expect(screen.queryByTestId('markdown-reason-container')).toBeNull();

    act(() => {
      fireEvent.change(screen.getByTestId('DropDown'), { target: { value: 'MD' } });
    });

    expect(screen.queryByTestId('retail-reason-container')).toBeNull();
    expect(screen.queryByTestId('retail-reason-md-container')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-reason-container')).toBeInTheDocument();
  });

  test('User Change the Reason to PI', () => {
    const { rerender } = render(<EditCurrent {...props} />);

    expect(screen.queryByTestId('retail-reason-container')).toBeInTheDocument();
    expect(screen.queryByTestId('retail-reason-md-container')).toBeNull();
    expect(screen.queryByTestId('markdown-reason-container')).toBeNull();
    expect(screen.queryByTestId('price-investment-container')).toBeNull();

    act(() => {
      fireEvent.change(screen.getByTestId('DropDown'), { target: { value: 'PI' } });
    });

    expect(screen.getByTestId('price-investment-container')).toBeInTheDocument();
  });
});
