<template>
  <div class="lists-editting">
    <div>
      <div
        v-for="list in lists"
        :key="list.id"
      >
        <input
          type="text"
          v-model="list.name"
        >
        <button
          type="button"
          class="g-button"
          @click.stop.prevent="_removeList(list.id)"
        >
          remove list
        </button>
      </div>
      <input
        type="text"
        v-model="newListName"
      >
      <button
        type="button"
        class="g-button"
        @click.stop.prevent="addList(newListName)"
      >
        add list
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    newListName: '',
  }),
  computed: {
    ...mapGetters(['lists']),
  },
  methods: {
    ...mapActions([
      '_removeList',
      '_addList',
    ]),
    addList(name) {
      this._addList({ name });

      this.newListName = '';
    },
  },
};
</script>
