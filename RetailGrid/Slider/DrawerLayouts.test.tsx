import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mocks
const mockAddalert = jest.fn();
const mockHandleeditlocksave = jest.fn();
mockHandleeditlocksave.mockImplementation((props) => props.handleEditLockSave({}));

jest.mock('../kebabActions/Future', () => () => (
  <div data-testid="future-layout">FutureLayout</div>
));
jest.mock('../../RetailGrid/kebabActions/Locks', () => (props) => (
  <div>
    <div onClick={props.onEditClick} data-testid="locks"></div>
    <div onClick={props.handleDeleteLock} data-testid="delete-locks"></div>
    Locks
  </div>
));
jest.mock('../kebabActions/EditLock', () => (props) => (
  <>
    <div data-testid="edit-lock" onClick={() => mockHandleeditlocksave(props)}>
      EditLock
    </div>
    <div data-testid="edit-lock-close" onClick={props.handleEditLockClose}></div>
  </>
));
jest.mock('./InfoLayout', () => () => <div data-testid="info-layout">InfoLayout</div>);

jest.mock('@material-ui/icons/Add', () => () => <div data-testid="add-icon" />);
jest.mock('@material-ui/icons/Edit', () => () => <div data-testid="edit-icon" />);
jest.mock('@material-ui/icons/ArrowBack', () => (props) => (
  <div {...props} data-testid="arrow-back-icon" />
));
jest.mock('@material-ui/icons/InfoOutlined', () => () => <div data-testid="info-icon" />);
jest.mock('../../../components/common/ts/DialogBox', () => (props) => (
  <>
    <div onClick={props.handleSecondButtonClick} data-testid="DialogBox" />
    <div onClick={props.handleDialogCancel} data-testid="DialogBox-cancel" />
    <div onClick={props.handleFirstButtonClick} data-testid="DialogBox-first-button" />
  </>
));
jest.mock('../../../icons/LockClosedIcon', () => () => <div data-testid="lock-closed-icon" />);
jest.mock('@utils/useToastFeature', () => () => ({ addAlert: mockAddalert }));

const useContextSetTypeStub = jest.fn();
jest
  .spyOn(require('react'), 'useContext')
  .mockReturnValue({ data: { itemNbr: '' }, setType: useContextSetTypeStub });

jest
  .spyOn(require('react'), 'useState')
  .mockImplementation((data) => [typeof data === 'boolean' ? true : data, jest.fn]);

const createLockRetailStub = jest
  .spyOn(require('../../../services/priceLockService'), 'createLockRetail')
  .mockResolvedValue({ data: [], status: 204 });

let deleteMockVal = { data: [], status: 204 };

const deleteLockRetailStub = jest
  .spyOn(require('../../../services/priceLockService'), 'deleteLockRetail')
  .mockResolvedValue(deleteMockVal);

const editLockRetailStub = jest
  .spyOn(require('../../../services/priceLockService'), 'editLockRetail')
  .mockResolvedValue({ data: [], status: 204 });

import { renderHeader, renderLayout } from './DrawerLayouts';
import axios from 'axios';

