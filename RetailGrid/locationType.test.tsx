// Lib
import * as React from 'react';
import { render, screen } from '@testing-library/react';

import LocationType from './locationType';

describe('Location Type', () => {
  test('No Location Type is passed', () => {
    render(<LocationType />);

    expect(screen.getByTestId('location-type-container')).toBeInTheDocument();
    expect(screen.queryByTestId('location-type-label')).toBeNull();
  });

  test('Location Type - Club', () => {
    render(<LocationType params={{ data: { type: 'club' } }} />);

    expect(screen.getByTestId('location-type-container')).toBeInTheDocument();
    expect(screen.getByTestId('location-type-label')).toBeInTheDocument();

    expect(screen.getByTestId('location-type-label')).toHaveTextContent('club');
    expect(screen.getByTestId('location-type-label')).toHaveClass('typeClubData');
  });

  test('Location Type - site', () => {
    render(<LocationType params={{ data: { type: 'site' } }} />);

    expect(screen.getByTestId('location-type-container')).toBeInTheDocument();
    expect(screen.getByTestId('location-type-label')).toBeInTheDocument();

    expect(screen.getByTestId('location-type-label')).toHaveTextContent('site');
    expect(screen.getByTestId('location-type-label')).toHaveClass('typeSiteData');
  });
  test('Location Type - ecomm fulfillment', () => {
    render(<LocationType params={{ data: { type: 'ecomm fulfillment' } }} />);

    expect(screen.getByTestId('location-type-container')).toBeInTheDocument();
    expect(screen.getByTestId('location-type-label')).toBeInTheDocument();

    expect(screen.getByTestId('location-type-label')).toHaveTextContent('ecomm fulfillment');
    expect(screen.getByTestId('location-type-label')).toHaveClass('typeEcommData');
  });
  test('Location Type - distribution center', () => {
    render(<LocationType params={{ data: { type: 'distribution center' } }} />);

    expect(screen.getByTestId('location-type-container')).toBeInTheDocument();
    expect(screen.getByTestId('location-type-label')).toBeInTheDocument();

    expect(screen.getByTestId('location-type-label')).toHaveTextContent('distribution center');
    expect(screen.getByTestId('location-type-label')).toHaveClass('typeDistributionData');
  });
});
