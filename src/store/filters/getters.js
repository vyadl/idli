export default {
  currentSearchValue: state => state.currentSearchValue,
  checkedTags: state => state.checkedTags,
  checkedCategories: state => state.checkedCategories,
  allFilters: (state, getters) => {
    return {
      currentSearchValue: getters.currentSearchValue,
      checkedTags: getters.checkedTags,
      checkedCategories: getters.checkedCategories,
    };
  },
  filteredList: state => state.filteredList,
  filteredListLength: (state, getters) => getters.filteredList.length,
};