describe('renderHeader', () => {
  beforeEach(() => {
    deleteMockVal = { data: [], status: 204 };
    createLockRetailStub.mockResolvedValue({ data: [], status: 204 });
    deleteLockRetailStub.mockResolvedValue({ data: [], status: 204 });
    editLockRetailStub.mockResolvedValue({ data: [], status: 204 });
  });

  afterEach(() => {
    createLockRetailStub.mockReset();
    deleteLockRetailStub.mockReset();
    editLockRetailStub.mockReset();
    useContextSetTypeStub.mockReset();
  });

  test('CLICKED-TYPE empty ', () => {
    render(<div>{renderHeader(null, 'add')}</div>);

    // Icons
    expect(screen.queryByTestId('add-icon')).toBeNull();
    expect(screen.queryByTestId('edit-icon')).toBeNull();
    expect(screen.queryByTestId('arrow-back-icon')).toBeNull();
    expect(screen.queryByTestId('arrow-back-icon')).toBeNull();
    expect(screen.queryByTestId('info-icon')).toBeNull();
    expect(screen.queryByTestId('lock-closed-icon')).toBeNull();

    // Text Label
    expect(screen.queryByText('Add')).toBeNull();
    expect(screen.queryByText('Edit')).toBeNull();
    expect(screen.queryByText('Locks')).toBeNull();
    expect(screen.queryByText('Add Lock')).toBeNull();
    expect(screen.queryByText('Edit Lock')).toBeNull();
    expect(screen.queryByText('Info')).toBeNull();
  });

  test('CLICKED-TYPE = ADD ', () => {
    render(<div>{renderHeader('add', 'add')}</div>);

    // Icons
    expect(screen.getByTestId('add-icon')).toBeInTheDocument();

    expect(screen.queryByTestId('edit-icon')).toBeNull();
    expect(screen.queryByTestId('arrow-back-icon')).toBeNull();
    expect(screen.queryByTestId('arrow-back-icon')).toBeNull();
    expect(screen.queryByTestId('info-icon')).toBeNull();
    expect(screen.queryByTestId('lock-closed-icon')).toBeNull();

    // Text Label
    expect(screen.getByText('Add')).toBeInTheDocument();

    expect(screen.queryByText('Edit')).toBeNull();
    expect(screen.queryByText('Locks')).toBeNull();
    expect(screen.queryByText('Add Lock')).toBeNull();
    expect(screen.queryByText('Edit Lock')).toBeNull();
    expect(screen.queryByText('Info')).toBeNull();
  });

  test('CLICKED-TYPE = EDIT ', () => {
    render(<div>{renderHeader('edit', 'add')}</div>);

    // Icons
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();

    expect(screen.queryByTestId('add-icon')).toBeNull();
    expect(screen.queryByTestId('arrow-back-icon')).toBeNull();
    expect(screen.queryByTestId('arrow-back-icon')).toBeNull();
    expect(screen.queryByTestId('info-icon')).toBeNull();
    expect(screen.queryByTestId('lock-closed-icon')).toBeNull();

    // Text Label
    expect(screen.getByText('Edit')).toBeInTheDocument();

    expect(screen.queryByText('Add')).toBeNull();
    expect(screen.queryByText('Locks')).toBeNull();
    expect(screen.queryByText('Add Lock')).toBeNull();
    expect(screen.queryByText('Edit Lock')).toBeNull();
    expect(screen.queryByText('Info')).toBeNull();
  });

  test('CLICKED-TYPE = LOCK ', () => {
    render(<div>{renderHeader('lock', 'add')}</div>);

    // Icons
    expect(screen.getByTestId('lock-closed-icon')).toBeInTheDocument();

    expect(screen.queryByTestId('edit-icon')).toBeNull();
    expect(screen.queryByTestId('arrow-back-icon')).toBeNull();
    expect(screen.queryByTestId('arrow-back-icon')).toBeNull();
    expect(screen.queryByTestId('info-icon')).toBeNull();
    expect(screen.queryByTestId('add-icon')).toBeNull();

    // Text Label
    expect(screen.getByText('Locks')).toBeInTheDocument();

    expect(screen.queryByText('Edit')).toBeNull();
    expect(screen.queryByText('Add')).toBeNull();
    expect(screen.queryByText('Add Lock')).toBeNull();
    expect(screen.queryByText('Edit Lock')).toBeNull();
    expect(screen.queryByText('Info')).toBeNull();
  });

  test('CLICKED-TYPE = ADD LOCK ', () => {
    render(<div>{renderHeader('addLock', 'add')}</div>);

    // Icons
    expect(screen.getByTestId('arrow-back-icon')).toBeInTheDocument();

    expect(screen.queryByTestId('edit-icon')).toBeNull();
    expect(screen.queryByTestId('lock-closed-icon')).toBeNull();
    expect(screen.queryByTestId('info-icon')).toBeNull();
    expect(screen.queryByTestId('add-icon')).toBeNull();

    // Text Label
    expect(screen.getByText('Add Lock')).toBeInTheDocument();

    expect(screen.queryByText('Edit')).toBeNull();
    expect(screen.queryByText('Add')).toBeNull();
    expect(screen.queryByText('Locks')).toBeNull();
    expect(screen.queryByText('Edit Lock')).toBeNull();
    expect(screen.queryByText('Info')).toBeNull();
  });

  test('CLICKED-TYPE = EDIT LOCK ', () => {
    render(<div>{renderHeader('editLock', 'add')}</div>);

    // Icons
    expect(screen.getByTestId('arrow-back-icon')).toBeInTheDocument();

    expect(screen.queryByTestId('edit-icon')).toBeNull();
    expect(screen.queryByTestId('lock-closed-icon')).toBeNull();
    expect(screen.queryByTestId('info-icon')).toBeNull();
    expect(screen.queryByTestId('add-icon')).toBeNull();

    // Text Label
    expect(screen.getByText('Edit Lock')).toBeInTheDocument();

    expect(screen.queryByText('Edit')).toBeNull();
    expect(screen.queryByText('Add')).toBeNull();
    expect(screen.queryByText('Locks')).toBeNull();
    expect(screen.queryByText('Add Lock')).toBeNull();
    expect(screen.queryByText('Info')).toBeNull();
  });

  test('CLICKED-TYPE = info ', () => {
    render(<div>{renderHeader('info', 'add')}</div>);

    // Icons
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();

    expect(screen.queryByTestId('edit-icon')).toBeNull();
    expect(screen.queryByTestId('lock-closed-icon')).toBeNull();
    expect(screen.queryByTestId('arrow-back-icon')).toBeNull();
    expect(screen.queryByTestId('add-icon')).toBeNull();

    // Text Label
    expect(screen.getByText('Info')).toBeInTheDocument();

    expect(screen.queryByText('Edit')).toBeNull();
    expect(screen.queryByText('Add')).toBeNull();
    expect(screen.queryByText('Locks')).toBeNull();
    expect(screen.queryByText('Add Lock')).toBeNull();
    expect(screen.queryByText('Edit Lock')).toBeNull();
  });

  test('CLICKED-TYPE = EDIT LOCK and User Action', () => {
    render(<div>{renderHeader('editLock', 'add')}</div>);
    fireEvent.click(screen.getByTestId('arrow-back-icon'));
    expect(useContextSetTypeStub).toBeCalled();
  });

  test('CLICKED-TYPE = ADD LOCK and User Action', () => {
    render(<div>{renderHeader('addLock', 'add')}</div>);
    fireEvent.click(screen.getByTestId('arrow-back-icon'));
    expect(useContextSetTypeStub).toBeCalled();
  });
});

