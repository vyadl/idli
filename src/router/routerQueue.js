export default {
  queue: [],
  isExecuting: false,

  add(request) {
    this.queue.push(request);

    if (!this.isExecuting) {
      this.isExecuting = true;
      this.execute();
    }
  },

  execute() {
    if (this.queue.length) {
      this.queue[0].method(this.queue[0].args)
        .then(() => {
          this.queue.shift();
          this.execute();
        });
    } else {
      this.isExecuting = false;
    }
  },
};
