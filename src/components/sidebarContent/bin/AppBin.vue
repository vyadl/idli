<template>
  <div
    class="app-bin"
  >
    <SidebarCard
      title="lists"
      v-if="deletedLists.length"
    >
      <div class="all-buttons">
        <ButtonText
          text="restore all lists"
          small
          :disabled="isRequestProcessing"
          @click="resolveAllAction('_restoreAllLists')"
        />
        <ButtonText
          text="delete all lists"
          style-type="underline"
          small
          :disabled="isRequestProcessing"
          @click="resolveAllAction('_hardDeleteAllLists')"
        />
      </div>
      <BinUnit
        type="list"
        v-for="item in deletedLists"
        :key="item.id"
        :item="item"
        :disabled="isRequestProcessing"
        @delete="resolveAction('_hardDeleteList', item.id)"
        @restore="resolveAction('_restoreList', item.id)"
      />
    </SidebarCard>
    <SidebarCard
      title="items"
      class="items"
      v-if="deletedItems.length"
    >
      <div class="all-buttons">
        <ButtonText
          text="restore all items"
          small
          :disabled="isRequestProcessing"
          @click="resolveAllAction('_restoreAllItems')"
        />
        <ButtonText
          text="delete all items"
          style-type="underline"
          small
          :disabled="isRequestProcessing"
          @click="resolveAllAction('_hardDeleteAllItems')"
        />
      </div>
      <BinUnit
        type="list"
        v-for="item in deletedItems"
        :key="item.id"
        :item="item"
        :disabled="isRequestProcessing"
        @delete="resolveAction('_hardDeleteItem', { itemId: item.id, listId: item.listId })"
        @restore="resolveAction('_restoreItem',{ itemId: item.id, listId: item.listId })"
      />
    </SidebarCard>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import BinUnit from '@/components/sidebarContent/bin/BinUnit.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';

export default {
  components: {
    SidebarCard,
    BinUnit,
    ButtonText,
  },
  data: () => ({
    isRequestProcessing: false,
  }),
  computed: {
    ...mapGetters({
      deletedLists: 'deletedLists',
      deletedItems: 'deletedItems',
    }),
  },
  created() {
    this._fetchDeletedLists();
    this._fetchDeletedItems();
  },
  methods: {
    ...mapActions({
      _fetchDeletedLists: '_fetchDeletedLists',
      _fetchDeletedItems: '_fetchDeletedItems',
      _restoreList: '_restoreList',
      _restoreItem: '_restoreItem',
      _hardDeleteList: '_hardDeleteList',
      _hardDeleteItem: '_hardDeleteItem',
      _setNotification: '_setNotification',
      _hardDeleteAllItems: '_hardDeleteAllItems',
      _hardDeleteAllLists: '_hardDeleteAllLists',
      _restoreAllItems: '_restoreAllItems',
      _restoreAllLists: '_restoreAllLists',
    }),
    resolveAction(action, payload) {
      this.isRequestProcessing = true;

      this[action](payload).then(res => {
        if (res?.data?.isListDeleted) {
          this._setNotification({
            text: `To see the restored item you need to restore this list - "${res?.data?.listTitle}"`,
            time: 15000,
          });
        }
      }).finally(() => {
        this.isRequestProcessing = false;
      });
    },
    resolveAllAction(action) {
      this.isRequestProcessing = true;

      this[action]().then(res => {
        if (res?.data?.listsTitlesArray?.length) {
          this._setNotification({
            text: `To see the restored items you need to restore these lists
              - "${res.data.listsTitlesArray.join(', ')}"`,
            time: 20000,
          });
        }
      }).finally(() => {
        this.isRequestProcessing = false;
      });
    },
  },
};
</script>

.<style lang="scss">
  .app-bin {
    .all-buttons {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
  }
</style>
