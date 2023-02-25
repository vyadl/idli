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
    const listsLog = this.getItem('listsLog');
    const listsIdsFromLog = Object.keys(listsLog);

    if (!listsLog || !listsIdsFromLog.length) {
      return null;
    }

    const itemsCache = this.getItem('itemsCache');

    const oldestSavedListTimestamp = Math.min(...Object.values(listsLog));
    const oldestSavedListId = listsIdsFromLog
      .find(key => listsLog[key] === oldestSavedListTimestamp);
    
    const itemsIdsToDelete = Object.keys(itemsCache).filter(
      itemId => itemsCache[itemId].listId === oldestSavedListId,
    );

    itemsIdsToDelete.forEach(itemId => {
      delete itemsCache[itemId];
    });

    delete listsLog[oldestSavedListId];

    this.setItemAndReturnUpdatedValues({ key: 'listsLog', value: listsLog });

    return { itemsCache, listsLog };
  },
  
  removeItem(key) {
    localStorage.removeItem(key);
  },
  
  getItem(key) {
    const value = localStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  },
};
