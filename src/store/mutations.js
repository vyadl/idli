import Vue from 'vue';

export default {

  // lists

  addList(state, list) {
    let { name } = list;
    let isListNameSame = state.lists.some(localList => name === localList.name);

    while (isListNameSame) {
      name = `${name} (copy)`;
      isListNameSame = state.lists
        .some(localList => name === localList.name); // eslint-disable-line no-loop-func
    }

    list.name = name; // eslint-disable-line no-param-reassign
    list.id = state.lists.length // eslint-disable-line no-param-reassign
      ? state.lists[state.lists.length - 1].id + 1
      : 0;
    state.lists.push(list);
    state.currentListId = list.id;
  },
  saveList(state, list) {
    const index = state.lists.findIndex(localList => localList.id === list.id);

    state.lists.splice(index, 1, list);
  },
  removeList(state, id) {
    state.lists = state.lists.filter(list => list.id !== id);
  },
  switchList(state, id) {
    state.currentListId = id;
  },
  setListForEditting(state, id) {
    state.edittingListId = id;
  },
  filterList(state, { tags, categories }) {
    state.checkedTags = tags;
    state.checkedCategories = categories;
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

  // items

  addItem(state, { currentListIndex, newItem }) {
    const currentListItems = state.lists[currentListIndex].items;

    const newItemId = currentListItems.length
      ? currentListItems[currentListItems.length - 1].id + 1
      : 0;

    state.lists[currentListIndex].items.push({
      ...newItem,
      id: newItemId,
    });
  },
  setItems(state, { currentListIndex, newItems }) {
    state.lists[currentListIndex].items = newItems;
  },
  deleteItem(state, { currentListIndex, id }) {
    state.lists[currentListIndex].items = state.lists[currentListIndex].items
      .filter(item => item.id !== id);
  },
  setItemForEditting(state, item) {
    state.edittingItemObj = item;
  },
  changeItem(state, { currentListIndex, changedItem }) {
    const index = state.lists[currentListIndex].items
      .findIndex(item => item.id === changedItem.id);

    Vue.set(
      state.lists[currentListIndex].items,
      index,
      changedItem,
    );
  },

  // filters

  addFilter(state, { currentListIndex, type, name }) {
    const lastElementIndex = state.lists[currentListIndex][type].length - 1;
    const newId = state.lists[currentListIndex][type].length
      ? state.lists[currentListIndex][type][lastElementIndex].id + 1
      : 0;

    state.lists[currentListIndex][type].push({
      name,
      id: newId,
    });
  },
  changeFilter(state, {
    currentListIndex,
    name,
    id,
    type,
  }) {
    const index = state.lists[currentListIndex][type].findIndex(filter => filter.id === id);

    state.lists[currentListIndex][type][index].splice(index, 1, { name, id });
  },
  removeFilter(state, { currentListIndex, type, id }) {
    state.lists[currentListIndex][type] = state.lists[currentListIndex][type]
      .filter(filter => filter.id !== id);
  },
  removeFilterFromList(state, { currentListIndex, type, id }) {
    const currentListItems = state.lists[currentListIndex].items;

    currentListItems.forEach(item => {
      if (type === 'categories') {
        item.category = null; // eslint-disable-line no-param-reassign
      } else {
        const index = item.tags.indexOf(id);
        const clonedTags = [...item.tags];

        if (index !== -1) {
          item.tags = clonedTags.splice(index, 1); // eslint-disable-line no-param-reassign
        }
      }
    });
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
  setSettingsStatus(state, payload) {
    const statuses = state.settingsStatuses;

    statuses[payload.field] = payload.value;

    Object.keys(statuses).forEach(statusField => {
      if (statusField !== payload.field) {
        statuses[statusField] = false;
      }
    });
  },
  openSidebar(state) {
    state.sidebar.isOpen = true;
  },
  closeSidebar(state) {
    state.sidebar.isOpen = false;
  },
  changeSidebarMode(state, mode) {
    state.sidebar.mode = mode;
  },
};
