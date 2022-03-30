import React, { useContext } from 'react';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { KebabIcons as IC } from '../../../constants/common';
import useStyles from './useStyles';
import { getKebabActionList } from '@constants/RoleBaseRules';

import LockClosedIcon from '../../../icons/LockClosedIcon';
import RoleContext from '../../../pages/RoleContext';

// const mappingRetailPrice = (props) => {
//   const findBase = props.propsData?.data[0]?.currentRetails?.find(
//     (item) => item.retailType === 'BP'
//   );
//   return findBase.retailAmount;
// };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const ShowAction = (props) => {
  const { userGroup } = useContext(RoleContext);
  const country = String(userGroup.description);
  const userRole = String(userGroup.name.split('-', 1)[0]).toUpperCase();
  const actionList = [
    {
      value: 'lock',
      tooltipVal: IC.LOCK,
      icon: (
        <LockClosedIcon
          fill="#0071e9"
          width="inherit"
          height="inherit"
          styles={{ padding: '1.5px' }}
        />
      )
    },
    {
      value: 'add',
      tooltipVal: IC.ADD_FUTURE,
      icon: 'add'
    },
    { value: 'delete', tooltipVal: IC.REMOVE, icon: 'delete' },
    {
      value: 'edit',
      tooltipVal: IC.EDIT_CURRENT,
      icon: 'edit'
    },
    { value: 'info', tooltipVal: IC.INFO, icon: 'info_outlined' },
    { value: 'delete', tooltipVal: IC.REMOVE_FUTURE, icon: 'delete' },
    { value: 'edit', tooltipVal: IC.EDIT, icon: 'edit' }
  ];

  const classes = useStyles();
  const checkVisibleIcon = (title) => {
    const {
      status,
      retail: { retailType }
    } = props;
    const config = getKebabActionList(userRole, country);
    return config[status][retailType].includes(title);
  };

  return (
    <React.Fragment>
      {actionList.map(
        (item) =>
          (item.tooltipVal !== IC.LOCK || props.checkCurrent) &&
          checkVisibleIcon(item.tooltipVal) && (
            <Tooltip title={item.tooltipVal} key={item.tooltipVal}>
              <Icon
                data-testid={item.value}
                ligature="..."
                key={item.value}
                className={classes.iconHover}
                viewBox="0 0 24 24"
                onClick={() => {
                  props.onActionSelect(item.value);
                }}
              >
                {item.icon}
              </Icon>
            </Tooltip>
          )
      )}
    </React.Fragment>
  );
};

export default ShowAction;
