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
  itemLoggedInView: ['lists', 'settings', 'bin'],
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
  itemLoggedInView: {
    sidebarModes: sidebarButtonsForViews.itemLoggedInView,
    allowedSidebarModes: ['item', ...sidebarButtonsForViews.itemLoggedInView],
    default: 'lists',
  },
  listPublicView: {
    sidebarModes: sidebarButtonsForViews.listPublicView,
    allowedSidebarModes: ['item', ...sidebarButtonsForViews.listPublicView],
    default: 'settings',
  },
};

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
