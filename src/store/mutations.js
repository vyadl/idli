export default {
  // lists

  setLists(state, lists) {
    state.lists = lists;
  },
  setCurrentListId(state, id) {
    state.currentListId = id;
  },
  addList(state, list) {
    state.lists.push(list);
  },
  setListForEditting(state, list) {
    state.edittingListObj = list;
  },
  updateList(state, list) {
    const index = state.lists.findIndex(localList => localList.id === list.id);

    state.lists.splice(index, 1, list);
  },
  deleteList(state, id) {
    state.lists = state.lists.filter(list => list.id !== id);
  },
  filterList(state, { tags, categories }) {
    state.checkedTags = tags;
    state.checkedCategories = categories;
  },

  // items

  setCurrentItems(state, items) {
    state.currentListItems = items;
  },
  addItem(state, item) {
    state.currentListItems.push(item);
  },
  addItems(state, items) {
    state.lists.find(list => list.id === state.currentListId).items = items;
  },
  setItemForEditting(state, item) {
    state.edittingItemObj = item;
  },
  updateItem(state, item) {
    const index = state.currentListItems.findIndex(localItem => localItem.id === item.id);

    state.currentListItems.splice(index, 1, item);
  },
  deleteItem(state, id) {
    state.currentListItems = state.currentListItems.filter(item => item.id !== id);
  },

  // visualization

  shuffleFilteredList(state) {
    state.shuffleTrigger = !state.shuffleTrigger;
  },
  setSorting(state, sorting) {
    state.sorting = sorting;
  },
  setMode(state, mode) {
    state.mode = mode;
  },
  setTheme(state, theme) {
    state.theme = theme;
  },
  // switchCloudMode(state, value) {
  //   state.mode.cloud = value;
  //   state.mode.list = !state.mode.cloud;

  //   // if (!state.mode.cloud) {
  //   //   state.mode.stars = false;
  //   // } else {
  //     // state.mode.shuffle = true;
  //   // }
  //   if (state.mode.cloud) {
  //     state.mode.shuffle = true;
  //   }
  // },
  // switchStarsMode(state, value) {
  //   state.mode.stars = value;
  //   // state.mode.cloud = !state.mode.cloud;
  //   state.mode.list = !state.mode.stars;

  //   if (state.mode.stars) {
  //     // state.mode.cloud = true;
  //     state.mode.shuffle = true;
  //   }
  // },

  // sidebar

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
