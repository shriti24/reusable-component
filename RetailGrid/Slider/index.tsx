import React, { FC, useState, useEffect } from 'react';
import styles from './index.module.css';
import CloseIcon from '@material-ui/icons/Close';
import { GridContextAPI } from '../contextAPI';
import { renderHeader, renderLayout } from './DrawerLayouts';

interface Slider {
  type: string;
}

const Slider: FC<Slider> = () => {
  const ref = React.useRef(null);
  const [width, setWidth] = useState('0px');
  const [open, setOpen] = useState(false);
  const [closeData, setCloseData] = useState<unknown>();
  const _gridContext = React.useContext(GridContextAPI);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [open]);

  useEffect(() => {
    if (_gridContext.selectedType !== '' && _gridContext.selectedType.toUpperCase() !== 'DELETE')
      setOpen(true);
    else setOpen(false);
  }, [_gridContext.selectedType]);

  useEffect(() => {
    setWidth(open ? '355px' : '0px');
    setCloseData(_gridContext.data);
  }, [open]);

  const handleClickOutside = (event) => {
    const { target } = event;
    let isChildComponent = false;
    if (ref.current && ref.current.contains(event.target)) {
      isChildComponent = true;
    }
    if (!isChildComponent) {
      const arrayElements =
        (ref.current && ref.current.children && Array.from(ref.current.children)) || [];
      for (const item of arrayElements) {
        if ((item as Element).contains(target)) {
          isChildComponent = true;
          break;
        }
      }
    }
    if (!isChildComponent) {
      const popoverClass = ['MuiPaper-root', 'MuiPopover-paper'];
      let node = target.parentNode;
      let nodeClass = target.classList;
      let classes = nodeClass;
      while (node) {
        let hasClass = false;
        for (const cls of classes) {
          if (popoverClass.includes(cls)) {
            node = null;
            hasClass = true;
            isChildComponent = true;
            break;
          }
        }
        if (hasClass) {
          break;
        } else {
          classes = node.classList;
          node = node.parentNode;
        }
      }
    }
    if (!isChildComponent) {
      if (open) {
        setOpen(false);
        _gridContext.clearType();
        _gridContext.setRefresh();
      }
    }
  };

  const _toggleSlider = () => {
    const flipOpen = !open;
    setOpen(flipOpen);
    if (open) {
      setOpen(false);
      _gridContext.clearType();
      _gridContext.setRefresh();
    }
  };

  return (
    <div id="sams-slider" ref={ref} style={{ width: `${width}` }} className={styles.open}>
      <div className={styles.slideOutHeader}>
        <div className={styles.DrawerHeader}>
          {renderHeader(_gridContext.selectedType, closeData)}
        </div>
        <button data-testid="close-btn" onClick={_toggleSlider} className={styles.closeButton}>
          <CloseIcon />
        </button>
      </div>
      {renderLayout(_gridContext.selectedType, _gridContext.data)}
    </div>
  );
};

export default Slider;
