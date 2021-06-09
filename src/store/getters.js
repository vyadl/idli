export default {
  lists: state => state.lists,
  currentListObj: (state) => state.lists[state.currentId],
  currentItems: (state, getters) => getters.currentListObj?.items,
  currentId: state => state.currentId,
  doesTestListExist: state => Object.keys(state.lists).some(key => key === 'test'),
  filters: (state, getters) => getters.currentListObj?.filters,
  checkedFilters: (state, getters) => getters.currentListObj?.checkedFilters,
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
    if (!getters.currentItems) {
      return [];
    }

    const listValues = Object.values(getters.currentItems);
    const filters = getters.checkedFilters;
    const { tags, types } = filters;

    return listValues.filter((item) => {
      const areTagsIntersection = !tags.length || tags.every(tag => item.tags.indexOf(tag) !== -1);
      const isTypeIntersection = !types.length || types.indexOf(item.type) !== -1;

      return areTagsIntersection && isTypeIntersection;
    });
  },
};
