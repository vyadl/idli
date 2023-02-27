// eslint-disable-next-line import/no-cycle
import { changeQueryOption, changeQueryRespectingDefault, deleteFromQuery } from '@/router/utils';
import { queryGroups } from '@/router/config';
import { MIN_SEARCH_SYMBOLS } from '@/store/config';

export default {
  _setCurrentSearchValue({ commit }, search) {
    commit('setCurrentSearchValue', search);

    changeQueryOption({
      option: 'search', 
      value: search.length >= MIN_SEARCH_SYMBOLS ? search : null,
    });
  },

  _setTags({ commit }, tags) {
    commit('setTags', tags);
    changeQueryRespectingDefault({ option: 'tags', value: JSON.stringify(tags) });
  },

  _setCategories({ commit }, categories) {
    commit('setCategories', categories);
    changeQueryRespectingDefault({ option: 'categories', value: JSON.stringify(categories) });
  },

  _filterList({ state, getters, commit }, list) {
    const tags = getters.checkedTags;
    const categories = getters.checkedCategories;
    const lowerCasedSearchValue = state.currentSearchValue.toLowerCase();

    const filteredList = list.filter(item => {
      const areTagsIntersection = !tags.length || tags.every(tag => item.tags.includes(tag));
      const isCategoryIntersection = !categories.length || categories.includes(item.category);
      
      const isSearchValueRelevant = state.currentSearchValue 
        && state.currentSearchValue.length >= MIN_SEARCH_SYMBOLS;
      const isIncludesSearchValue = !isSearchValueRelevant
        || item.title.toLowerCase().includes(lowerCasedSearchValue)
        || item.details.toLowerCase().includes(lowerCasedSearchValue);

      return areTagsIntersection && isCategoryIntersection && isIncludesSearchValue;
    });

    commit('setFilteredList', filteredList);
  },

  _resetFilters({ commit }) {
    commit('resetFilters');
    deleteFromQuery(queryGroups.filters);
  },
};
