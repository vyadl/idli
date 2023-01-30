// eslint-disable-next-line import/no-cycle
import { getParsedValue } from '@/store/utils';

export default {
  setCurrentSearchValue(state, value) {
    state.currentSearchValue = value;
  },
  setTags(state, tags) {
    state.checkedTags = getParsedValue(tags);
  },
  setCategories(state, categories) {
    state.checkedCategories = getParsedValue(categories);
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
