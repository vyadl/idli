import { router } from '@/router';

function getQuery() {
  return router.currentRoute._value.query;
}

export function pushRouteKeepQuery({ name, params }) {
  router.push({ 
    name,
    params,
    query: getQuery(),
  });
}

export function addQueryItems(additionalQuery) {
  router.push({
    query: {
      ...getQuery(),
      ...additionalQuery,
    },
  });
}

export function deleteFromQuery(queryToDelete) {
  const query = { ...getQuery() };

  if (typeof queryToDelete === 'string') {
    delete query[queryToDelete];
  } else {
    queryToDelete.forEach(key => {
      delete query[key];
    });
  }

  router.push({ query });
}
