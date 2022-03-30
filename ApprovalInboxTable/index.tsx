import React, { useState, useEffect } from 'react';
import AccordionRow from './AccordionRow';
import Chevron from '../../icons/Chevron';
import InnerTable from './InnerTable';
import CheckBoxOutline from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBox from '@material-ui/icons/CheckBox';
import { PendingRetailInfo } from './types';

import styles from './index.module.css';
import { getCurrencySignByCountryCode } from '../../services/getConfig';

interface ApprovalInboxTable {
  data: Array<PendingRetailInfo>;
  selectedRetail(retails: Array<{ id: number; itemNbr: number }>): void;
}

function dateFormatHelper(date: string): string {
  const dateSplit = date.split('-');
  if (dateSplit.length !== 3) return 'No-Date';
  return `${dateSplit[1]}/${dateSplit[2]}/${dateSplit[0]}`;
}

function ApprovalInboxUITable(props: ApprovalInboxTable) {
  const [approvalData, setApprovalData] = useState<Array<PendingRetailInfo>>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [rotate, setRotate] = useState('accordion_icon');
  const [openAccordions, setOpenAccordions] = useState(false);
  const [activeData, setActiveData] = useState([]);

  useEffect(() => {
    const result = props.data.map((m) => {
      if (!m.selectedAll) {
        return {
          ...m,
          selectedAll: false,
          blockedRetails: m.blockedRetails.map((s) => {
            return {
              ...s,
              currentRetail: `${getCurrencySignByCountryCode()}${s.currentRetail}`,
              proposedRetail: `${getCurrencySignByCountryCode()}${s.proposedRetail}`,
              proposedCustomerRetail: `${getCurrencySignByCountryCode()}${
                s.proposedCustomerRetail || '--'
              }`,
              currentCustomerRetail: `${getCurrencySignByCountryCode()}${
                s.currentCustomerRetail || '--'
              }`,
              blockEndDate: dateFormatHelper(s.blockEndDate),
              blockStartDate: dateFormatHelper(s.blockStartDate),
              effectiveDate: dateFormatHelper(s.effectiveDate),
              expirationDate: dateFormatHelper(s.expirationDate),
              itemNbr: m.itemNbr,
              selected: false
            };
          })
        };
      } else {
        return {
          ...m,
          blockedRetails: m.blockedRetails.map((s) => {
            return {
              ...s,
              currentRetail: `${getCurrencySignByCountryCode()}${s.currentRetail}`,
              proposedRetail: `${getCurrencySignByCountryCode()}${s.proposedRetail}`,
              proposedCustomerRetail: `${getCurrencySignByCountryCode()}${
                s.proposedCustomerRetail || '--'
              }`,
              currentCustomerRetail: `${getCurrencySignByCountryCode()}${
                s.currentCustomerRetail || '--'
              }`,
              blockEndDate: dateFormatHelper(s.blockEndDate),
              blockStartDate: dateFormatHelper(s.blockStartDate),
              effectiveDate: dateFormatHelper(s.effectiveDate),
              expirationDate: dateFormatHelper(s.expirationDate),
              selected: true,
              itemNbr: m.itemNbr
            };
          })
        };
      }
    });
    setApprovalData(result);
  }, [JSON.stringify(props.data)]);

  function _toggleAll() {
    const toggled = !isAllSelected;
    const _selectedRetail = [];
    const result = approvalData.map((m) => {
      if (!toggled) {
        return {
          ...m,
          selectedAll: false,
          blockedRetails: m.blockedRetails.map((s) => {
            return {
              ...s,
              selected: false
            };
          })
        };
      } else {
        const selectedRetailItems = {
          ...m,
          selectedAll: true,
          blockedRetails: m.blockedRetails.map((s) => {
            _selectedRetail.push({ id: s.retailActionId, itemNbr: s.itemNbr });
            return {
              ...s,
              selected: true
            };
          })
        };
        return selectedRetailItems;
      }
    });
    setApprovalData(result);
    setIsAllSelected(toggled);
    props.selectedRetail(_selectedRetail);
  }

  function _selectedHeader(itemNbr) {
    setIsAllSelected(false);
    const _selectedRetail = [];
    const result = approvalData.map((m) => {
      if (m.itemNbr !== itemNbr) {
        if (m.selectedAll) {
          m.blockedRetails.forEach((b) => {
            _selectedRetail.push({ id: b.retailActionId, itemNbr: b.itemNbr });
          });
        }
        return { ...m };
      }
      if (!m.selectedAll) {
        const selectedResult = {
          ...m,
          selectedAll: true,
          blockedRetails: m.blockedRetails.map((s) => {
            _selectedRetail.push({ id: s.retailActionId, itemNbr: s.itemNbr });
            return {
              ...s,
              selected: true
            };
          })
        };
        return selectedResult;
      } else {
        return {
          ...m,
          selectedAll: false,
          blockedRetails: m.blockedRetails.map((s) => {
            return {
              ...s,
              selected: false
            };
          })
        };
      }
    });
    props.selectedRetail(_selectedRetail);
    setApprovalData(result);
  }

  function _selectedInnerRow(clubNumber, itemNbr, id) {
    setIsAllSelected(false);
    let isAllFalse = false;
    const _selectedRetail = [];
    const result = approvalData.map((m) => {
      if (m.itemNbr !== itemNbr) {
        m.blockedRetails.forEach((b) => {
          if (b.selected) {
            _selectedRetail.push({ id: b.retailActionId, itemNbr: b.itemNbr });
          }
        });
        return { ...m };
      }
      const newSubTable = m.blockedRetails.map((s) => {
        if (s.clubNumber !== clubNumber && s.retailActionId !== id) {
          if (s.selected) isAllFalse = true;
        }
        if (s.clubNumber === clubNumber && s.retailActionId === id) {
          const toggleSelectedValue = !s.selected;
          if (toggleSelectedValue) {
            isAllFalse = true;
            _selectedRetail.push({ id: s.retailActionId, itemNbr: s.itemNbr });
          }
          return {
            ...s,
            selected: toggleSelectedValue
          };
        } else {
          return {
            ...s
          };
        }
      });
      return {
        ...m,
        blockedRetails: newSubTable,
        selectedAll: isAllFalse
      };
    });
    props.selectedRetail(_selectedRetail);
    setApprovalData(result);
    if (!isAllFalse) setIsAllSelected(false);
  }
  function _toggleOpenAccordion() {
    const tempItems = [];
    if (!openAccordions) {
      setOpenAccordions(true);
      setRotate(`${styles.accordion_icon} ${styles.rotate}`);
      approvalData.map((m) => {
        tempItems.push(m.itemNbr);
      });
      setActiveData(tempItems);
    } else {
      setActiveData([]);
      setOpenAccordions(false);
      setRotate(`${styles.accordion_icon}`);
    }
  }

  function _activeAccordion(ino, isactive) {
    const index = activeData.indexOf(ino);
    if (isactive) {
      if (index !== -1) activeData.splice(index, 1);
    } else if (index === -1) {
      activeData.push(ino);
    }
    if (activeData.length === 0) setRotate(`${styles.accordion_icon}`);
    else if (activeData.length === approvalData.length)
      setRotate(`${styles.accordion_icon} ${styles.rotate} `);
  }

  function _renderHeaders() {
    return (
      <div className={styles.mainHeaderRow}>
        <div style={{ justifyContent: 'start' }}>
          <div onClick={_toggleOpenAccordion} className={styles.chevron_row}>
            <Chevron className={`${rotate}`} width={10} fill={'#777'} />
          </div>
          <div onClick={_toggleAll} style={{ paddingLeft: '85px' }}>
            {isAllSelected ? (
              <CheckBox style={{ color: '#0071E9' }} />
            ) : (
              <CheckBoxOutline style={{ color: '#0071E9' }} />
            )}
          </div>
        </div>
        <div>Item number</div>
        <div>Description</div>
        <div>Category</div>
        <div>Clubs</div>
      </div>
    );
  }

  const _renderRow = () => {
    return approvalData.map((d) => {
      return (
        <AccordionRow
          openAccordions={openAccordions}
          key={d.itemNbr}
          item={d}
          selectedHeader={_selectedHeader}
          openAccordion={_activeAccordion}
        >
          <InnerTable data={d.blockedRetails} selectedInnerRow={_selectedInnerRow} />
        </AccordionRow>
      );
    });
  };

  return (
    <div className={styles.flexTable}>
      <div className={styles.mainTableHead}>{_renderHeaders()}</div>
      {_renderRow()}
    </div>
  );
}

export default ApprovalInboxUITable;
