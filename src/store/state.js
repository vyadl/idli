export default {
  lists: [],
  testLists: [],
  currentListId: null,
  currentListItems: [],
  edittingListObj: null,
  checkedTags: [],
  checkedCategories: [],
  edittingItemObj: null,
  visualization: {
    sorting: 'default',
    mode: 'list',
    theme: 'default',
    shuffleTrigger: false,
    listAlign: 'center',
    areItemDetailsShown: false,
  },
  settings: {
    isItemFormInSidebar: false,
    isFocusOnList: false,
  },
  sidebar: {
    isOpen: false,
    mode: 'lists',
  },
  notification: '',
  requestsNumber: 0,
};
