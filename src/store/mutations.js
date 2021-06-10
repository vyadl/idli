import Vue from 'vue';

export default {
  // list

  addList(state, name) {
    const newListId = state.lists.length
      ? state.lists[state.lists.length - 1].id + 1
      : 0;

    state.lists.push({
      name,
      id: newListId,
      items: {},
      filters: {
        tags: [],
        categories: [],
      },
      checkedFilters: {
        tags: [],
        categories: [],
      },
    });

    state.currentListId = newListId;

    // const sameNameList = state.lists.find(list => list.name === name);

    // if (!sameNameList || sameNameList.name === 'test') {
    //   const listsKeys = Object.keys(state.lists);
    //   const listsKeysNumbers = listsKeys.reduce((result, item) => {
    //     if (Number(item)) {
    //       result.push(Number(item));
    //     }

    //     return result;
    //   }, []);
    //   const listId = id === 'test'
    //     ? 'test'
    //     : listsKeysNumbers.length
    //       ? Math.max(...listsKeysNumbers) + 1
    //       : 1;

    //   Vue.set(state.lists, listId, {
    //     name,
    //     id: listId,
    //     items: {},
    //     filters: {
    //       tags: [],
    //       categories: [],
    //     },
    //     checkedFilters: {
    //       tags: [],
    //       categories: [],
    //     },
    //   });

    //   state.currentListId = listId;
    // }
  },

  removeList(state, id) {
    state.lists = state.lists.filter(list => list.id !== id);
  },

  switchList(state, id) {
    state.currentListId = id;
  },

  filterList(state, filters) {
    const currentListObj = state.lists.find(list => list.id === state.currentListId);

    currentListObj.checkedFilters = JSON.parse(JSON.stringify(filters));
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
    const clonedTypedFilters = [...filters[type]];

    clonedTypedFilters.push({
      name,
      value: false,
      id: filters[type].length ? filters[type][filters[type].length - 1].id + 1 : 0,
    });

    Vue.set(filters, type, clonedTypedFilters);
  },

  changeFilter(state, {
    name,
    id,
    type,
    filters,
  }) {
    const clonedTypedFilters = [...filters[type]];
    const filter = clonedTypedFilters.find(item => item.id === id);

    filter.name = name;
    Vue.set(filters, type, clonedTypedFilters);
  },

  removeFilter(state, { type, id, filters }) {
    Vue.set(
      filters,
      type,
      filters[type].filter(item => item.id !== id),
    );
  },

  removeFilterFromList(state, { type, id }) {
    const currentListItems = state.lists.find(list => list.id === state.currentListId).items;

    Object.keys(currentListItems).forEach((key) => {
      const filterPosition = currentListItems[key][type].indexOf(id);
      const clonedFilters = [...currentListItems[key][type]];

      if (filterPosition !== -1) {
        clonedFilters.splice(filterPosition, 1);
        currentListItems[key][type] = clonedFilters;
      }
    });
  },

  // item

  addItem(state, newItem) {
    const currentListItems = state.lists.find(list => list.id === state.currentListId).items;

    const maxId = Object.keys(currentListItems).length
      ? Math.max(...Object.keys(currentListItems))
      : 0;
    const newId = maxId + 1;

    Vue.set(currentListItems, newId, {
      id: newId,
      text: newItem.text,
      details: newItem.details,
      tags: JSON.parse(JSON.stringify(newItem.tags)),
      category: newItem.category,
    });
  },

  setItems(state, newItems) {
    const currentListObj = state.lists.find(list => list.id === state.currentListId);

    Vue.set(currentListObj, 'items', {
      ...newItems,
    });
  },

  deleteItem(state, id) {
    const currentListItems = state.lists.find(list => list.id === state.currentListId).items;

    Vue.delete(currentListItems, id);
  },

  setActiveItem(state, item) {
    state.activeItem = item;
  },

  changeItem(state, changedItem) {
    const currentListItems = state.lists.find(list => list.id === state.currentListId).items;

    Vue.set(currentListItems, changedItem.id, changedItem);
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
