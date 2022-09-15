export default {
  // lists
  lists: state => state.lists,
  testLists: state => state.testLists,
  currentListId: state => state.currentListId,
  currentListObj: state => state.lists.find(list => list.id === state.currentListId),
  currentListTags: (state, getters) => getters.currentListObj?.tags,
  currentListCategories: (state, getters) => getters.currentListObj?.categories,
  currentListItems: state => state.currentListItems,
  edittingListObj: state => state.edittingListObj,
  currentSearchValue: state => state.filters.currentSearchValue,
  checkedTags: state => state.filters.checkedTags,
  checkedCategories: state => state.filters.checkedCategories,
  filteredList: state => state.filteredList,
  filteredListLength: (state, getters) => getters.filteredList.length,

  // items
  edittingItemObj: state => state.currentListItems[state.edittingItemIndex],

  // visualization
  sorting: state => state.visualization.sorting,
  mode: state => state.visualization.mode,
  shuffleTrigger: state => state.visualization.shuffleTrigger,
  listAlign: state => state.visualization.listAlign,
  areItemDetailsShown: state => state.visualization.areItemDetailsShown,
  isItemsOrderReversed: state => state.visualization.isItemsOrderReversed,

  // settings
  settings: state => state.settings,
  isItemFormInSidebar: state => state.settings.isItemFormInSidebar,
  isFocusOnList: state => state.settings.isFocusOnList,
  isListUnderSidebar: state => state.settings.isListUnderSidebar,
  isUsingHotkeys: state => state.settings.isUsingHotkeys,
  theme: state => state.settings.theme,

  // sidebar
  isSidebarOpen: state => state.sidebar.isOpen,
  sidebarMode: state => state.sidebar.mode,

  // notifications
  notification: state => state.notification,

  // modals
  modalNameToShow: state => state.modalNameToShow,

  // requests
  explicitRequestsNumber: state => state.explicitRequestsNumber,

  // bin
  deletedLists: state => state.deletedLists,
  deletedItems: state => state.deletedItems,
};
