import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { UploadMenu } from './UploadMenu';

describe('UploadMenu', () => {
  let handleUploadOpenStub;

  beforeEach(() => {
    handleUploadOpenStub = jest.fn();
  });

  test('popList is false', () => {
    render(<UploadMenu popList={false} uploadTypes={[]} handleUploadOpen={handleUploadOpenStub} />);

    expect(screen.queryByTestId('upload-menu-container')).toBeNull();
  });

  test('popList is true and uploadTypes is empty array', () => {
    render(<UploadMenu popList uploadTypes={[]} handleUploadOpen={handleUploadOpenStub} />);
    expect(screen.queryByTestId('upload-menu-container')).toBeNull();
  });

  test('popList is true and uploadTypes is not empty array', () => {
    render(
      <UploadMenu
        popList
        uploadTypes={[
          { title: 'title', value: 'value' },
          { title: 'title1', value: 'value1' }
        ]}
        handleUploadOpen={handleUploadOpenStub}
      />
    );
    expect(screen.getByTestId('upload-menu-container')).toBeInTheDocument();

    expect(screen.getByTestId('upload-menu-item-title')).toBeInTheDocument();
    expect(screen.getByTestId('upload-menu-item-title')).toHaveTextContent('value');
  });

  test('User Click on the item', () => {
    render(
      <UploadMenu
        popList
        uploadTypes={[
          { title: 'title', value: 'value' },
          { title: 'title1', value: 'value1' }
        ]}
        handleUploadOpen={handleUploadOpenStub}
      />
    );
    expect(screen.getByTestId('upload-menu-container')).toBeInTheDocument();

    expect(screen.getByTestId('upload-menu-item-title')).toBeInTheDocument();
    expect(screen.getByTestId('upload-menu-item-title')).toHaveTextContent('value');

    fireEvent.click(screen.getByTestId('upload-menu-item-title'));

    expect(handleUploadOpenStub).toBeCalled();
    expect(handleUploadOpenStub.mock.calls[0][0]).toBe('title');
  });
});
