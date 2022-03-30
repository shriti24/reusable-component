import * as React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';

import KababMenu from './KababMenu';

describe('KababMenu', () => {
  test('Intial Render', () => {
    const { container } = render(
      <KababMenu>
        <div data-testid="children">Children</div>
      </KababMenu>
    );

    expect(container.querySelector('#kebab_')).toBeInTheDocument();
    expect(container.querySelector('.popover')).toBeNull();

    expect(screen.queryByTestId('children')).toBeNull();
  });

  test('User Click on the icon', () => {
    const { container } = render(
      <KababMenu>
        <div data-testid="children">Children</div>
      </KababMenu>
    );

    expect(screen.getByTestId('test-popover-open')).toBeInTheDocument();

    act(() => {
      fireEvent.mouseEnter(screen.getByTestId('test-popover-open'));
    });

    expect(screen.getByTestId('children')).toBeInTheDocument();

    act(() => {
      fireEvent.mouseLeave(container.querySelector('.iconDivContainer'));
    });

    expect(screen.queryByTestId('children')).toBeNull();
  });
});
