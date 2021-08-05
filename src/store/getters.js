export default {
  lists: state => state.lists,
  checkedTags: state => state.checkedTags,
  checkedCategories: state => state.checkedCategories,
  currentListObj: state => state.currentListObj,
  currentListIndex: (state, getters) => getters.lists
    .findIndex(list => list.id === getters.currentListId),
  currentListId: state => state.currentListId,
  currentListItems: (state, getters) => getters.currentListObj?.items,
  currentListTags: (state, getters) => getters.currentListObj?.tags,
  currentListCategories: (state, getters) => getters.currentListObj?.categories,
  edittingListObj: state => state.lists.length
    ? state.lists.find(list => list.id === state.edittingListId)
    : null,
  edittingItemObj: state => state.edittingItemObj,
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

  isAnySettingActive: (state, getters) => Object.values(getters.settingsStatuses)
    .some(value => value),

  filteredList: (state, getters) => {
    if (!getters.currentListItems) {
      return [];
    }

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
