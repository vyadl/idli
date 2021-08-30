export default {
  lists: [],
  testLists: [],
  currentListId: null,
  currentListItems: [],
  edittingListObj: null,
  checkedTags: [],
  checkedCategories: [],
  edittingItemObj: null,
  sorting: 'default',
  mode: 'list',
  theme: 'default',
  shuffleTrigger: false,
  removedLists: [],
  removedItems: [],
  settings: {
    isItemFormInSidebar: false,
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
