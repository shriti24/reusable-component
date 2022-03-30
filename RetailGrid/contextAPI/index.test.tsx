import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import moment from 'moment';

import { GridContextProvider, GridContext, Data, GridContextAPI } from './index';

jest.mock('../../../services/retailCreationService', () => {
  const mockData = Promise.resolve({
    status: 200
  });
  return {
    modifyRetail: () => {
      return mockData;
    },
    createCurrentRetail: () => {
      return mockData;
    },
    createRetail: () => {
      return mockData;
    }
  };
});

jest.mock('../../../services/retail/retailReasonCodeService', () => {
  return {
    getReasonCode: () => {
      return Promise.resolve({
        reasonCode: [
          {
            retailType: 'PI',
            retailReason: 'CC',
            retailReasonCodeTxt: 'Cost Change'
          },
          {
            retailType: 'MD',
            retailReason: 'LGY',
            retailReasonCodeTxt: 'Legacy'
          }
        ],
        status: 200
      });
    }
  };
});

jest.mock('../../../services/getConfig', () => {
  return {
    getUser: () => {
      return 'userid';
    },
    getPath: jest.fn(() => {
      return {
        reasonCodePath: '/reasonCodePath',
        currentRetailPath: '/currentRetailPath',
        pendingRetailPath: '/pendingRetailPath'
      };
    }),
    getHeaders: jest.fn(() => {
      return {
        'Content-Type': 'application/json',
        'WM_CONSUMER.ID': '',
        'WM_SVC.ENV': '',
        'WM_SVC.NAME': '',
        'COUNTRY-CODE': 'US',
        'REQUEST-SOURCE': false,
        userId: 'MPARAMA'
      };
    }),
    getConfig: () => {
      return {
        publicRuntimeConfig: {
          WCNP_RETAIL_EXCUTION_API_KEY: 'WCNP_RETAIL_EXCUTION_API_KEY'
        }
      };
    }
  };
});

const MockGridComponent = (props) => {
  const _gridContext = React.useContext(GridContextAPI);

  const _setType = () => {
    _gridContext.setType(props.type, props.data);
  };

  const _save = () => {
    _gridContext.save(props.data);
  };

  return (
    <div>
      <div onClick={_setType} data-testid="grid-set-type"></div>
      <div onClick={_gridContext.clearType} data-testid="grid-clear-type"></div>
      <div onClick={_gridContext.close} data-testid="grid-close-type"></div>
      <div onClick={_gridContext.setDelete} data-testid="grid-delete-type"></div>
      <div onClick={_save} data-testid="grid-save-type"></div>
    </div>
  );
};

const MockContextComponent = (props) => {
  return (
    <GridContextProvider>
      <MockGridComponent {...props} />
    </GridContextProvider>
  );
};

describe('Context API', () => {
  it('should render grid context with provided data for edit', async () => {
    const { container } = render(
      <MockContextComponent
        type={''}
        data={{
          effectiveDate: moment(new Date()).format('MM/DD/YYYY'),
          expirationDate: moment(new Date()).format('MM/DD/YYYY'),
          isEdit: true,
          status: 'Current',
          retailReasonCode: 'CC'
        }}
      />
    );
    fireEvent.click(screen.getByTestId('grid-set-type'));
    fireEvent.click(screen.getByTestId('grid-clear-type'));
    fireEvent.click(screen.getByTestId('grid-close-type'));
    fireEvent.click(screen.getByTestId('grid-delete-type'));
    fireEvent.click(screen.getByTestId('grid-save-type'));
    await waitFor(() => {
      expect(container).toBeDefined();
    });
  });
  it('should render grid context with its data for add', async () => {
    const { container } = render(
      <MockContextComponent
        type={''}
        data={{
          effectiveDate: moment(new Date()).format('MM/DD/YYYY'),
          expirationDate: moment(new Date()).format('MM/DD/YYYY'),
          isEdit: false,
          status: 'Current',
          retailReasonCode: 'CC'
        }}
      />
    );
    fireEvent.click(screen.getByTestId('grid-save-type'));
    await waitFor(() => {
      expect(container).toBeDefined();
    });
  });
  it('should render grid context with provided data for add, with effective date is not same as today', async () => {
    const { container } = render(
      <MockContextComponent
        type={''}
        data={{
          effectiveDate: moment('01/01/2000').format('MM/DD/YYYY'),
          expirationDate: moment('01/01/2002').format('MM/DD/YYYY'),
          isEdit: false,
          status: 'Current',
          retailReasonCode: 'CC'
        }}
      />
    );
    fireEvent.click(screen.getByTestId('grid-save-type'));
    await waitFor(() => {
      expect(container).toBeDefined();
    });
  });
  it('should get actions for grid context', () => {
    const gridContext = { ...GridContext };
    gridContext.setType('', {} as Data);
    gridContext.clearType();
    gridContext.close();
    gridContext.save({} as Data);
    gridContext.setRefresh();
    gridContext.getReasonData();
    gridContext.setDelete();
    expect(gridContext).toBeDefined();
  });
});
