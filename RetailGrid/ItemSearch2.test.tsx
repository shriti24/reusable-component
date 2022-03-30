import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { GridContextProvider } from './contextAPI';
import ItemSearch from './ItemSearch';

// jest.mock('./../../../src/components/RetailGrid/contextAPI', () => {
//   return {
//     GridContextProvider: (props) => <div>{props.children}</div>
//   };
// });
jest.spyOn(require('../../components/Can/permission'), 'hasPermission').mockReturnValue([]);

jest.mock('./../../../src/components/Can/permission', () => {
  return {
    hasPermission: jest.fn(() => Promise.resolve({}))
  };
});
jest.mock('../../services/commonPricingDataService', () => {
  return {
    getItemsSuggestions: jest.fn(() =>
      Promise.resolve([
        {
          details: 'SWEET CORN',
          id: 11703,
          label: '11703 - Sweet corn'
        },
        {
          details: 'MEAT FRANKS',
          id: 1170,
          label: '1170 - Meat franks'
        }
      ])
    )
  };
});
const mockStore = configureMockStore();
const store = mockStore({});

const retailData = [
  {
    details: 'SWEET CORN',
    id: 11703,
    label: '11703 - Sweet corn'
  },
  {
    id: 100,
    label: "100 - Sam's membership"
  },
  {
    details: 'MEAT FRANKS',
    id: 1170,
    label: '1170 - Meat franks'
  }
];
jest.spyOn(require('react-redux'), 'useSelector').mockReturnValue(retailData);

const props = {
  value: 1170,
  setValue: jest.fn,
  selectedItems: [1170, 100, 150],
  setSelectedItems: jest.fn,
  retailData: { retailData }
};

it('renders item search component ', () => {
  const component = render(
    <Provider store={store}>
      <ItemSearch {...props} />
    </Provider>
  );

  const label = screen.getByText('Retails');
  expect(label).toBeInTheDocument();
});

it('renders item search input ', () => {
  render(
    <Provider store={store}>
      <ItemSearch {...props} />
    </Provider>
  );

  expect(screen.getByPlaceholderText('Search items')).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText('Search items'), {
    target: { value: '100' }
  });
  expect(screen.getByText('100')).toBeInTheDocument();
});

it('renders item search input ', () => {
  const component = render(
    <Provider store={store}>
      <ItemSearch {...props} />
    </Provider>
  );

  // expect(component.);
});
