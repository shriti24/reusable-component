import { FC, useEffect, useState } from 'react';
import styles from '../retailGrid.module.css';
import { Tooltip, ClickAwayListener } from '@material-ui/core';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import download from '../../../../public/static/download.png';
import HistoryIcon from '../../../icons/HistoryIcon';
import { UploadMenu } from './UploadMenu';
import { hasPermission } from '../../Can/permission';
import { staticPermission, USER_ACTIONS } from '../../../constants/RoleBaseRules';

interface IRetailBulkUpload {
  handleDownload?(): void;
  handlePopover(): void;
  selectedItems?: any;
  retailData?: any;
  uploadTypes: any;
  inputForm: any;
  popList: boolean;
  setPopList: React.Dispatch<React.SetStateAction<boolean>>;
  handleHistoryNavigation(): void;
  handleUploadOpen(title: string): void;
  retailFlag?: boolean;
}

export const RetailBulkUpload: FC<IRetailBulkUpload> = ({
  handleDownload,
  handlePopover,
  selectedItems = null,
  retailData = null,
  uploadTypes,
  popList,
  setPopList,
  inputForm,
  handleHistoryNavigation,
  handleUploadOpen,
  retailFlag = false
}) => {
  const [show, setShow] = useState(false);
  const handleUploadIconClick = () => {
    setShow(false);
    setPopList(true);
    if (uploadTypes?.length === 1) {
      handleUploadOpen(uploadTypes[0].title);
    }
  };

  return (
    <ClickAwayListener onClickAway={handlePopover}>
      <div className={styles.buttonsDiv} style={{ right: retailFlag ? '250px' : '0px' }}>
        {selectedItems?.length && retailData?.length ? (
          <Tooltip title="Download">
            <IconButton
              aria-label="Download"
              className={styles.buttonContainer}
              onClick={handleDownload}
              data-testid={'download-button'}
            >
              <img className={styles.button} src={download} />
            </IconButton>
          </Tooltip>
        ) : null}
        {inputForm === 'RETAIL' && (
          <>
            <Tooltip title="Upload history">
              <IconButton
                color="primary"
                aria-label="Upload history"
                className={clsx(styles.buttonContainer, styles.uploadHistoryBtn)}
                onClick={handleHistoryNavigation}
                data-testid={'upload-history-button'}
              >
                <HistoryIcon width={32} height={32} className={styles.button} fill="inherit" />
              </IconButton>
            </Tooltip>
          </>
        )}
        {inputForm !== 'NEW_UPLOAD_HISTORY' && (
          <>
            <Tooltip
              title="Upload"
              open={show}
              disableHoverListener
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setShow(false)}
            >
              <IconButton
                color="primary"
                aria-label="Upload"
                className={styles.buttonContainer}
                onClick={handleUploadIconClick}
                disabled={
                  !hasPermission({
                    perform: staticPermission.NEW_RETAIL_UPLOAD_OPTION,
                    permission: USER_ACTIONS.UPLOAD
                  }) &&
                  !hasPermission({
                    perform: staticPermission.NEW_RETAIL_LOCK_UPLOAD_OPTION,
                    permission: USER_ACTIONS.UPLOAD
                  })
                }
              >
                <VerticalAlignTopIcon className={styles.button} />
              </IconButton>
            </Tooltip>
            <UploadMenu
              uploadTypes={uploadTypes}
              popList={popList}
              handleUploadOpen={handleUploadOpen}
            />
          </>
        )}
        {inputForm === 'NEW_UPLOAD_HISTORY' && (
          <>
            <Button
              color="primary"
              className={styles.buttonUpload}
              variant="outlined"
              onClick={handleUploadIconClick}
              style={{ textTransform: 'none', backgroundColor: '#0071e9', color: 'white' }}
            >
              Upload file
            </Button>
            <UploadMenu
              uploadTypes={uploadTypes}
              popList={popList}
              handleUploadOpen={handleUploadOpen}
            />
          </>
        )}
      </div>
    </ClickAwayListener>
  );
};
