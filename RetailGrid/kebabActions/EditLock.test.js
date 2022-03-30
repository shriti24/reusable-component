import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { shallow, mount, configure } from 'enzyme';
import EditLock from './EditLock';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import moment from 'moment';

configure({ adapter: new Adapter() });

jest.mock('../../common/HelperFunctions/CanValidator', () => {
  return {
    isAdmin: jest.fn(() => {
      return true;
    })
  };
});
describe('Edit Lock Render', () => {
  let handleEditLockClose, handleEditLockSave;

  beforeEach(() => {
    handleEditLockClose = jest.fn();
    handleEditLockSave = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Render Edit Lock', () => {
    const props = {
      data: undefined,
      handleEditLockClose,
      handleEditLockSave,
      lockData: {
        clubNbr: 4711,
        itemNbr: 3440,
        lock: undefined,
        status: undefined
      },
      lockProcessing: false
    };
    render(<EditLock {...props} />);
    expect(screen.getByText('Effective date')).toBeInTheDocument();
  });

  test('Edit Lock - on change', () => {
    const props = {
      data: undefined,
      handleEditLockClose,
      handleEditLockSave,
      lockData: {
        clubNbr: 4711,
        itemNbr: 3440,
        lock: { blockReasonCode: 'DIS', startDate: new Date(), endDate: new Date() },
        status: 'Active'
      },
      lockProcessing: false
    };
    const wrapper = shallow(<EditLock {...props} />);

    expect(wrapper.find('DropDown').length).toEqual(1);
    const option = { target: { value: 'PII' } };
    wrapper.find('DropDown').at(0).simulate('change', option);
  });

  test('Edit Lock - on change with empty lock val', () => {
    const props = {
      data: undefined,
      handleEditLockClose,
      handleEditLockSave,
      lockData: {
        clubNbr: 4711,
        itemNbr: 3440,
        lock: undefined,
        status: undefined
      },
      lockProcessing: false
    };
    const wrapper = shallow(<EditLock {...props} />);
    expect(wrapper.find('DropDown').length).toEqual(1);
    const option = { target: { value: 'DIS' } };
    wrapper.find('DropDown').at(0).simulate('change', option);
  });

  test('Edit Lock - on submit', () => {
    const props = {
      data: undefined,
      handleEditLockClose,
      handleEditLockSave,
      lockData: {
        clubNbr: 4711,
        itemNbr: 3440,
        lock: undefined,
        status: undefined
      },
      lockProcessing: false
    };
    render(<EditLock {...props} />);
    fireEvent.click(screen.getByTestId('test-button-id'));
  });

  test('should call handleEditLockSave on Save button click for reason code DIS and priceLockStatus Active with newStopDate as end date', () => {
    const endDateVal = moment(new Date()).format('MM/DD/YYYY');
    const props = {
      data: undefined,
      handleEditLockClose,
      handleEditLockSave,
      lockData: {
        clubNbr: 4711,
        itemNbr: 3440,
        lock: { blockReasonCode: 'DIS', startDate: new Date(), endDate: new Date() },
        status: 'Active'
      },
      lockProcessing: false
    };
    render(<EditLock {...props} />);
    fireEvent.click(screen.getByTestId('test-button-id'));
    expect(handleEditLockSave).toHaveBeenCalledTimes(1);
    expect(handleEditLockSave).toHaveBeenCalledWith({
      blockReasonCode: 'DIS',
      clubNbr: 4711,
      itemNbr: 3440,
      newStopDate: endDateVal,
      priceBlockId: undefined,
      userId: ''
    });
  });
  test('should call handleEditLockSave on Save button click for reason code DIS and priceLockStatus Active with newStopDate as basePriceExpiry', () => {
    const props = {
      data: undefined,
      handleEditLockClose,
      handleEditLockSave,
      lockData: {
        clubNbr: 4711,
        itemNbr: 3440,
        lock: { blockReasonCode: 'DIS', startDate: new Date() },
        status: 'Active'
      },
      lockProcessing: false
    };
    render(<EditLock {...props} />);
    fireEvent.click(screen.getByTestId('test-button-id'));
    expect(handleEditLockSave).toHaveBeenCalledTimes(1);
    expect(handleEditLockSave).toHaveBeenCalledWith({
      blockReasonCode: 'DIS',
      clubNbr: 4711,
      itemNbr: 3440,
      newStopDate: '12/31/2049',
      priceBlockId: undefined,
      userId: ''
    });
  });
  test('should call handleEditLockSave on Save button click for reason code DIS and priceLockStatus non-Active with newStopDate as basePriceExpiry', () => {
    const currentDate = moment(new Date()).format('MM/DD/YYYY');
    const props = {
      data: undefined,
      handleEditLockClose,
      handleEditLockSave,
      lockData: {
        clubNbr: 4711,
        itemNbr: 3440,
        lock: { blockReasonCode: 'DIS', startDate: currentDate, endDate: currentDate },
        status: undefined
      },
      lockProcessing: false
    };
    render(<EditLock {...props} />);
    fireEvent.click(screen.getByTestId('test-button-id'));
    expect(handleEditLockSave).toHaveBeenCalledTimes(1);
    expect(handleEditLockSave).toHaveBeenCalledWith({
      blockReasonCode: 'DIS',
      clubNbr: 4711,
      itemNbr: 3440,
      newStartDate: currentDate,
      newStopDate: currentDate,
      priceBlockId: undefined,
      userId: ''
    });
  });
  test('should call handleEditLockSave on Save button click for reason code DIS and priceLockStatus non-Active with endDate as basePriceExpiry', () => {
    const currentDate = moment(new Date()).format('MM/DD/YYYY');
    const props = {
      data: undefined,
      handleEditLockClose,
      handleEditLockSave,
      lockData: {
        clubNbr: 4711,
        itemNbr: 3440,
        lock: { blockReasonCode: 'DIS', startDate: currentDate, endDate: '12/31/2049' },
        status: undefined
      },
      lockProcessing: false
    };
    render(<EditLock {...props} />);
    fireEvent.click(screen.getByTestId('test-button-id'));
    expect(handleEditLockSave).toHaveBeenCalledTimes(1);
    expect(handleEditLockSave).toHaveBeenCalledWith({
      blockReasonCode: 'DIS',
      clubNbr: 4711,
      itemNbr: 3440,
      newStartDate: currentDate,
      newStopDate: null,
      priceBlockId: undefined,
      userId: ''
    });
  });
  test('should call handleEditLockSave on Save button click for reason code DIS and priceLockStatus non-Active with newStopDate as null', () => {
    const currentDate = moment(new Date()).format('MM/DD/YYYY');
    const props = {
      data: undefined,
      handleEditLockClose,
      handleEditLockSave,
      lockData: {
        clubNbr: 4711,
        itemNbr: 3440,
        lock: { blockReasonCode: 'DIS', startDate: currentDate },
        status: undefined
      },
      lockProcessing: false
    };
    render(<EditLock {...props} />);
    fireEvent.click(screen.getByTestId('test-button-id'));
    expect(handleEditLockSave).toHaveBeenCalledTimes(1);
    expect(handleEditLockSave).toHaveBeenCalledWith({
      blockReasonCode: 'DIS',
      clubNbr: 4711,
      itemNbr: 3440,
      newStartDate: currentDate,
      newStopDate: null,
      priceBlockId: undefined,
      userId: ''
    });
  });
  test('should be able to add or remove end date on Add or Delete icon click for reason code DIS without end date', () => {
    const props = {
      data: undefined,
      handleEditLockClose,
      handleEditLockSave,
      lockData: {
        clubNbr: 4711,
        itemNbr: 3440,
        lock: { blockReasonCode: 'DIS', startDate: new Date() },
        status: undefined
      },
      lockProcessing: false
    };
    const wrapper = mount(<EditLock {...props} />);
    const option = { target: { value: 'DIS' } };
    expect(wrapper.find({ 'data-testid': 'add-end-date' }).length).toEqual(1);
    wrapper.find({ 'data-testid': 'add-end-date' }).at(0).simulate('click', option);
    wrapper.update();
    expect(wrapper.find({ 'data-testid': 'add-end-date' }).length).toEqual(0);
    expect(wrapper.find({ 'data-testid': 'remove-end-date' }).length).toEqual(1);
    wrapper.find({ 'data-testid': 'remove-end-date' }).at(0).simulate('click', option);
    wrapper.update();
    expect(wrapper.find({ 'data-testid': 'add-end-date' }).length).toEqual(1);
    expect(wrapper.find({ 'data-testid': 'remove-end-date' }).length).toEqual(0);
  });
});
