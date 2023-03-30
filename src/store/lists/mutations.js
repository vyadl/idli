export default {
  setLists(state, lists) {
    state.lists = lists;
  },

  setTestLists(state, lists) {
    state.testLists = lists;
  },

  setCurrentListId(state, id) {
    state.currentListId = id;
  },

  setCurrentListObj(state, list) {
    state.currentListObj = list;
  },

  setParentListIdForNewList(state, id) {
    state.parentListIdForNewList = id;
  },

  setCurrentListView(state, view) {
    state.currentListView = view;
  },

  addList(state, list) {
    state.lists.push(list);
  },

  setEdittingListObj(state, list) {
    state.edittingListObj = list;
  },

  updateList(state, list) {
    const index = state.lists.findIndex(localList => localList.id === list.id);

    state.lists.splice(index, 1, list);
  },

  addTagToListLocally(state, { listId, tagTitle }) {
    const { tags } = state.lists.find(localList => localList.id === listId);
    
    tags.push({ 
      title: tagTitle,
      id: null,
    });
  },

  addCategoryToListLocally(state, { listId, categoryTitle }) {
    const { categories } = state.lists.find(localList => localList.id === listId);

    categories.push({ 
      title: categoryTitle,
      id: null,
    });
  },
  
  deleteList(state, id) {
    state.lists = state.lists.filter(list => list.id !== id);
  },

  addItemsFromTestList(state, items) {
    state.lists.find(list => list.id === state.currentListId).items = items;
  },
};
