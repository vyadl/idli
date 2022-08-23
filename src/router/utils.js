// eslint-disable-next-line import/no-cycle
import { router } from '@/router';
import { checkDefaultValue } from '@/utils/utils';
import { defaultQueryValues } from '../../config';

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

export function changeQuery(option, value) {
  if (value) {
    addQueryItems({
      [option]: value,
    });
  } else {
    deleteFromQuery(option);
  }
}

export function changeQueryRespectingDefault(option, value) {
  const isValueDefault = checkDefaultValue(defaultQueryValues, option, value);

  changeQuery(
    defaultQueryValues[option].queryName,
    isValueDefault ? null : value,
  );
}

export function handleQueryOnLoad(queryOptions, currentQuery) {
  const currentQueryKeys = new Set(Object.keys(currentQuery));

  Object.keys(queryOptions).forEach(key => {
    if (currentQueryKeys.has(key)) {
      if (queryOptions[key].withoutPayload) {
        queryOptions[key].callback();
      } else {
        queryOptions[key].callback(currentQuery[key]);
      }
    }
  });
}
