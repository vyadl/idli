export const MIN_SEARCH_SYMBOLS = 3;
export const GENERATED_ITEM_TITLE_MAX_LENGTH = 22;
export const SCREEN_SIZE_CHECK_DELAY = 100;

export const settingsValuesForMobileScreen = {
  isFocusOnList: false,
  isListUnderSidebar: true,
  isUsingHotkeys: false,
};

export const defaultVisualization = {
  sorting: 'custom',
  mode: 'list',
  listAlign: 'center',
  areItemDetailsShown: false,
  isItemsOrderReversed: false,
};

const sidebarButtonsForViews = {
  loggedInView: ['filters', 'visualization', 'lists', 'settings', 'bin'],
  itemPublicView: ['settings'],
  listPublicView: ['filters', 'visualization', 'settings'],
};

export const sidebarModesForViews = {
  loggedInView: {
    sidebarModes: sidebarButtonsForViews.loggedInView,
    allowedSidebarModes: ['item', ...sidebarButtonsForViews.loggedInView],
    default: 'lists',
  },
  itemPublicView: {
    sidebarModes: sidebarButtonsForViews.itemPublicView,
    allowedSidebarModes: ['item', ...sidebarButtonsForViews.itemPublicView],
    default: 'settings',
  },
  listPublicView: {
    sidebarModes: sidebarButtonsForViews.listPublicView,
    allowedSidebarModes: ['item', ...sidebarButtonsForViews.listPublicView],
    default: 'settings',
  },
};

export const publicListsForAuthScreen = [
  {
    title: 'Конституция республики Ужупис',
    id: '636ce561dd4921ae75617abe',
  },
  {
    title: 'Stars',
    id: '636ce565dd4921ae75617aed',
  },
  {
    title: 'mikromir',
    id: '636ce570dd4921ae75617b58',
  },
  {
    title: 'Почему котики классные',
    id: '636ce55add4921ae75617a99',
  },
  {
    title: 'План на лето',
    id: '636ce55edd4921ae75617aab',
  },
];

export const logoutOptions = [
  {
    title: 'log out',
    mode: 'current',
  },
  {
    title: 'log out from all devices',
    mode: 'all',
  },
  {
    title: 'log out from all devices except this one',
    mode: 'allExceptCurrent',
  },
];
