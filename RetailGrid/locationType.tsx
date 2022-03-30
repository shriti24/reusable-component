import React from 'react';
import style from './retailGrid.module.css';

const LocationType = (props) => {
  const { params } = props;

  const typeData = (params) => {
    const type = params?.data?.type?.toLowerCase();
    const newLocation = (className, type) => (
      <span data-testid="location-type-label" className={className}>
        {type}
      </span>
    );

    switch (type) {
      case 'club':
        return newLocation(style.typeClubData, type);
      case 'site':
        return newLocation(style.typeSiteData, type);
      case 'ecomm fulfillment':
        return newLocation(style.typeEcommData, type);
      case 'distribution center':
        return newLocation(style.typeDistributionData, type);
      default:
        return null;
    }
  };

  return (
    <div data-testid="location-type-container" className={style.typeContainer}>
      {typeData(params)}
    </div>
  );
};

export default LocationType;
