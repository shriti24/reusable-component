import React, { useState, useEffect, useCallback, FC } from 'react';
import { useRouter } from 'next/router';

interface IToastProvider {
  children: JSX.Element;
}

export const ToastContext = React.createContext({
  alert: null,
  addAlert: (message, status, newPage, extraParams) => {},
  removeAlert: (id) => {}
});

const ToastContextProvider: FC<IToastProvider> = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const [toastData, setData] = useState(null);
  const router = useRouter();
  const removeAlert = (id?: number) => {
    if (id >= 0) {
      setAlert((prevAlert) => {
        return prevAlert
          ?.filter((elem) => elem.id !== id)
          .map((elem, index) => ({ ...elem, id: index }));
      });
    } else {
      setAlert(null);
    }
  };

  const addAlert = (paramsData) => {
    if (paramsData.newPage) {
      Object.assign(paramsData, { id: 0 });
      setData([paramsData]);
    } else {
      setData(null);
      setAlert((prevAlert) => {
        Object.assign(paramsData, {
          id: prevAlert ? prevAlert.length : 0
        });
        return prevAlert ? [...prevAlert, paramsData] : [paramsData];
      });
    }
  };

  useEffect(() => {
    if (toastData) {
      setAlert(toastData);
      setData(null);
    } else if (alert?.length) removeAlert();
  }, [router.asPath]);

  const contextValue = {
    alert,
    addAlert: useCallback(
      (message, status, newPage, extraParams) => {
        const { action, autoHideDuration } = extraParams || {};
        const paramsData = { message, status, newPage, action, autoHideDuration };
        addAlert(paramsData);
      },
      [setAlert]
    ),
    removeAlert: useCallback((id) => removeAlert(id), [setAlert])
  };

  return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>;
};

export default ToastContextProvider;
