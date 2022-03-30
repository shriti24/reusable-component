import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LockCard from './LockCard';

describe('LockCard Functionality', () => {
  const onHandleDeleteLockMock = jest.fn();
  const handleEditLock = jest.fn();

  beforeEach(() => {
    onHandleDeleteLockMock.mockReset();
    handleEditLock.mockReset();
  });

  test('Lock Card - future locks', () => {
    const lock = {
      blockReasonCode: 'TP',
      blockReasonCodeTxt: 'Temp Price',
      createdTimeStamp: '2022-01-14T08:41:08.377Z',
      creatorAppId: 'BLOCK_API',
      creatorId: 'T0E0S1T   ',
      endDate: '2040-12-31',
      lastChangeAppId: 'BLOCK_API',
      lastChangeId: null,
      lastChangeTimeStamp: null,
      priceBlockId: 62510,
      startDate: '2022-01-15'
    };
    render(
      <LockCard
        club={8194}
        item={3440}
        status={'Future'}
        lock={lock}
        onHandleDeleteLock={onHandleDeleteLockMock}
        handleEditLock={handleEditLock}
      />
    );
    fireEvent.mouseEnter(screen.getByTestId('test-iconbutton-id'));
    expect(screen.getByTestId('test-cardcontent-id')).toBeInTheDocument();
    const deleteIcon = screen.getByTestId('delete-icon');
    const editIcon = screen.getByTestId('edit-icon');
    expect(deleteIcon).toBeInTheDocument();
    expect(editIcon).toBeInTheDocument();
    fireEvent.click(deleteIcon);
    expect(onHandleDeleteLockMock).toHaveBeenCalledTimes(1);
    fireEvent.click(editIcon);
    expect(handleEditLock).toHaveBeenCalledTimes(1);
    fireEvent.mouseLeave(screen.getByTestId('test-iconbutton-id'));
    expect(deleteIcon).not.toBeInTheDocument();
    expect(editIcon).not.toBeInTheDocument();
  });

  test('Lock Card - Current locks', () => {
    const lock = {
      priceBlockId: 62513,
      blockReasonCode: 'PI',
      blockReasonCodeTxt: 'Investment',
      startDate: '2022-01-14',
      endDate: '2049-12-31',
      creatorId: 'T0E0S1T   ',
      createdTimeStamp: '2022-01-14T11:16:53.55Z',
      lastChangeId: 'T0E0S1T   ',
      lastChangeTimeStamp: '2022-01-14T11:16:53.593Z',
      creatorAppId: 'BLOCK_API',
      lastChangeAppId: 'BLOCK_API'
    };
    render(
      <LockCard
        club={3440}
        item={4741}
        status={'Active'}
        lock={lock}
        onHandleDeleteLock={onHandleDeleteLockMock}
        handleEditLock={handleEditLock}
      />
    );
    fireEvent.mouseEnter(screen.getByTestId('test-iconbutton-id'));
    expect(screen.getByTestId('test-cardcontent-id')).toBeInTheDocument();
    const deleteIcon = screen.getByTestId('active-delete-icon');
    const editIcon = screen.getByTestId('test-edit-id');
    expect(deleteIcon).toBeInTheDocument();
    expect(editIcon).toBeInTheDocument();
    fireEvent.click(deleteIcon);
    expect(onHandleDeleteLockMock).toHaveBeenCalledTimes(1);
    fireEvent.click(editIcon);
    expect(handleEditLock).toHaveBeenCalledTimes(1);
    fireEvent.mouseLeave(screen.getByTestId('test-iconbutton-id'));
    expect(deleteIcon).not.toBeInTheDocument();
    expect(editIcon).not.toBeInTheDocument();
  });

  test('Lock Card - Current locks with PII', () => {
    const lock = {
      priceBlockId: 62511,
      blockReasonCode: 'PII',
      blockReasonCodeTxt: 'Price investment',
      startDate: '2022-01-14',
      endDate: '2049-12-31',
      creatorId: 'T0E0S1T   ',
      createdTimeStamp: '2022-01-14T10:48:44.883Z',
      lastChangeId: 'T0E0S1T   ',
      lastChangeTimeStamp: '2022-01-14T10:48:44.933Z',
      creatorAppId: 'BLOCK_API',
      lastChangeAppId: 'BLOCK_API'
    };
    render(
      <LockCard
        club={3440}
        item={4739}
        status={'Active'}
        lock={lock}
        onHandleDeleteLock={jest.fn()}
        handleEditLock={jest.fn()}
      />
    );
    fireEvent.mouseEnter(screen.getByTestId('test-iconbutton-id'));
    expect(screen.getByTestId('test-cardcontent-id')).toBeInTheDocument();
  });
});
