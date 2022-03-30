// src/common/test-utils/render-component.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastContext } from '../../../../providers/ToastProvider';
import SnackBar from '.';

// Mocks
const errorMock = null;

function renderComponent(children, { alert = errorMock, removeAlert = () => {} } = {}) {
  const addErrorSpy = () => {};

  return {
    ...render(
      <ToastContext.Provider
        value={{
          alert,
          addAlert: addErrorSpy,
          removeAlert: removeAlert
        }}
      >
        {children}
      </ToastContext.Provider>
    ),
    addErrorSpy,
    removeAlert
  };
}

it('show alert', async () => {
  const ERROR_MESSAGE = 'SOME_ERROR';
  renderComponent(<SnackBar />, {
    alert: [
      {
        message: ERROR_MESSAGE,
        status: 'success'
      }
    ]
  });
  expect(screen.getByText('SOME_ERROR')).toBeInTheDocument();
});

it('close alert', async () => {
  const ERROR_MESSAGE = 'SOME_ERROR';
  const removeAlertSpy = jest.fn();
  renderComponent(<SnackBar />, {
    alert: [
      {
        message: ERROR_MESSAGE,
        status: 'error'
      }
    ],
    removeAlert: removeAlertSpy
  });
  const list = screen.getByTestId('close');
  fireEvent.click(list);
  expect(removeAlertSpy).toBeCalled();
});

it('show action text', async () => {
  const ERROR_MESSAGE = 'SOME_ERROR';
  const removeAlertSpy = jest.fn();
  renderComponent(<SnackBar />, {
    alert: [
      {
        message: ERROR_MESSAGE,
        status: 'error',
        action: <div>Test</div>
      }
    ],
    removeAlert: removeAlertSpy
  });
  expect(screen.getByText('Test')).toBeInTheDocument();
});
