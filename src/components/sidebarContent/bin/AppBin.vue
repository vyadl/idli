<script>
import { mapGetters, mapActions } from 'vuex';
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import BinUnit from '@/components/sidebarContent/bin/BinUnit.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import { isConfirmed } from '@/settings/confirmationPromise';

export default {
  components: {
    SidebarCard,
    BinUnit,
    ButtonText,
    InfoMessage,
  },
  data: () => ({
    isRequestProcessing: false,
  }),
  computed: {
    ...mapGetters([
      'deletedLists',
      'deletedItems',
    ]),
  },
  created() {
    this._fetchDeletedLists();
    this._fetchDeletedItems();
  },
  methods: {
    ...mapActions([
      '_fetchDeletedLists',
      '_fetchDeletedItems',
      '_restoreList',
      '_restoreItem',
      '_hardDeleteList',
      '_hardDeleteItem',
      '_setNotification',
      '_hardDeleteAllItems',
      '_hardDeleteAllLists',
      '_restoreAllItems',
      '_restoreAllLists',
    ]),
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
    async resolveAllAction(action) {
      if (['_hardDeleteAllLists', '_hardDeleteAllItems'].includes(action)) {
        const isRejected = !await isConfirmed();

        if (isRejected) {
          return false;
        }
      }

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

<template>
<div class="app-bin">
  <div
    v-if="deletedLists.length || deletedItems.length"
  >
    <SidebarCard
      title="lists"
      v-show="deletedLists.length"
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
      v-show="deletedItems.length"
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
  <div 
    v-else
    class="message"
  >
    <InfoMessage message="nothing was deleted so far"/>
  </div>
</div>
</template>

.<style lang="scss">
  .app-bin {
    .all-buttons {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    .message {
      text-align: center;
    }
  }
</style>
