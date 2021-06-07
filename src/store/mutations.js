import Vue from 'vue';

export default {
  // list

  addList(state, { name, id }) {
    const listsValues = Object.values(state.lists);
    const sameNameList = listsValues.find(item => item.name === name);

    if (!sameNameList || sameNameList.name === 'test') {
      const listsKeys = Object.keys(state.lists);
      const listsKeysNumbers = listsKeys.reduce((result, item) => {
        if (Number(item)) {
          result.push(Number(item));
        }

        return result;
      }, []);
      const listId = id === 'test'
        ? 'test'
        : listsKeysNumbers.length
          ? Math.max(...listsKeysNumbers) + 1
          : 1;

      Vue.set(state.lists, listId, {
        name,
        id: listId,
        items: {},
        filters: {
          tags: [],
          types: [],
        },
        checkedFilters: {
          tags: [],
          types: [],
        },
      });

      state.currentListId = listId;
    }
  },

  removeList(state, id) {
    Vue.delete(state.lists, id);
  },

  switchList(state, id) {
    state.currentListId = id;
  },

  filterList(state, filters) {
    const currentList = state.lists[state.currentListId];

    currentList.checkedFilters = JSON.parse(JSON.stringify(filters));
    state.mode.shuffle = false;
  },

  switchShuffleMode(state) {
    state.mode.shuffle = !state.mode.shuffle;
  },

  setInitialState(state, { lists, currentListId }) {
    state.lists = lists;
    state.currentListId = currentListId;
  },

  shuffleFilteredList(state) {
    state.shuffleTrigger = !state.shuffleTrigger;
  },

  // filter

  addFilter(state, { name, type, filters }) {
    const cloneTypedFilters = [...filters[type]];

    cloneTypedFilters.push({
      name,
      value: false,
      id: filters[type].reduce((result, item) => {
        return +item.id > result ? +item.id : result;
      }, 0) + 1,
    });

    Vue.set(filters, type, cloneTypedFilters);
  },

  changeFilter(state, { name, id, type, filters }) {
    const cloneTypedFilters = [...filters[type]];
    const filter = cloneTypedFilters.find(item => item.id == id);

    filter.name = name;
    Vue.set(filters, type, cloneTypedFilters);
  },

  removeFilter(state, { type, id, filters }) {
    Vue.set(
      filters,
      type,
      filters[type].filter(item => item.id !== id)
    );
  },

  removeFilterFromList(state, { type, id }) {
    const currentList = state.lists[state.currentListId].items;

    Object.keys(currentList).forEach((key) => {
      const filterPosition = currentList[key][type].indexOf(id);
      const cloneFilters = [...currentList[key][type]];

      if (filterPosition !== -1) {
        cloneFilters.splice(filterPosition, 1);
        currentList[key][type] = cloneFilters;
      }
    })
  },

  // item

  addItem(state, newItem) {
    const currentList = state.lists[state.currentListId].items;

    const maxId = Object.keys(currentList).length ? Math.max(...Object.keys(currentList)) : 0;
    const newId = maxId + 1;

    Vue.set(currentList, newId, {
      id: newId,
      text: newItem.text,
      details: newItem.details,
      tags: JSON.parse(JSON.stringify(newItem.tags)),
      type: newItem.type,
    });
  },

  setItems(state, newItems) {
    const currentList = state.lists[state.currentListId];

    const maxId = Object.keys(currentList.items).length ? Math.max(...Object.keys(currentList.items)) : 0;
    let newId = maxId + 1;

    newItems.forEach((item) => {
      item.id = newId;
      newId++;
    });

    Vue.set(currentList, 'items', {
      ...newItems,
    });
  },

  deleteItem(state, id) {
    const currentList = state.lists[state.currentListId].items;

    Vue.delete(currentList, id);
  },

  setActiveItem(state, item) {
    state.activeItem = item;
  },

  changeItem(state, changedItem) {
    const currentList = state.lists[state.currentListId].items;

    Vue.set(currentList, changedItem.id, changedItem);
  },

  setChangingStatus(state, status) {
    state.isChangingActive = status;
  },

  // settings

  switchCloudMode(state) {
    state.mode.cloud = !state.mode.cloud;
    state.mode.list = !state.mode.cloud;

    if (!state.mode.cloud) {
      state.mode.stars = false;
    } else {
      state.mode.shuffle = true;
    }
  },

  switchStarsMode(state) {
    state.mode.stars = !state.mode.stars;
    state.mode.list = !state.mode.stars;

    if (state.mode.stars) {
      state.mode.cloud = true;
      state.mode.shuffle = true;
    }
  },

  switchInvertMode(state) {
    state.isInvert = !state.isInvert;
  },

  changeChangingListStatus(state, status) {
    state.listChanging = status;
  },

  setSettingsStatus(state, payload) {
    const statuses = state.settingsStatuses;
    let statusField = '';

    statuses[payload.field] = payload.value;

    Object.keys(statuses).forEach(statusField => {
      if (statusField != payload.field) {
        statuses[statusField] = false;
      }
    });
  },
};
