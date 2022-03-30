import {
  ENABLE_SHOW_ALERT,
  DISABLE_SHOW_ALERT,
  ENABLE_SHOW_ERROR,
  DISABLE_SHOW_ERROR,
  ENABLE_SHOW_SNACKBAR,
  DISABLE_SHOW_SNACKBAR
} from '../constants/ActionTypes';

export const modifyAlert = (flag, message) => {
  return (dispatch) => {
    dispatch({
      type: flag ? ENABLE_SHOW_ALERT : DISABLE_SHOW_ALERT,
      alertMsg: message
    });
  };
};

export const modifyError = (flag, message) => {
  return (dispatch) => {
    dispatch({
      type: flag ? ENABLE_SHOW_ERROR : DISABLE_SHOW_ERROR,
      errorMsg: message
    });
  };
};

export const modifySnackBar = (flag, info, action) => {
  return (dispatch) => {
    dispatch({
      type: flag ? ENABLE_SHOW_SNACKBAR : DISABLE_SHOW_SNACKBAR,
      info,
      action
    });
  };
};
