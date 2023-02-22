export default {
  setItem({ name, value }) {
    let returnValue = null;

    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch {
      const valuesWithoutOldestData = this.removeOldestData();

      if (valuesWithoutOldestData) {
        returnValue = valuesWithoutOldestData;
        this.setItem({ name, value });
      }
    }

    return returnValue;
  },

  removeOldestData() {
    const listsLog = JSON.parse(this.getItem('listsLog'));

    if (!listsLog || !Object.keys(listsLog).length) {
      return null;
    }

    const itemsCache = JSON.parse(this.getItem('itemsCache'));

    const oldestSavedListTimestamp = Math.min(...Object.values(listsLog));
    const oldestSavedListId = Object.keys(listsLog)
      .find(key => listsLog[key] === oldestSavedListTimestamp);
    
    const itemsIdsToDelete = Object.keys(itemsCache).filter(
      itemId => itemsCache[itemId].listId === oldestSavedListId,
    );

    itemsIdsToDelete.forEach(itemId => {
      delete itemsCache[itemId];
    });

    delete listsLog[oldestSavedListId];

    this.setItem({ name: 'listsLog', value: listsLog });

    return { itemsCache, listsLog };
  },
  
  removeItem(name) {
    localStorage.removeItem(name);
  },
  
  getItem(name) {
    return localStorage.getItem(name);
  },
};
