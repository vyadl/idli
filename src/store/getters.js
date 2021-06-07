export default {
  lists: state => state.lists,
  currentList: (state, getters) => state.lists[state.currentListId],
  list: (state, getters) => getters.currentList.items,
  currentListId: state => state.currentListId,
  doesTestListExist: state => Object.keys(state.lists).some(key => key === 'test'),
  filters: (state, getters) => getters.currentList.filters,
  checkedFilters: (state, getters) => getters.currentList.checkedFilters,
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
  listLength: (state, getters) => {
    return getters.filteredList.length;
  },

  isSettingActive: (state, getters) => {
    for (let status in getters.settingsStatuses) {
      if (getters.settingsStatuses[status]) {
        return true;
      }
    }

    return false;
  },

  filteredList: (state, getters) => {
    const listValues = Object.values(getters.list);
    const filters = getters.checkedFilters;
    const tags = filters.tags;
    const types = filters.types;

    return listValues.filter((item) => {
      const areTagsIntersection = !tags.length || tags.every(tag => item.tags.indexOf(tag) !== -1);
      const isTypeIntersection = !types.length || types.indexOf(item.type) !== -1;

      return areTagsIntersection && isTypeIntersection;
    });
  },
};
