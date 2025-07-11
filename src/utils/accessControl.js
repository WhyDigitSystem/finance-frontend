export const getScreenAccess = () => {
  return JSON.parse(localStorage.getItem('screenAccess') || '{}');
};

export const hasWriteAccess = (screenId) => {
  const access = getScreenAccess()?.[screenId];
  return !!access?.canWrite;
};

export const hasReadAccess = (screenId) => {
  const access = getScreenAccess()?.[screenId];
  return !!access?.canRead;
};

export const hasDeleteAccess = (screenId) => {
  const access = getScreenAccess()?.[screenId];
  return !!access?.canDelete;
};

export const isReadOnly = (screenId) => {
  const access = getScreenAccess()?.[screenId];
  return access?.canRead && !access?.canWrite;
};
