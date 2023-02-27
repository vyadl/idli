<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import DraggableExternal from 'vuedraggable';
import ListItem from '@/components/item/ListItem.vue';

export default {
  components: {
    ListItem,
    DraggableExternal,
  },
  data() {
    return {
      isDragging: false,
      serverRequests: [],
    };
  },
  computed: {
    ...mapGetters([
      'currentListItems',
    ]),
    ...mapGetters('settings', [
      'isListUnderSidebar',
    ]),
    ...mapGetters('sidebar', [
      'isSidebarOpen',
    ]),
  },
  methods: {
    ...mapMutations([
      'setCurrentListItems',
    ]),
    ...mapActions('items', [
      '_fetchItemById',
    ]),
    ...mapActions('lists', [
      '_updateListItemsOrder',
    ]),
    startDrag() {
      this.isDragging = true;
    },
    endDrag() {
      this.isDragging = false;
    },
    updateList(value) {
      this.setCurrentListItems(value);
      this._updateListItemsOrder();
    },
    fetchItemById(id) {
      if (this.serverRequests.length) {
        this.serverRequests.forEach(request => {
          request.cancel();
        });
      }

      const source = this.$config.axios.CancelToken.source();

      this.serverRequests.push(source);
      this._fetchItemById({
        id,
        cancelToken: source.token,
      })
        .finally(() => {
          const index = this.serverRequests.findIndex(request => request === source);

          this.serverRequests.splice(index, 1);
        });
    },
  },
};
</script>

<template>
  <DraggableExternal
    v-if="currentListItems"
    class="draggable-list"
    :class="`${globalTheme}-theme`"
    ghost-class="ghost"
    item-key="id"
    :model-value="currentListItems"
    @update:model-value="updateList"
    @start="startDrag" 
    @end="endDrag" 
  >
    <template #item="{ element }">
      <ListItem
        :key="element.id"
        :item="element"
        class="list-item"
        bordered
        @click="fetchItemById"
      />
    </template>
  </DraggableExternal>
</template>

<style lang="scss">
.draggable-list {
  width: 100%;
  display: flex;
  flex-direction: column;

  .list-item {
    background-color: map-get($colors, 'white');
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  .flip-list-move {
    transition: transform 0.5s;
  }

  .ghost {
    opacity: 0.3;
    background-color: map-get($colors, 'gray-light');
  }

  &.inverted-theme {
    .list-item {
      background-color: map-get($colors, 'black');
    }

    .ghost {
      color: map-get($colors, 'black');
      background-color: map-get($colors, 'white');
    }
  }
}
</style>
