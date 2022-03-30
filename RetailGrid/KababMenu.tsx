import React, { FC, useState } from 'react';
import KebabMenu from '../../components/common/KebabMenu';

interface KababMenu {
  children?: React.ReactNode;
  disableVert?: boolean;
}

const KababMenu: FC<KababMenu> = (props) => {
  const [inHover, setInHover] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [iconIndex, setIconIndex] = useState('');

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setIconIndex(event.target.id);
    setInHover(true);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setInHover(false);
  };

  return (
    <KebabMenu
      index={'kebab_'}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      handlePopoverClose={handlePopoverClose}
      handlePopoverOpen={handlePopoverOpen}
      inHover={inHover}
      iconIndex={iconIndex}
      data-testid="kebab"
      disableVert={props.disableVert}
      iconBtnAdditionalProps={{
        disableRipple: true,
        disableFocusRipple: true,
        disableTouchRipple: true
      }}
    >
      {props.children}
    </KebabMenu>
  );
};

export default KababMenu;
