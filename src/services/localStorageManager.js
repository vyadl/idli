export default {
  setItemAndReturnUpdatedValues({ key, value }) {
    let returnValue = null;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      if (this.isQuotaExceededError(err)) {
        const valuesWithoutOldestData = this.removeOldestDataAndReturnUpdatedValues();

        if (valuesWithoutOldestData) {
          returnValue = valuesWithoutOldestData;
          this.setItemAndReturnUpdatedValues({ key, value });
        }
      }
    }
  
    return returnValue;
  },

  isQuotaExceededError(err) {
    return err instanceof DOMException
      && (
        err.code === 22
        || err.code === 1014
        || err.name === 'QuotaExceededError'
        || err.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      );
  },

  removeOldestDataAndReturnUpdatedValues() {
    const itemsCache = this.getItem('itemsCache');
    const listsCache = this.getItem('listsCache');
    const listsWithTimeStamps = Object.values(listsCache).filter(list => list.timeStamp);
    const listsTimeStamps = listsWithTimeStamps.map(list => list.timeStamp);

    if (!listsCache || !listsTimeStamps.length) {
      return null;
    }

    const oldestSavedListTimestamp = Math.min(...Object.values(listsTimeStamps));
    const oldestSavedListObj = Object.values(listsCache).find(
      list => list.timeStamp === oldestSavedListTimestamp,
    );
    
    const itemsIdsToDelete = Object.keys(itemsCache).filter(
      itemId => itemsCache[itemId].listId === oldestSavedListObj.id,
    );

    itemsIdsToDelete.forEach(itemId => {
      delete itemsCache[itemId];
    });

    delete listsCache[oldestSavedListObj.id];

    this.setItemAndReturnUpdatedValues({ key: 'listsCache', value: listsCache });

    return { itemsCache, listsCache };
  },
  
  removeItem(key) {
    localStorage.removeItem(key);
  },
  
  getItem(key) {
    const rawValue = localStorage.getItem(key);

    if (!rawValue) {
      return null;
    }

    let returnValue;

    try {
      returnValue = JSON.parse(rawValue);
    } catch {
      returnValue = rawValue;
    }

    return returnValue;
  },
};
