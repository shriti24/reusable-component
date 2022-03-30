import React, { forwardRef, useEffect, useImperativeHandle, useState, FC } from 'react';
import styles from './retailGrid.module.css';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import LockClosed from '../../../public/static/LockClosed.svg';
import ScheduledLock from '../../../public/static/ScheduledLock.svg';

interface LockFilter {
  children: any;
  agGridReact: any;
  filterChangedCallback(): void;
}

export default forwardRef((props: LockFilter, ref) => {
  const allObj = { value: '(Select All)', selected: true };
  const [allCheck, setCheck] = useState(1);
  const lockSet = [
    ...new Set(props?.agGridReact?.gridOptions?.rowData?.map((v: { lock: string }) => v.lock))
  ].sort();

  const setUpFilterData = () => {
    const locks = lockSet.map((v: string) => ({ value: v, selected: true }));
    return [allObj, ...locks];
  };
  const initialData = setUpFilterData();
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(initialData);
  const [validTypes, setValidLock] = useState(lockSet);
  const handleSearch = (val: string) => setFilter(val);

  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params) {
        if (validTypes.includes(params.data?.lock)) return true;
        else return false;
      },

      isFilterActive() {
        return (
          filteredData?.filter((s) => s.selected && s.value !== allObj.value).length <
          initialData.length - 1
        );
      }
    };
  });

  useEffect(() => {
    props.filterChangedCallback();
  }, [validTypes]);

  useEffect(() => {
    const tempResult = filteredData?.filter((v) => v.value !== allObj.value);
    if (tempResult.every((val) => val.selected)) {
      setCheck(1);
    } else if (tempResult.some((val) => val.selected)) setCheck(0);
    else setCheck(-1);
  }, [filteredData]);

  const handleFilterData = (item: { value: any; selected: boolean }) => {
    const lockType = [...validTypes];
    const updatedFilteredData =
      item.value === allObj.value
        ? filteredData.map((result) => {
            result.selected = item.selected;
            return result;
          })
        : filteredData.map((s) => {
            if (s.value === item.value) {
              s.selected = item.selected;
            }
            return s;
          });
    for (let output = 0; output < updatedFilteredData.length; output++) {
      if (
        lockType.includes(updatedFilteredData[output].value) &&
        !updatedFilteredData[output].selected &&
        updatedFilteredData[output].value !== allObj.value
      ) {
        lockType.splice(
          lockType.findIndex((datum) => datum === updatedFilteredData[output].value),
          1
        );
      } else if (
        !lockType.includes(updatedFilteredData[output].value) &&
        updatedFilteredData[output].selected &&
        updatedFilteredData[output].value !== allObj.value
      ) {
        lockType.push(updatedFilteredData[output].value);
      }
    }
    if (item.value !== allObj.value) {
      updatedFilteredData.map((s) => {
        if (updatedFilteredData.length - 1 !== lockType.length) {
          if (s.value === allObj.value) {
            s.selected = false;
          }
        } else {
          if (s.value === allObj.value) {
            s.selected = true;
          }
        }
      });
    }
    setFilteredData(updatedFilteredData);
    setValidLock(lockType);
  };
  useEffect(() => {
    let result = [];
    if (!filter.length && filteredData.length < initialData.length - 1) {
      result = initialData.map((val) => {
        if (!validTypes.includes(val.value)) return { ...val, selected: false };
        else return val;
      });
    } else {
      result = initialData
        .filter((d) => d?.value?.toString()?.toLowerCase().includes(filter.toLowerCase()))
        .map((v) => {
          if (!validTypes.includes(v.value)) return { ...v, selected: false };
          else return v;
        });
      if (
        result.length &&
        result.length < initialData.length &&
        !result.some((v) => v.value === allObj.value)
      ) {
        const resultCheck = result.filter((v) => v.selected).length === result.length;
        result.unshift({ ...allObj, selected: resultCheck });
      }
    }
    setFilteredData(result);
  }, [filter]);
  const handleClick = () => {
    setFilteredData(initialData);
    setValidLock(lockSet);
    setFilter('');
  };

  return (
    <SearchInput onSearch={handleSearch} handleClick={handleClick} filteredData={filteredData}>
      {filteredData.map((val) => (
        <FilterDatum
          handleFilterData={handleFilterData}
          key={val.value}
          data={val}
          allCheck={allCheck}
        />
      ))}
    </SearchInput>
  );
});

