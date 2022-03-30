import React, { useState } from 'react';
import styles from './retailGrid.module.css';
import HeaderDropDown from './HeaderDropdown';
import { hearderOptions } from './util/constants';
import { ClickAwayListener } from '@material-ui/core';

const TopHeader = ({ handleSalesDataChange, coordinateMap }) => {
  const options = hearderOptions;
  const [value, setValue] = useState(hearderOptions[0].value);

  const [openDropdown, setOpenDropdown] = useState(null);

  const handleChange = (e: any) => {
    setOpenDropdown(null);
    setValue(e.target.value);
    handleSalesDataChange(e.target.value);
  };

  const handleOpen = (e: any = null) => {
    const index = e && e.target ? e.target.id : e;
    setOpenDropdown(index !== '' ? index : null);
  };

  const handleClick = (index: number, type?: string): void => {
    if (index == openDropdown) {
      handleOpen();
    } else if (type === 'mousedown') {
      handleOpen(index);
    }
  };

  return (
    <div className={styles.encloseHeader}>
      {coordinateMap &&
        coordinateMap['data'] &&
        coordinateMap['data'].map((styleVal, index) => {
          return (
            <ClickAwayListener onClickAway={() => handleClick(index)} key={index}>
              <div
                className={styles.headerWrapper}
                style={{ width: styleVal[1], left: styleVal[0] }}
                data-testid={`top-header-${index}`}
                onMouseDown={(e) => handleClick(index, e.type)}
              >
                <HeaderDropDown
                  name={'' + index}
                  value={value}
                  onChange={handleChange}
                  options={options}
                  open={index == openDropdown}
                />
              </div>
            </ClickAwayListener>
          );
        })}
    </div>
  );
};

export default TopHeader;
