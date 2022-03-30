import React, { FC } from 'react';
import { Data } from '../contextAPI';
import Styles from './layout.module.css';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const InfoItemLayout: FC<Data> = (data) => {
  const { t } = useTranslation();

  return (
    <div data-testid="info-item-layout-container" className={`${Styles.item}`}>
      <div className={Styles.itemText}>
        <span className={Styles.formText}> Item:</span>
        <span data-testid="info-item-layout-itemNbr"> {data.itemNbr} </span>
      </div>
      <div className={clsx(Styles.itemText)}>
        <span className={Styles.formText}> Description:</span>
        <span data-testid="info-item-layout-itemDesc"> {data.itemDesc} </span>
      </div>
      <div className={Styles.itemText}>
        <span className={Styles.formText}> Status:</span>
        <span data-testid="info-item-layout-status"> {data.status} </span>
      </div>
      <div className={Styles.itemText}>
        <span className={Styles.formText}> Club:</span>
        <span data-testid="info-item-layout-clubNbr"> {data.clubNbr} </span>
      </div>
      <div className={Styles.itemText}>
        <span className={Styles.formText}> {t('retailsPage.retailPrice')}: </span>
        <span data-testid="info-item-layout-currentActiveRetailPrice">
          ${data.currentActiveRetailPrice}
        </span>
      </div>
    </div>
  );
};
export default InfoItemLayout;
