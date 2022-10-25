export default {
  setCurrentSearchValue(state, value) {
    state.currentSearchValue = value;
  },
  setTags(state, tags) {
    if (typeof tags === 'string') {
      state.checkedTags = JSON.parse(tags);
    } else {
      state.checkedTags = tags;
    }
  },
  setCategories(state, categories) {
    if (typeof categories === 'string') {
      state.checkedCategories = JSON.parse(categories);
    } else {
      state.checkedCategories = categories;
    }
  },
  setFilteredList(state, list) {
    state.filteredList = list;
  },
  resetFilters(state) {
    state.checkedTags = [];
    state.checkedCategories = [];
    state.currentSearchValue = '';
  },
};
