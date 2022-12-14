<script>
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import ListItem from '@/components/item/ListItem.vue';

export default {
  components: {
    draggable,
    ListItem,
  },
  data() {
    return {
      drag: false,
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
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: 'ghost',
      };
    },
    myList: {
      get() {
        return this.$store.getters.currentListItems;
      },
      set(itemsArray) {
        this.$store.commit('setCurrentListItems', itemsArray);
      },
    },
  },
  methods: {
    startDrag() {
      this.drag = true;
    },
    endDrag(value) {
      console.log(value);
      this.drag = false;
    },
    updateList(value) {
      this.$store.commit('setCurrentListItems', value);
      // dispatch list update on server
    },
  },
};
</script>

<template>
  <div
    v-if="currentListItems"
    class="draggable-list"
  >
    <draggable
      :model-value="currentListItems"
      v-bind="dragOptions"
      item-key="id"
      class="list-items"
      :class="{
        'move-to-left': !isListUnderSidebar && isSidebarOpen,
        parallax: isSidebarOpen,
      }"
      @update:model-value="value => updateList(value)"
      @start="startDrag" 
      @end="value => endDrag(value)" 
    >
      <template #item="{ element }">
        <ListItem
          :key="element.id"
          :item="element"
          class="list-item"
        />
      </template>
    </draggable>
  </div>
</template>

<style lang="scss">
.draggable-list {
  width: 100%;
  padding: 50px;
  
  .list-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    &.move-to-left {
      margin-right: 280px;
    }

    &.parallax {
      transform: translateX(-20px);
    }
  }

  .list-item {
    cursor: move;
  }

  .ghost {
    opacity: 0.3;
    background-color: map-get($colors, 'gray-very-light');
  }
}
</style>
