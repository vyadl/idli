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
  settingsStatuses: state => state.settingsStatuses,
  isCloudModeOn: state => state.mode.cloud,
  isStarsModeOn: state => state.mode.stars,
  isInvert: state => state.isInvert,
  starsSettings: state => state.starsSettings,
  shuffleTrigger: state => state.shuffleTrigger,
  isShuffled: state => state.mode.shuffle,
  mode: state => state.mode,
  filteredListLength: (state, getters) => getters.filteredList.length,
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
};
