export default {
  lists: [],
  currentListObj: null,
  edittingListObj: null,
  checkedTags: [],
  checkedCategories: [],
  edittingItemObj: null,
  shuffledList: null,
  settingsStatuses: {
    filters: false,
    visualization: false,
    tests: false,
    lists: false,
  },
  shuffleTrigger: false,
  mode: {
    list: true,
    cloud: false,
    stars: false,
    shuffle: false,
  },
  starsSettings: {
    sizeRange: [1, 9],
    colors: 1,
    showByHover: true,
  },
  isInvert: false,
  sidebar: {
    isOpen: false,
    mode: null,
  },
};
