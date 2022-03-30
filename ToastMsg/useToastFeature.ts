/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import { ToastContext } from '../providers/ToastProvider';

interface IToastFeature {
  alert: any;
  addAlert(
    message: string,
    status?: string,
    newPage?: boolean,
    extraParams?: {
      action?: HTMLElement;
      autoHideDuration?: number;
    }
  ): void;
  removeAlert(id?: number): void;
}

const useToastFeature = (): IToastFeature => {
  const { alert, addAlert, removeAlert } = useContext(ToastContext);
  return { alert, addAlert, removeAlert };
};

export default useToastFeature;
