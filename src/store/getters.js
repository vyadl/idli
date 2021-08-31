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
  checkedTags: state => state.checkedTags,
  checkedCategories: state => state.checkedCategories,
  filteredList: (state, getters) => {
    const tags = getters.checkedTags;
    const categories = getters.checkedCategories;

    return getters.currentListItems.filter(item => {
      const areTagsIntersection = !tags.length || tags.every(tag => item.tags.includes(tag));
      const isCategoryIntersection = !categories.length || categories
        .indexOf(item.category) !== -1;

      return areTagsIntersection && isCategoryIntersection;
    });
  },
  filteredListLength: (state, getters) => getters.filteredList.length,

  // items
  edittingItemObj: state => state.edittingItemObj,

  // visualization
  sorting: state => state.visualization.sorting,
  mode: state => state.visualization.mode,
  theme: state => state.visualization.theme,
  shuffleTrigger: state => state.visualization.shuffleTrigger,
  listAlign: state => state.visualization.listAlign,
  areItemDetailsShown: state => state.visualization.areItemDetailsShown,

  // settings
  settings: state => state.settings,
  isItemFormInSidebar: state => state.settings.isItemFormInSidebar,
  isFocusOnList: state => state.settings.isFocusOnList,
  isListUnderSidebar: state => state.settings.isListUnderSidebar,

  // sidebar
  isSidebarOpen: state => state.sidebar.isOpen,
  sidebarMode: state => state.sidebar.mode,

  // notifications
  notification: state => state.notification,

  // requests
  requestsNumber: state => state.requestsNumber,

  // bin
  removedLists: state => state.removedLists,
  removedItems: state => state.removedItems,
};
