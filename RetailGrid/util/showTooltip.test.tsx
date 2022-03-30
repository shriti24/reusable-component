import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { showTooltip as ShowTooltip } from './showTooltip';

jest.spyOn(require('./getLockStatus'), 'checkLock').mockImplementation(() => 'Lock Status');

describe('showTooltip', () => {
  test('rendering', () => {
    const { container } = render(<ShowTooltip data={{ lock: 'ToolTipHeader' }} />);

    expect(screen.getByText('ToolTipHeader:')).toBeInTheDocument();
    expect(screen.getByText('ToolTipHeader:')).toHaveClass('lockHeader');

    expect(screen.getByText('Lock Status')).toBeInTheDocument();
    expect(screen.getByText('Lock Status')).toHaveClass('tooltipLockDetails');
  });
});
