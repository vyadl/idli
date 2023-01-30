// eslint-disable-next-line import/no-cycle
import { router } from '@/router';
import { defaultQueryValues } from '@/router/config';

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

export function addQueryItems(queryToAdd) {
  router.push({
    query: {
      ...getQuery(),
      ...queryToAdd,
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

export function modifyQuery({ queryToDelete, queryToAdd }) {
  const query = {
    ...getQuery(),
    ...queryToAdd,
  };

  queryToDelete.forEach(key => {
    delete query[key];
  });

  router.push({ query });
}

export function changeQueryOption(option, value) {
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

  changeQueryOption(
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

export function deleteExtraQuery(queryOptions, currentQuery) {
  const availableQuery = new Set(Object.keys(queryOptions));

  const queryToDelete = Object.keys(currentQuery).filter(key => !availableQuery.has(key));

  deleteFromQuery(queryToDelete);
}

function getDefaultValue(optionsObj, option) {
  return optionsObj[option].default;
}

export function checkDefaultValue(optionsObj, option, value) {
  return value === getDefaultValue(optionsObj, option);
}
