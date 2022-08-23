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

export function getDefaultValue(optionsObj, option) {
  return optionsObj[option].default;
}

export function checkDefaultValue(optionsObj, option, value) {
  return value === getDefaultValue(optionsObj, option);
}
