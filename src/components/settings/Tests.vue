<template>
<div class="tests">
  <div class="g-setting-title main">
    test data
  </div>
  <label 
    class="g-label"
    :class="{'active': makeInThisList}"
  >
    make in this list
    <input 
      type="checkbox"
      class="g-hidden"
      v-model="makeInThisList"
    >
  </label>
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
  data: function() {
    return {
      placeholderCount: 11,
      makeInThisList: false,
      makeNewFilters: false,
      testCounts: [22, 49, 104, 211, 303, 404],
    }
  },

  computed: {
    ...mapGetters(['filters', 'listNames', 'currentListId', 'doesTestListExist']),
  },

  methods: {
    ...mapActions(['_setList', '_addList', '_addFilter', '_setItems', '_switchList']),

    makeTestData(itemCount) {
      if (!this.makeInThisList) {
        if (!this.doesTestListExist) {
          this._addList({ name: 'test list', id: 'test' });
        } else if (this.currentListId !== 'test') {
          this._switchList('test');
        }

        if (this.makeNewFilters) {
          this.makeTestFilters();
        }
      }

      this.makeTestList(itemCount);
    },

    makeTestList(itemCount) {
      const list = [];
      const finalCount = itemCount === 'default' ? this.placeholderCount : itemCount;
      const types = this.filters.types;
      const tags = this.filters.tags;

      for (let i = 0; i < finalCount; i++) {
        list.push({
          text: `${this.makeTestWord(10)} ${Math.round(Math.random()) ? this.makeTestWord(10) : ''}`,
          details: `${this.makeTestWord(10)} ${this.makeTestWord(5)} ${this.makeTestWord(12)}`,
          type: this.getType(),
          tags: this.getTags(),
        });
      }

      this._setItems(list);
    },

    getType() {
      const types = this.filters.types;

      return types.length ? types[Math.floor(Math.random() * types.length)].id : '';
    },

    getTags() {
      const tagsCount = Math.round(Math.random() * this.filters.tags.length);
      const tags = [];

      if (tagsCount) {
        for (let i = 0; i < tagsCount; i++) {
          const tagId = this.filters.tags[Math.floor(Math.random() * this.filters.tags.length)].id;

          if (!tags.includes(tagId)) {
            tags.push(tagId);
          };
        };
      };

      return tags;
    },

    makeTestFilters() {
      const tagsMaxCount = 8;
      const typesMaxCount = 11;

      for (let i = 0; i < Math.floor(Math.random() * tagsMaxCount); i++) {
        this._addFilter({ name: this.makeTestWord(10), type: 'tags' })
      };

      for (let i = 0; i < Math.floor(Math.random() * typesMaxCount); i++) {
        this._addFilter({ name: this.makeTestWord(10), type: 'types' })
      };
    },

    makeTestWord(maxChars) {
      let text = '';
      const possible = 'abcdefghijklmnopqrstuvwxyz';

      for (let i = 0; i < maxChars; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    }
  },
}
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
