export default {
  lists: [],
  testLists: [],
  currentListId: null,
  currentListItems: [],
  edittingListObj: null,
  checkedTags: [],
  checkedCategories: [],
  edittingItemObj: null,
  deletedLists: [],
  deletedItems: [],
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
    isListUnderSidebar: true,
  },
  sidebar: {
    isOpen: false,
    mode: 'lists',
  },
  notification: {
    time: null,
    text: '',
  },
  requestsNumber: 0,
};
