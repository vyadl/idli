import { LIST_ITEMS_MAX_COUNT } from '@/store/config';

export default {
  lists: state => state.lists,
  testLists: state => state.testLists,
  currentListId: state => state.currentListId,
  currentListObj: state => state.currentListObj,
  parentListIdForNewList: state => state.parentListIdForNewList,
  edittingListObj: state => state.edittingListObj,
  currentListTags: (state, getters) => getters.currentListObj?.tags,
  currentListTagsTitles: (state, getters) => getters.currentListTags.map(tag => tag.title),
  currentListCategories: (state, getters) => getters.currentListObj?.categories,
  currentListCategoriesTitles: (state, getters) => getters.currentListCategories.map(
    category => category.title,
  ),
  isUserOwnsCurrentList: state => state.lists.some(
    list => list.id === state.currentListId,
  ),
  isPublicView: state => state.currentListView === 'public',
  isOwnerView: (state, getters) => getters.isUserOwnsCurrentList && !getters.isPublicView,
  isMaxItemsCountReachedInCurrentList: state => {
    return state.currentListObj.items.length >= LIST_ITEMS_MAX_COUNT;
  },
};
