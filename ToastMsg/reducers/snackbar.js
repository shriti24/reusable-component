import { ENABLE_SHOW_SNACKBAR, DISABLE_SHOW_SNACKBAR } from '../constants/ActionTypes';

export const snackbar = (
  state = {
    show: null,
    info: null,
    action: null
  },
  action
) => {
  switch (action.type) {
    case ENABLE_SHOW_SNACKBAR:
      return { ...state, show: true, info: action.info, action: action.action };
    case DISABLE_SHOW_SNACKBAR:
      return { ...state, show: false, info: null, action: null };
    default:
      return state;
  }
};
