export default {
  lists: state => state.lists,
  currentListId: state => state.currentListId,
  currentListObj: state => state.lists.find(list => list.id === state.currentListId),
  currentListTags: (state, getters) => getters.currentListObj?.tags,
  currentListCategories: (state, getters) => getters.currentListObj?.categories,
  currentListItems: state => state.currentListItems,
  edittingListObj: state => state.edittingListObj,
  edittingItemObj: state => state.edittingItemObj,
  checkedTags: state => state.checkedTags,
  checkedCategories: state => state.checkedCategories,
  sorting: state => state.sorting,
  shuffleTrigger: state => state.shuffleTrigger,
  mode: state => state.mode,
  starsSettings: state => state.starsSettings,
  theme: state => state.theme,
  isInvert: state => state.theme === 'invert',
  isSidebarOpen: state => state.sidebar.isOpen,
  sidebarMode: state => state.sidebar.mode,
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
};
