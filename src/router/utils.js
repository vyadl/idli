// eslint-disable-next-line import/no-cycle
import { router } from '@/router';
import { checkDefaultValue } from '@/utils/utils';
import { defaultValues } from '../../config';

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

export function changeQueryItem(option, value) {
  const isValueDefault = checkDefaultValue(defaultValues, option, value);
  
  if (isValueDefault) {
    deleteFromQuery(defaultValues[option].queryName);
  } else {
    const additionalQuery = {};
    const queryKey = defaultValues[option].queryName;
    additionalQuery[queryKey] = value;

    addQueryItems(additionalQuery);
  }
}

export function handleQueryOnLoad(queryOptions, currentQuery) {
  Object.keys(queryOptions).forEach(key => {
    if (Object.keys(currentQuery).includes(key)) {
      queryOptions[key].callback(
        queryOptions[key].withoutPayload ? '' : currentQuery[key],
      );
    }
  });
}
