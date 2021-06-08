export default {
  lists: state => state.lists,
  currentList: (state) => state.lists[state.currentListId],
  list: (state, getters) => getters.currentList?.items,
  currentListId: state => state.currentListId,
  doesTestListExist: state => Object.keys(state.lists).some(key => key === 'test'),
  filters: (state, getters) => getters.currentList?.filters,
  checkedFilters: (state, getters) => getters.currentList?.checkedFilters,
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
  listLength: (state, getters) => getters.filteredList.length,

  isAnySettingActive: (state, getters) => Object.values(getters.settingsStatuses)
    .some(value => value),

  filteredList: (state, getters) => {
    if (!getters.list) {
      return [];
    }

    const listValues = Object.values(getters.list);
    const filters = getters.checkedFilters;
    const { tags } = filters;
    const { types } = filters;

    return listValues.filter((item) => {
      const areTagsIntersection = !tags.length || tags.every(tag => item.tags.indexOf(tag) !== -1);
      const isTypeIntersection = !types.length || types.indexOf(item.type) !== -1;

      return areTagsIntersection && isTypeIntersection;
    });
  },
};
