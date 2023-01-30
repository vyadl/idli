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
  isItemsOrderReversed: {
    default: false,
    queryName: 'reverse-order',
  },
  areItemDetailsShown: {
    default: false,
    queryName: 'with-details',
  },
  currentListView: {
    default: 'owner',
    queryName: 'view',
  },
};

export const queryGroups = {
  visualization: [
    'sorting',
    'mode',
    'submode',
    'reverse-order',
    'with-details',
  ],
  filters: [
    'search',
    'tags',
    'categories',
  ],
  sidebar: [
    'sidebar',
    'item',
  ],
};
