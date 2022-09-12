export const sortByDate = (arr, dateField) => {
  return [...arr].sort((item, nextItem) => (
    dateField === 'createdAt'
      ? Date.parse(item[dateField]) - Date.parse(nextItem[dateField])
      : Date.parse(nextItem[dateField]) - Date.parse(item[dateField])
  )); 
};

export const sortByAlphabet = (arr, textField) => {
  return [...arr].sort((item, nextItem) => (
    item[textField].charCodeAt(0) - nextItem[textField].charCodeAt(0)
  )); 
};
