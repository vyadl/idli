export default {
  // lists

  setLists(state, lists) {
    state.lists = lists;
  },
  setTestLists(state, lists) {
    state.testLists = lists;
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
  resetFilters(state) {
    state.checkedTags = [];
    state.checkedCategories = [];
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

  setSorting(state, sorting) {
    state.sorting = sorting;
  },
  setMode(state, mode) {
    state.mode = mode;
  },
  setTheme(state, theme) {
    state.theme = theme;
  },
  shuffleFilteredList(state) {
    state.shuffleTrigger = !state.shuffleTrigger;
  },

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

  // requests

  increaseRequestsNumber(state) {
    state.requestsNumber++;
  },
  decreaseRequestsNumber(state) {
    state.requestsNumber--;
  },
};