interface IFilterDatum {
  /**
   * Function to get selected lock
   */
  handleFilterData(value: { value: string; selected: boolean }): void;
  /**
   * Data for filter list
   */
  data: {
    value: string;
    selected: boolean;
  };
  /**
   * Toggle Checkbox for All
   */
  allCheck: number;
}

export const FilterDatum: FC<IFilterDatum> = (props) => {
  const [selected, setSelected] = useState(false);
  const datum = props.data.value;
  useEffect(() => {
    setSelected(props.data.selected);
  }, [props.data.selected]);
  const handleFilterCheck = () => {
    props.handleFilterData({ ...props.data, selected: !selected });
    setSelected(!selected);
  };

  const showIcon = (value) => {
    switch (value) {
      case 'Locked':
        return <img data-testid="locked-image" src={LockClosed} className={styles.locked} />;
      case 'Scheduled lock':
        return (
          <img
            data-testid="Scheduled-lock-image"
            src={ScheduledLock}
            className={styles.scheduleLocked}
          />
        );
      default:
        return null;
    }
  };

  const showCheckIcon = (value) => {
    let htmlIcon = null;
    if (value === '(Select All)') {
      htmlIcon = props.allCheck ? (
        props.allCheck === 1 ? (
          <CheckBoxIcon className={styles.itemCheckbox} />
        ) : (
          <CheckBoxOutlineBlankIcon className={styles.itemCheckbox} />
        )
      ) : (
        <IndeterminateCheckBoxIcon className={styles.itemCheckbox} />
      );
    } else {
      htmlIcon = selected ? (
        <CheckBoxIcon data-testid="check-box-icon" className={styles.itemCheckbox} />
      ) : (
        <CheckBoxOutlineBlankIcon
          data-testid="check-box-outlined-icon"
          className={styles.itemCheckbox}
        />
      );
    }
    return htmlIcon;
  };

  return (
    <li
      className={styles.items}
      onClick={handleFilterCheck}
      style={{ lineHeight: showIcon(datum) && '10px' }}
    >
      {showCheckIcon(datum)}
      <label className={styles.itemLabel}>
        <span>{showIcon(datum)}</span>
        <span
          className={showIcon(datum) ? styles.itemIcon : null}
          style={{
            marginLeft: datum === 'Locked' ? '10px' : '0px',
            lineHeight: datum === 'Scheduled lock' && '17px'
          }}
        >
          {datum}
        </span>
      </label>
    </li>
  );
};

interface ISearchInput {
  /**
   * Array of Filter Elements
   */
  children: any;
  /**
   * Function for search box change
   */
  onSearch(string): void;
  /**
   * To clear selection
   */
  handleClick(): void;
  /**
   * Filter Data
   */
  filteredData: any;
}

export const SearchInput: FC<ISearchInput> = (props) => {
  const [inputValue, setInputValue] = useState('');
  const handleChange = (event) => {
    if (props.onSearch || event.target.value === '') {
      setInputValue(event.target.value);
      props.onSearch(event.target.value);
    }
  };
  const handleClick = () => {
    setInputValue('');
    props.handleClick();
  };

  return (
    <div className={styles.filterDropDown}>
      <div className={styles.inputContainer}>
        <input
          data-testid="search-input"
          type="text"
          className={styles.searchBar}
          placeholder="Search..."
          onChange={handleChange}
          value={inputValue}
        />
      </div>
      <div className={styles.searchResult}>
        {props.filteredData?.length ? (
          <ul className={styles.filterItemsList}>{props.children}</ul>
        ) : (
          <span className={styles.noMatch}>No matches.</span>
        )}
      </div>
      <div className={styles.clearBox}>
        <button className={styles.clearBtn} onClick={handleClick}>
          Clear
        </button>
      </div>
    </div>
  );
};