describe('renderHeader', () => {
  let props: any = {
    itemNbr: 'itemNbr',
    itemDesc: 'itemDesc',
    status: 'status',
    clubNbr: 'clubNbr',
    currentActiveRetailPrice: 'currentActiveRetailPrice',
    competitor: 'competitor',
    spread: '12',
    floor: '2',
    createdBy: 'test010',
    ruleId: '1',
    retailAmount: '12',
    customerRetailAmt: '13'
  };

  beforeEach(() => {
    createLockRetailStub.mockResolvedValue({ data: [], status: 204 });
    deleteLockRetailStub.mockResolvedValue({ data: [], status: 204 });
    editLockRetailStub.mockResolvedValue({ data: [], status: 204 });
  });

  afterEach(() => {
    createLockRetailStub.mockReset();
    deleteLockRetailStub.mockReset();
    editLockRetailStub.mockReset();
    useContextSetTypeStub.mockReset();
    mockAddalert.mockReset();
  });

  test('CLICKED-TYPE = null', () => {
    render(<div>{renderLayout(null, props)}</div>);

    // Component
    expect(screen.queryByTestId('future-layout')).toBeNull();
    expect(screen.queryByTestId('locks')).toBeNull();
    expect(screen.queryByTestId('edit-lock')).toBeNull();
    expect(screen.queryByTestId('info-layout')).toBeNull();
  });

  test('CLICKED-TYPE = ADD', () => {
    render(<div>{renderLayout('add', props)}</div>);

    // Component
    expect(screen.queryByTestId('future-layout')).toBeInTheDocument();

    expect(screen.queryByTestId('locks')).toBeNull();
    expect(screen.queryByTestId('edit-lock')).toBeNull();
    expect(screen.queryByTestId('info-layout')).toBeNull();
  });

  test('CLICKED-TYPE = EDIT ', () => {
    render(<div>{renderLayout('edit', props)}</div>);

    // Component
    expect(screen.queryByTestId('future-layout')).toBeInTheDocument();

    expect(screen.queryByTestId('locks')).toBeNull();
    expect(screen.queryByTestId('edit-lock')).toBeNull();
    expect(screen.queryByTestId('info-layout')).toBeNull();
  });

  test('CLICKED-TYPE = LOCK ', () => {
    render(<div>{renderLayout('lock', props)}</div>);

    // Component
    expect(screen.queryByTestId('locks')).toBeInTheDocument();

    expect(screen.queryByTestId('future-layout')).toBeNull();
    expect(screen.queryByTestId('edit-lock')).toBeNull();
    expect(screen.queryByTestId('info-layout')).toBeNull();
  });

  test('CLICKED-TYPE = ADD LOCK ', () => {
    render(<div>{renderLayout('addLock', props)}</div>);

    // Component
    expect(screen.queryByTestId('edit-lock')).toBeInTheDocument();

    expect(screen.queryByTestId('locks')).toBeNull();
    expect(screen.queryByTestId('future-layout')).toBeNull();
    expect(screen.queryByTestId('info-layout')).toBeNull();
    fireEvent.click(screen.getByTestId('edit-lock-close'));
  });

  test('CLICKED-TYPE = EDIT LOCK ', () => {
    render(<div>{renderLayout('editLock', props)}</div>);

    // Component
    expect(screen.queryByTestId('edit-lock')).toBeInTheDocument();

    expect(screen.queryByTestId('locks')).toBeNull();
    expect(screen.queryByTestId('future-layout')).toBeNull();
    expect(screen.queryByTestId('info-layout')).toBeNull();
  });

  test('CLICKED-TYPE = Info', () => {
    render(<div>{renderLayout('info', props)}</div>);

    // Component
    expect(screen.queryByTestId('info-layout')).toBeInTheDocument();

    expect(screen.queryByTestId('locks')).toBeNull();
    expect(screen.queryByTestId('future-layout')).toBeNull();
    expect(screen.queryByTestId('edit-lock')).toBeNull();
  });

  test('CLICKED-TYPE = ADD LOCK and user click on Save', () => {
    const data = {
      itemNbr: 100,
      clubNbr: 100
    };
    mockHandleeditlocksave.mockImplementation((props) => props.handleEditLockSave(data));
    createLockRetailStub.mockResolvedValue({ status: 200, data: { blockDetails: data } });

    render(<div>{renderLayout('addLock', props)}</div>);
    fireEvent.click(screen.queryByTestId('edit-lock'));

    // API CALLS
    expect(createLockRetailStub).toBeCalled();
    expect(createLockRetailStub.mock.calls[0][0]).toEqual(data);

    expect(editLockRetailStub).not.toBeCalled();
    expect(deleteLockRetailStub).not.toBeCalled();

    // Alert
    // expect(mockAddalert).toBeCalled();
    // expect(mockAddalert.mock.calls[0]).toEqual(['Lock created', 'success']);

    // Set Type
    // expect(useContextSetTypeStub).toBeCalled();
    // expect(useContextSetTypeStub.mock.calls[0]).toEqual(['lock', data]);
  });

  test('CLICKED-TYPE = EDIT LOCK and user click on Save ', () => {
    const data = {
      itemNbr: 100,
      clubNbr: 100,
      blockReasonCode: true
    };

    mockHandleeditlocksave.mockImplementation((props) => props.handleEditLockSave(data));
    editLockRetailStub.mockResolvedValue({ status: 200, data: { blockDetails: data } });

    render(<div>{renderLayout('editLock', props)}</div>);

    fireEvent.click(screen.queryByTestId('edit-lock'));

    // API CALLS
    expect(editLockRetailStub).toBeCalled();
    expect(editLockRetailStub.mock.calls[0][0]).toEqual(data);

    expect(createLockRetailStub).not.toBeCalled();
    expect(deleteLockRetailStub).not.toBeCalled();

    // Alert
    // expect(mockAddalert).toBeCalled();
    // expect(mockAddalert.mock.calls[0]).toEqual(['Lock updated successfully', 'success']);

    // Set Type
    // expect(useContextSetTypeStub).toBeCalled();
    // expect(useContextSetTypeStub.mock.calls[0]).toEqual(['lock', data]);
  });

  test('CLICKED-TYPE = EDIT LOCK and user click on Save return 204 status', () => {
    const data = {
      itemNbr: 100,
      clubNbr: 100,
      blockReasonCode: true
    };
    mockHandleeditlocksave.mockImplementation((props) => props.handleEditLockSave(data));
    editLockRetailStub.mockResolvedValue({ status: 204, data: null });
    render(<div>{renderLayout('editLock', props)}</div>);
    fireEvent.click(screen.queryByTestId('edit-lock'));
    expect(editLockRetailStub).toHaveBeenCalled();
  });

  test('CLICKED-TYPE = EDIT LOCK and user click on Save return error status', () => {
    editLockRetailStub.mockRejectedValueOnce({
      response: { data: { errorMsgList: ['Error occurred while adding lock.'] } }
    });
    render(<div>{renderLayout('editLock', props)}</div>);
    fireEvent.click(screen.queryByTestId('edit-lock'));
    expect(editLockRetailStub).toHaveBeenCalled();
  });

  test('CLICKED-TYPE = LOCK and user click on Edit Click and Save in Drawer ', () => {
    render(<div>{renderLayout('lock', props)}</div>);

    fireEvent.click(screen.queryByTestId('locks'));

    fireEvent.click(screen.queryByTestId('DialogBox'));
    // API CALLS
    expect(createLockRetailStub).not.toBeCalled();
    expect(editLockRetailStub).not.toBeCalled();
    expect(deleteLockRetailStub).toBeCalled();
  });

  test('CLICKED-TYPE = LOCK and user click on Edit Click and Save in Drawer for 200 status', () => {
    deleteLockRetailStub.mockResolvedValue({
      data: { blockDetails: { itemNbr: '', clubNbr: '' } },
      status: 200
    });
    render(<div>{renderLayout('lock', props)}</div>);
    fireEvent.click(screen.getByTestId('delete-locks'));
    expect(screen.getByTestId('DialogBox')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('DialogBox'));
    expect(deleteLockRetailStub).toHaveBeenCalledTimes(1);
  });
  test('CLICKED-TYPE = LOCK and user click on Edit Click and Save in Drawer for 500 status with error message', () => {
    deleteLockRetailStub.mockResolvedValue({
      data: { errorMsgList: ['Error occurred while deleting lock'] },
      status: 500
    });
    render(<div>{renderLayout('lock', props)}</div>);
    fireEvent.click(screen.getByTestId('delete-locks'));
    expect(screen.getByTestId('DialogBox')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('DialogBox'));
    expect(deleteLockRetailStub).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('DialogBox-first-button'));
  });
  test('CLICKED-TYPE = LOCK and user click on Edit Click and Save in Drawer for 500 status without error message', () => {
    deleteLockRetailStub.mockResolvedValue({
      data: { errorMsgList: [] },
      status: 500
    });
    render(<div>{renderLayout('lock', props)}</div>);
    fireEvent.click(screen.getByTestId('delete-locks'));
    expect(screen.getByTestId('DialogBox')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('DialogBox'));
    expect(deleteLockRetailStub).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('DialogBox-cancel'));
  });
});
