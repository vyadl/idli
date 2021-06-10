<template>
<div class="tests">
  <div class="g-setting-title main">
    test data
  </div>
  <label
    class="g-label"
    :class="{'active': makeNewFilters}"
  >
    make new filters
    <input
      type="checkbox"
      class="g-hidden"
      v-model="makeNewFilters"
    >
  </label>
  <form @submit.stop.prevent="makeTestData('default')">
    <input
      type="number"
      class="g-input input"
      placeholder="number of items"
      max="1000"
      min="0"
      step="1"
      v-model="placeholderCount"
      autofocus
    >
    <button
      type="submit"
      class="g-button"
    >
      make test list
    </button>
  </form>
  <br>
  <br>
  <button
    type="button"
    class="g-button"
    v-for="(number, index) in testCounts"
    :key="index"
    @click="makeTestData(number)"
  >
    {{ number }}
  </button>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    placeholderCount: 11,
    makeNewFilters: false,
    testCounts: [22, 49, 104, 211, 303, 404],
  }),
  computed: {
    ...mapGetters([
      'currentListFilters',
      'currentListId',
      'currentListObj',
    ]),
  },
  methods: {
    ...mapActions([
      '_addList',
      '_addFilter',
      '_setItems',
      '_switchList',
    ]),
    makeTestData(itemCount) {
      this._addList('test list');
      if (this.makeNewFilters) {
        this.makeTestFilters();
      }

      this.makeTestList(itemCount);
    },
    makeTestList(itemCount) {
      const list = {};
      const finalCount = itemCount === 'default' ? this.placeholderCount : itemCount;
      const maxId = Object.keys(this.currentListObj.items).length
        ? Math.max(...Object.keys(this.currentListObj.items))
        : 0;
      let newId = maxId + 1;

      for (let i = 0; i < finalCount; i++) {
        list[newId] = {
          id: newId,
          text: `${this.makeTestWord(10)} ${Math.round(Math.random()) ? this.makeTestWord(10) : ''}`,
          details: `${this.makeTestWord(10)} ${this.makeTestWord(5)} ${this.makeTestWord(12)}`,
          category: this.getCategory(),
          tags: this.getTags(),
        };

        newId++;
      }

      this._setItems(list);
    },
    getCategory() {
      const { categories } = this.currentListFilters;

      return categories.length ? categories[Math.floor(Math.random() * categories.length)].id : '';
    },
    getTags() {
      const tagsCount = Math.round(Math.random() * this.currentListFilters.tags.length);
      const tags = [];

      if (tagsCount) {
        for (let i = 0; i < tagsCount; i++) {
          const tagId = this.currentListFilters
            .tags[Math.floor(Math.random() * this.currentListFilters.tags.length)].id;

          if (!tags.includes(tagId)) {
            tags.push(tagId);
          }
        }
      }

      return tags;
    },
    makeTestFilters() {
      const tagsMaxCount = 8;
      const categoriesMaxCount = 11;

      for (let i = 0; i < Math.floor(Math.random() * tagsMaxCount); i++) {
        this._addFilter({ name: this.makeTestWord(10), type: 'tags' });
      }

      for (let i = 0; i < Math.floor(Math.random() * categoriesMaxCount); i++) {
        this._addFilter({ name: this.makeTestWord(10), type: 'categories' });
      }
    },
    makeTestWord(maxChars) {
      let text = '';
      const possible = 'abcdefghijklmnopqrstuvwxyz';

      for (let i = 0; i < maxChars; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    },
  },
};
</script>

<style lang="scss">
  .tests {
    .input {
      margin-bottom: 10px;
      width: 50px;
      margin-left: 5px;
    }
  }
</style>
