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

      state.currentId = listId;
    }
  },

  removeList(state, id) {
    Vue.delete(state.lists, id);
  },

  switchList(state, id) {
    state.currentId = id;
  },

  filterList(state, filters) {
    const currentListObj = state.lists[state.currentId];

    currentListObj.checkedFilters = JSON.parse(JSON.stringify(filters));
    state.mode.shuffle = false;
  },

  switchShuffleMode(state) {
    state.mode.shuffle = !state.mode.shuffle;
  },

  setInitialState(state, { lists, currentId }) {
    state.lists = lists;
    state.currentId = currentId;
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
      id: filters[type].length ? filters[type][filters[type].length - 1].id + 1 : 0,
    });

    Vue.set(filters, type, cloneTypedFilters);
  },

  changeFilter(state, {
    name, id, type, filters,
  }) {
    const cloneTypedFilters = [...filters[type]];
    const filter = cloneTypedFilters.find(item => item.id === id);

    filter.name = name;
    Vue.set(filters, type, cloneTypedFilters);
  },

  removeFilter(state, { type, id, filters }) {
    Vue.set(
      filters,
      type,
      filters[type].filter(item => item.id !== id),
    );
  },

  removeFilterFromList(state, { type, id }) {
    const currentItems = state.lists[state.currentId].items;

    Object.keys(currentItems).forEach((key) => {
      const filterPosition = currentItems[key][type].indexOf(id);
      const cloneFilters = [...currentItems[key][type]];

      if (filterPosition !== -1) {
        cloneFilters.splice(filterPosition, 1);
        currentItems[key][type] = cloneFilters;
      }
    });
  },

  // item

  addItem(state, newItem) {
    const currentItems = state.lists[state.currentId].items;

    const maxId = Object.keys(currentItems).length
      ? Math.max(...Object.keys(currentItems))
      : 0;
    const newId = maxId + 1;

    Vue.set(currentItems, newId, {
      id: newId,
      text: newItem.text,
      details: newItem.details,
      tags: JSON.parse(JSON.stringify(newItem.tags)),
      type: newItem.type,
    });
  },

  setItems(state, newItems) {
    const currentListObj = state.lists[state.currentId];

    Vue.set(currentListObj, 'items', {
      ...newItems,
    });
  },

  deleteItem(state, id) {
    const currentItems = state.lists[state.currentId].items;

    Vue.delete(currentItems, id);
  },

  setActiveItem(state, item) {
    state.activeItem = item;
  },

  changeItem(state, changedItem) {
    const currentItems = state.lists[state.currentId].items;

    Vue.set(currentItems, changedItem.id, changedItem);
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

    statuses[payload.field] = payload.value;

    Object.keys(statuses).forEach(statusField => {
      if (statusField !== payload.field) {
        statuses[statusField] = false;
      }
    });
  },
};
