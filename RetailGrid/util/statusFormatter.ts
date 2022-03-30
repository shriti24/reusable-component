export const statusFormatter = (params) => {
  if (params && params.data) {
    return params.data && params.data.status === 'Review' ? 'Blocked' : params.data.status;
  }
  return '';
};
