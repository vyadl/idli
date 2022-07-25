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
