import React, { FC } from 'react';
import { Value, Data } from '../contextAPI';
import Styles from './layout.module.css';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { getCountryCode } from '../../../services/getConfig';

export const getRetailAfterRule = (data) => {
  const COUNTRY_CODE = getCountryCode();
  switch (COUNTRY_CODE) {
    case 'US':
      return data.retailAmount;
    case 'MX':
      return data.customerRetailAmt;
  }
};

const InfoClubLayout: FC<Value> = (values) => {
  const { t } = useTranslation();
  return (
    <div data-testid="info-club-layout-container">
      <div data-testid="info-club-header" className={Styles.DrawerHeader}>
        Club competitor rule
      </div>
      <div className={`${Styles.item}`}>
        <div className={Styles.itemText}>
          <span className={Styles.formText}> Competitor:</span>
          <span data-testid="info-club-competitor-text"> {values.competitor} </span>
        </div>
        <div className={clsx(Styles.itemText)}>
          <span className={Styles.formText}> Description:</span>
          <span data-testid="info-club-description-text">
            Gap {values.spread}% | Floor {values.floor}%
          </span>
        </div>
        <div className={Styles.itemText}>
          <span className={Styles.formText}> {t('retailsPage.retailAfterRule')}:</span>
          <span data-testid="info-club-amount-text"> ${getRetailAfterRule(values)} </span>
        </div>
        <div className={Styles.itemText}>
          <span className={Styles.formText}> Created by:</span>
          <span data-testid="info-club-created-by-text"> {values.createdBy} </span>
        </div>
      </div>
    </div>
  );
};
export default InfoClubLayout;
