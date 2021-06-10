export default {
  lists: state => state.lists,
  currentListObj: (state) => state.lists.length
    ? state.lists.find(list => list.id === state.currentListId)
    : null,
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

    const listValues = Object.values(getters.currentListItems);
    const filters = getters.currentListCheckedFilters;
    const { tags, categories } = filters;

    return listValues.filter((item) => {
      const areTagsIntersection = !tags.length || tags.every(tag => item.tags.indexOf(tag) !== -1);
      const isCategoryIntersection = !categories.length || categories.indexOf(item.category) !== -1;

      return areTagsIntersection && isCategoryIntersection;
    });
  },
};
