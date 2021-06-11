export default {
  lists: state => state.lists,
  currentListObj: state => state.lists.find(list => list.id === state.currentListId),
  currentListIndex: (state, getters) => getters.lists
    .findIndex(list => list.id === getters.currentListId),
  currentListId: state => state.currentListId,
  currentListItems: (state, getters) => getters.currentListObj?.items,
  currentListFilters: (state, getters) => getters.currentListObj?.filters,
  currentListCheckedFilters: (state, getters) => getters.currentListObj?.checkedFilters,
  activeItem: state => state.activeItem,
  listChanging: state => state.listChanging,
  settingsStatuses: state => state.settingsStatuses,
  isChangingActive: state => state.isChangingActive,
  isCloudModeOn: state => state.mode.cloud,
  isStarsModeOn: state => state.mode.stars,
  isInvert: state => state.isInvert,
  starsSettings: state => state.starsSettings,
  shuffleTrigger: state => state.shuffleTrigger,
  isShuffled: state => state.mode.shuffle,
  mode: state => state.mode,
  filteredListLength: (state, getters) => getters.filteredList.length,

  isAnySettingActive: (state, getters) => Object.values(getters.settingsStatuses)
    .some(value => value),

  filteredList: (state, getters) => {
    if (!getters.currentListItems) {
      return [];
    }

    const { tags, categories } = getters.currentListCheckedFilters;

    return getters.currentListItems.filter(item => {
      const areTagsIntersection = !tags.length || tags.every(tag => item.tags.includes(tag));
      const isCategoryIntersection = !categories.length || categories
        .indexOf(item.categories) !== -1;

      return areTagsIntersection && isCategoryIntersection;
    });
  },
};
