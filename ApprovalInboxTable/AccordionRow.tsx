import React, { useState, useRef, ReactNode, useEffect } from 'react';
import Chevron from '../../icons/Chevron';
import CheckBoxOutline from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBox from '@material-ui/icons/CheckBox';
import { PendingRetailInfo } from './types';

import styles from './AccordionRow.module.css';

interface AccordionRow {
  item: PendingRetailInfo;
  selectedHeader(itemNbr: number): void;
  children: ReactNode;
  openAccordions: Boolean;
  openAccordion(itemNbr: number, isOpen: boolean): void;
}

function AccordionRowUI(props: AccordionRow) {
  const [height, setHeight] = useState('0px');
  const [rotate, setRotate] = useState('accordion_icon');
  const { item } = props;

  const content = useRef(null);

  useEffect(() => {
    setHeight(props.openAccordions ? `${content.current.scrollHeight}px` : '0px');
    setRotate(
      props.openAccordions
        ? `${styles.accordion_icon} ${styles.rotate}`
        : `${styles.accordion_icon}`
    );
  }, [props.openAccordions]);

  function _toggleAccordion() {
    setHeight(height !== '0px' ? '0px' : `${content.current.scrollHeight}px`);
    setRotate(
      height !== '0px' ? `${styles.accordion_icon}` : `${styles.accordion_icon} ${styles.rotate}`
    );
    const activeacc = height !== '0px';
    props.openAccordion(item.itemNbr, activeacc);
  }

  function _toggleSelectAll() {
    props.selectedHeader(item.itemNbr);
  }
  return (
    <>
      <div className={styles.main_body_row}>
        <div className={styles.row}>
          <div
            onClick={_toggleAccordion}
            className={styles.chevron_row}
            data-testid="open_accordion"
          >
            <Chevron className={`${rotate}`} width={10} fill={'#777'} />
          </div>
          <div onClick={_toggleSelectAll} className={styles.select_all}>
            {item.selectedAll ? (
              <CheckBox className={styles.box_color} data-testid="checked_item" />
            ) : (
              <CheckBoxOutline className={styles.box_color} data-testid="unchecked_item" />
            )}
          </div>
        </div>
        <div className={styles.row}>{item.itemNbr}</div>
        <div className={styles.row}>{item.itemDesc}</div>
        <div className={styles.row}>{item.categoryDesc}</div>
        <div className={styles.row}>
          <div style={{ position: 'relative', left: '24px' }}>{item.blockedRetails.length}</div>
        </div>
      </div>
      <div ref={content} style={{ maxHeight: `${height}` }} className={styles.accordion_content}>
        {props.children}
      </div>
    </>
  );
}

export default AccordionRowUI;
