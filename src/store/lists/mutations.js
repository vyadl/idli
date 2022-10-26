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

  setCurrentListView(state, view) {
    state.currentListView = view;
  },

  addList(state, list) {
    state.lists.push(list);
  },

  setListForEditting(state, list) {
    state.edittingListObj = list;
  },

  updateList(state, list) {
    const index = state.lists.findIndex(localList => localList.id === list.id);

    state.lists.splice(index, 1, list);
  },
  
  deleteList(state, id) {
    state.lists = state.lists.filter(list => list.id !== id);
  },

  addItemsFromTestList(state, items) {
    state.lists.find(list => list.id === state.currentListId).items = items;
  },
};
