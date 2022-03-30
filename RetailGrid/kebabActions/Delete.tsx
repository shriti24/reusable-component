import React, { FC, useEffect, useState } from 'react';
import DialogBox from '../../common/DialogBox';
import { GridContextAPI } from '../contextAPI';
import useToastFeature from '@utils/useToastFeature';
import * as deleteService from '../../../services/deleteRetail';

const Delete = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteFutureRetail, setMarkDeleteFutureRetail] = useState(false);
  const { addAlert } = useToastFeature();
  const _gridContext = React.useContext(GridContextAPI);

  const retailDialogContent = {
    title: 'Remove retail',
    content: 'Are you sure you want to remove this retail?',
    firstButtonText: 'Cancel',
    secondButtonText: 'Remove',
    buttonTextTransform: 'Capitalize'
  };

  const actionButtonColors = {
    border: 'solid 1px #0071ef',
    backgroundColor: '#0071e9',
    color: '#ffffff'
  };

  const handleClose = () => {
    setDialogOpen(false);
    _gridContext.setType('');
  };

  useEffect(() => {
    if (_gridContext.selectedType.toUpperCase() === 'DELETE') {
      setDialogOpen(true);
    } else setDialogOpen(false);
  }, [_gridContext.selectedType]);

  const formattedData = (data) => {
    if (data) {
      return {
        item: data.itemNbr,
        club: data.clubNbr,
        priceBlockId: data.currentBlock !== null ? data.currentBlock.priceBlockId : '',
        retailActionId: data.retailActionId,
        retailReason: data.retailReason,
        retailType: data.retailType,
        status: data.status,
        userId: data.creatorId
      };
    }

    return '';
  };

  useEffect(() => {
    if (deleteFutureRetail) {
      const data = formattedData(_gridContext.data);
      if (data === '') return;

      setDialogOpen(false);
      _gridContext.setType('');
      deleteService
        .deleteRetail(data)
        .then((response) => {
          if (response.status === 200 && response.data.errorMsgList == null) {
            _gridContext.setDelete();
            addAlert('Retail successfully removed', 'success');
          } else {
            addAlert('Error occurred while deleting. Please try again', 'error');
          }
        })
        .catch((error) => {
          addAlert('Error occurred while deleting. Please try again', 'error');
        });
      setMarkDeleteFutureRetail(false);
    }
  }, [deleteFutureRetail]);

  return (
    <DialogBox
      data-testid="test-delete-id"
      title={retailDialogContent.title}
      contentField={<div> {retailDialogContent.content} </div>}
      firstButtonText={retailDialogContent.firstButtonText}
      secondButtonText={retailDialogContent.secondButtonText}
      isOpen={dialogOpen}
      firstButtonTextTransform={retailDialogContent.buttonTextTransform}
      secondButtonTextTransform={retailDialogContent.buttonTextTransform}
      handleFirstButtonClick={handleClose}
      handleClose={handleClose}
      actionButtonColors={actionButtonColors}
      handleSecondButtonClick={() => setMarkDeleteFutureRetail(true)}
    />
  );
};

export default Delete;
