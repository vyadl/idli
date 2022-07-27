export const sortByDate = (arr, dateField) => {
  const newArr = [...arr].sort((item, nextItem) => (
    Date.parse(nextItem[dateField]) - Date.parse(item[dateField])
  )); 

  return newArr;
};

export const sortByAlphabet = (arr, textField) => {
  const newArr = [...arr].sort((item, nextItem) => (
    item[textField].charCodeAt(0) - nextItem[textField].charCodeAt(0)
  )); 

  return newArr;
};
