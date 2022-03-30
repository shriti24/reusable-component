import React from 'react';
import { Select, MenuItem, makeStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const StyledMenuItem = withStyles({
  root: {
    paddingTop: '8px',
    paddingBottom: '8px',
    '&:hover': {
      backgroundColor: '#EBF5FF !important',
      color: '#424242'
    },
    pointerEvents: 'all'
  },
  selected: {
    backgroundColor: '#ffffff !important',
    color: '#424242'
  }
})(MenuItem);

const useStyles = makeStyles(() => ({
  helperText: {
    color: '#212121',
    fontSize: 14,
    fontWeight: 500
  },
  arrowIcon: {
    marginRight: '8px',
    cursor: 'pointer',
    marginBottom: '1px',
    padding: '1px'
  },
  focusDropdown: {
    '&:focus': {
      background: '#FFFFFF'
    }
  },
  selectRoot: {
    lineHeight: '2em',
    paddingRight: '2px !important',
    //...other styles
    '&:focus': {
      backgroundColor: '#E3EAF2'
    },
    '& .MuiList-padding': {
      paddingTop: '0px',
      paddingBottom: '0px'
    }
  },
  menuItem: {
    paddingBottom: '0px !important',
    paddingTop: '0px !important',
    minWidth: '170px'
  },
  noBorder: {
    // width: '70%',
    border: 'none',

    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#8080801a'
    },

    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ffffff',
      border: 'none'
    },

    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  },
  pointer: {
    pointerEvents: 'none'
  }
}));

const HeaderDropDown = ({ name, value, onChange, options, open }) => {
  const classes = useStyles();
  let valueSelected = '';

  return (
    <Select
      inputProps={{
        ['data-testid']: 'header-dropdown-select-input'
      }}
      data-testid={`header-dropdown-select-container`}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left'
        },
        PopoverClasses: { root: classes.pointer },
        classes: { list: classes.menuItem },
        getContentAnchorEl: null
      }}
      classes={{ root: classes.selectRoot }}
      disableUnderline
      IconComponent={() => <KeyboardArrowDownIcon className={classes.arrowIcon} />}
      onChange={(e) => onChange(e)}
      id={name}
      open={open}
      value={value}
      renderValue={() => {
        if (value !== 'Select') {
          options.map((option) => {
            if (option.value === value) {
              valueSelected = `${option.label} sales`;
            }
          });
        }
        if (value === 'Select') {
          valueSelected = <em style={{ fontStyle: 'normal' }}>Select</em>;
        }
        return valueSelected;
      }}
    >
      {options.map((option) => (
        <StyledMenuItem
          data-testid={`header-dropdown-item-${option.value}`}
          key={option.value}
          value={option.value}
        >
          {option.label}
        </StyledMenuItem>
      ))}
    </Select>
  );
};

export default HeaderDropDown;
