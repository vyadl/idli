<template>
  <div
    class="app-bin"
  >
    <SidebarCard
      title="lists"
      v-if="removedLists.length"
    >
      <CommonDeletedItem
        type="list"
        v-for="item in removedLists"
        :key="item.id"
        :item="item"
        @delete="_hardDeleteList(item.id)"
        @restore="_restoreList(item.id)"
      />
    </SidebarCard>
    <SidebarCard
      title="items"
      v-if="removedItems.length"
    >
      <div class="items">
        <CommonDeletedItem
          type="list"
          v-for="item in removedItems"
          :key="item.id"
          :item="item"
          @delete="_hardDeleteItem(item.id)"
          @restore="_restoreItem(item.id)"
        />
      </div>
    </SidebarCard>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import CommonDeletedItem from '@/components/sidebarContent/bin/CommonDeletedItem.vue';

export default {
  components: {
    SidebarCard,
    CommonDeletedItem,
  },
  computed: {
    ...mapGetters({
      removedLists: 'removedLists',
      removedItems: 'removedItems',
    }),
  },
  created() {
    this._fetchRemovedLists();
    this._fetchRemovedItems();
  },
  methods: {
    ...mapActions({
      _fetchRemovedLists: '_fetchRemovedLists',
      _fetchRemovedItems: '_fetchRemovedItems',
      _restoreList: '_restoreList',
      _deleteList: '_deleteList',
      _restoreItem: '_restoreItem',
      _deleteItem: '_deleteItem',
      _hardDeleteList: '_hardDeleteList',
      _hardDeleteItem: '_hardDeleteItem',
    }),
  },
};
</script>

<style lang="scss">
  .app-bin {

  }
</style>
