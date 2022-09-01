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
  setEdittingItemIndex(state, index) {
    state.edittingItemIndex = index;
  },
  updateItemField(state, { field, value }) {
    state.currentListItems[state.edittingItemIndex][field] = value;
  },
  updateItem(state, item) {
    const index = state.currentListItems.findIndex(localItem => localItem.id === item.id);

    state.currentListItems.splice(index, 1, item);
  },
  updateItemMetaFields(state, item) {
    const targetIndex = state.currentListItems.findIndex(localItem => localItem.id === item.id);
    const targetItem = state.currentListItems[targetIndex];

    targetItem.updatedAt = item.updatedAt;
  },
  updateItemByTemporaryId(state, { temporaryId, ...item }) {
    const index = state.currentListItems.findIndex(
      localItem => localItem.temporaryId === temporaryId,
    );
    
    state.currentListItems.splice(index, 1, item);
  },
  deleteItem(state, id) {
    state.currentListItems = state.currentListItems.filter(item => item.id !== id);
  },
  deleteItemByTemporaryId(state, temporaryId) {
    state.currentListItems = state.currentListItems
      .filter(item => item.temporaryId !== temporaryId);
  },

  // filters

  setCurrentSearchValue(state, value) {
    state.currentSearchValue = value;
  },
  filterList(state, { tags, categories }) {
    state.checkedTags = tags;
    state.checkedCategories = categories;
  },
  setTags(state, tags) {
    if (typeof tags === 'string') {
      state.checkedTags = JSON.parse(tags);
    } else {
      state.checkedTags = tags;
    }
  },
  setCategories(state, categories) {
    if (typeof categories === 'string') {
      state.checkedCategories = JSON.parse(categories);
    } else {
      state.checkedCategories = categories;
    }
  },
  resetFilters(state) {
    state.checkedTags = [];
    state.checkedCategories = [];
    state.currentSearchValue = '';
  },

  // visualization

  setSorting(state, sorting) {
    state.visualization.sorting = sorting;
  },
  setMode(state, mode) {
    state.visualization.mode = mode;
  },
  setTheme(state, theme) {
    state.visualization.theme = theme;
  },
  switchShuffleTrigger(state) {
    state.visualization.shuffleTrigger = !state.visualization.shuffleTrigger;
  },
  setListAlign(state, align) {
    state.visualization.listAlign = align;
  },
  toggleItemDetailsShowingMode(state) {
    state.visualization.areItemDetailsShown = !state.visualization.areItemDetailsShown;
  },
  toggleItemsOrder(state) {
    state.visualization.isItemsOrderReversed = !state.visualization.isItemsOrderReversed;
  },

  // settings

  setSettings(state, settings) {
    state.settings = settings;
  },
  switchItemFormLocation(state) {
    state.settings.isItemFormInSidebar = !state.settings.isItemFormInSidebar;
  },
  switchFocusMode(state) {
    state.settings.isFocusOnList = !state.settings.isFocusOnList;
  },
  switchSidebarAndListIntersection(state) {
    state.settings.isListUnderSidebar = !state.settings.isListUnderSidebar;
  },
  switchUsingHotkeys(state) {
    state.settings.isUsingHotkeys = !state.settings.isUsingHotkeys;
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

  // notifications

  setNotification(state, { text, time }) {
    state.notification = {
      text,
      time: time || null,
    };
  },

  // modals

  setModalNameToShow(state, name) {
    state.modalNameToShow = name;
  },

  setConfirmationModalTitle(state, title) {
    state.confirmationModalTitle = title;
  },

  // requests

  increaseExplicitRequestsNumber(state) {
    state.explicitRequestsNumber++;
  },
  decreaseExplicitRequestsNumber(state) {
    state.explicitRequestsNumber--;
  },

  // bin

  removeListFromBin(state, id) {
    state.deletedLists = state.deletedLists.filter(list => list.id !== id);
  },

  removeItemFromBin(state, id) {
    state.deletedItems = state.deletedItems.filter(item => item.id !== id);
  },

  removeBulkFromBin(state, unit) {
    if (unit === 'lists') {
      state.deletedLists = [];
    } else if (unit === 'items') {
      state.deletedItems = [];
    }
  },

  setDeletedLists(state, lists) {
    state.deletedLists = lists;
  },

  setDeletedItems(state, items) {
    state.deletedItems = items;
  },
};
