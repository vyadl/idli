<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import BinUnit from '@/components/sidebarContent/bin/BinUnit.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import { isConfirmed } from '@/settings/confirmationPromise';

export default {
  components: {
    SectionCard,
    BinUnit,
    ButtonText,
    InfoMessage,
  },
  data: () => ({
    isRequestProcessing: false,
  }),
  computed: {
    ...mapGetters('bin', [
      'deletedLists',
      'deletedItems',
    ]),
  },
  created() {
    this._fetchBin();
  },
  methods: {
    ...mapMutations([
      'setNotification',
    ]),
    ...mapActions('bin', [
      '_fetchBin',
      '_restoreList',
      '_restoreItem',
      '_hardDeleteList',
      '_hardDeleteItem',
      '_hardDeleteAllItems',
      '_hardDeleteAllLists',
      '_restoreAllItems',
      '_restoreAllLists',
    ]),
    resolveAction(action, payload) {
      this.isRequestProcessing = true;

      this[action](payload).then(res => {
        if (res?.data?.isListDeleted) {
          this.setNotification({
            text: `To see the restored item you need to restore this list - 
              "${res?.data?.listTitle}"`,
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
          this.setNotification({
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
  <div class="sidebar-bin">
    <div v-if="deletedLists.length || deletedItems.length">
      <SectionCard
        v-show="deletedLists.length"
        title="lists"
      >
        <div class="all-buttons">
          <ButtonText
            text="restore all lists"
            size="small"
            :disabled="isRequestProcessing"
            @click="resolveAllAction('_restoreAllLists')"
          />
          <ButtonText
            text="delete all lists"
            style-type="underline"
            size="small"
            :disabled="isRequestProcessing"
            @click="resolveAllAction('_hardDeleteAllLists')"
          />
        </div>
        <BinUnit
          v-for="item in deletedLists"
          :key="item.id"
          :item="item"
          type="list"
          :disabled="isRequestProcessing"
          @delete="resolveAction('_hardDeleteList', item.id)"
          @restore="resolveAction('_restoreList', item.id)"
        />
      </SectionCard>
      <SectionCard
        v-show="deletedItems.length"
        title="items"
        class="items"
      >
        <div class="all-buttons">
          <ButtonText
            text="restore all items"
            size="small"
            :disabled="isRequestProcessing"
            @click="resolveAllAction('_restoreAllItems')"
          />
          <ButtonText
            text="delete all items"
            style-type="underline"
            size="small"
            :disabled="isRequestProcessing"
            @click="resolveAllAction('_hardDeleteAllItems')"
          />
        </div>
        <BinUnit
          v-for="item in deletedItems"
          :key="item.id"
          :item="item"
          type="list"
          :disabled="isRequestProcessing"
          @delete="resolveAction('_hardDeleteItem', { itemId: item.id, listId: item.listId })"
          @restore="resolveAction('_restoreItem',{ itemId: item.id, listId: item.listId })"
        />
      </SectionCard>
    </div>
    <div 
      v-else
      class="message"
    >
      <InfoMessage message="nothing was deleted so far" />
    </div>
  </div>
</template>

<style lang="scss">
  .sidebar-bin {
    .all-buttons {
      display: flex;
      gap: 30px;
      margin-bottom: 15px;
    }
    .message {
      text-align: center;
    }
  }
</style>
