<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import draggable from 'vuedraggable';
import ListItem from '@/components/item/ListItem.vue';

export default {
  components: {
    ListItem,
    draggable,
  },
  data() {
    return {
      isDragging: false,
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
  },
};
</script>

<template>
  <draggable
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
      />
    </template>
  </draggable>
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
