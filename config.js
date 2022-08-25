export const MIN_SEARCH_SYMBOLS = 3;

export const BACKGROUND_REQUEST_FAIL_MESSAGE = 'Action failed. Please try again.';

export const defaultQueryValues = {
  tags: {
    default: '[]',
    queryName: 'tags',
  },
  categories: {
    default: '[]',
    queryName: 'categories',
  },
  sorting: {
    default: 'custom',
    queryName: 'sorting',
  },
  mode: {
    default: 'list',
    queryName: 'mode',
  },
  align: {
    default: 'center',
    queryName: 'submode',
  },
  theme: {
    default: 'default',
    queryName: 'theme',
  },
  isItemsOrderReversed: {
    default: false,
    queryName: 'reverse-order',
  },
  areItemDetailsShown: {
    default: false,
    queryName: 'with-details',
  },
};
