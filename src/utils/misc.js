export const shuffleArray = (arr) => {
  const newArr = JSON.parse(JSON.stringify(arr));

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  return newArr;
};

export class DeferredBoolean {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    })
      .then(() => true)
      .catch(() => false);
  }
}

export function getFormattedDate(val) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  };

  return new Intl.DateTimeFormat('en', options).format(new Date(val));
}

export function handleRequestStatuses(request, componentRequestFields, options) {
  if (options?.onlyFinally) {
    return request.finally(() => {
      componentRequestFields.isRequestProcessing = false;
    });
  }

  return request
    .catch(errorMessage => {
      componentRequestFields.errorMessage = errorMessage;
    })
    .finally(() => {
      componentRequestFields.isRequestProcessing = false;
    });
}
