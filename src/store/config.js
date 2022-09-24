export const MIN_SEARCH_SYMBOLS = 3;
export const GENERATED_ITEM_TITLE_MAX_LENGTH = 22;

export const defaultVisualization = {
  sorting: 'dateCreated',
  mode: 'list',
  listAlign: 'center',
  areItemDetailsShown: false,
  isItemsOrderReversed: false,
};

export const sidebarModesForViews = {
  loggedInView: {
    sidebarModes: ['filters', 'visualization', 'lists', 'settings', 'bin'],
    default: 'lists',
  },
  authPageView: {
    sidebarModes: ['sign up', 'sign in'],
    default: 'sign in',
  },
  itemPublicView: {
    sidebarModes: ['settings'],
    default: 'settings',
  },
  listPublicView: {
    sidebarModes: ['filters', 'visualization', 'settings'],
    default: 'settings',
  },
};
