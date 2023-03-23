export default {
  currentItemObj: state => state.currentItemObj,
  responseItemObj: state => state.responseItemObj,
  isItemSavingAllowed: state => state.isItemSavingAllowed,
  backgroundRequestsNumber: state => state.backgroundRequestsNumber,

  currentItemTags: (state, getters, rootState, rootGetters) => {
    return rootGetters['lists/currentListTags'].filter(
      listTag => getters.currentItemObj?.tags?.includes(listTag.id),
    );
  },

  currentItemCategory: (state, getters, rootState, rootGetters) => {
    return rootGetters['lists/currentListCategories'].find(
      category => category.id === getters.currentItemObj?.category,
    );
  },

  currentRelatedItemsIds: (state, getters) => {
    return getters.currentItemObj?.relatedItems?.map(relatedItem => relatedItem.id);
  },

  currentRelatedListsIds: (state, getters) => {
    return getters.currentItemObj?.relatedLists?.map(relatedList => relatedList.id);
  },
};
