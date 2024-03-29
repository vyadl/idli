<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import BinUnit from '@/components/sidebarContent/bin/BinUnit.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import { isConfirmed } from '@/settings/confirmationPromise';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    SectionCard,
    BinUnit,
    ButtonText,
    InfoMessage,
  },
  props: {
    isSidebarBreakpointReached: Boolean,
  },
  data: () => ({
    requestHandling: {
      isRequestProcessing: false,
    },
    binMode: '',
  }),
  computed: {
    ...mapGetters('bin', [
      'deletedLists',
      'deletedItems',
    ]),
    deletedUnitsTypes() {
      const types = [];

      if (this.deletedLists.length) {
        types.push({
          title: 'lists',
          length: this.deletedLists.length,
        });
      } 
      
      if (this.deletedItems.length) {
        types.push({
          title: 'items',
          length: this.deletedItems.length,
        });
      }

      return types;
    },
  },
  created() {
    this._fetchBin()
      .then(() => {
        if (this.deletedLists.length) {
          this.binMode = 'lists';
        } else if (this.deletedItems.length) {
          this.binMode = 'items';
        }
      });
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
    changeBinMode(mode) {
      this.binMode = mode;
    },
    changeBinModeToAvailable() {
      const availableMode = this.deletedUnitsTypes.find(type => type.length);

      if (availableMode) {
        this.changeBinMode(availableMode.title);
      }
    },
    resolveAction(action, payload) {
      this.requestHandling.isRequestProcessing = true;

      const request = this[action](payload);
      
      handleRequestStatuses(request, this.requestHandling, { onlyFinally: true })
        .then(res => {
          if (res?.data?.isListDeleted) {
            this.setNotification({
              text: `To see the restored item you need to restore this list - 
                "${res?.data?.listTitle}"`,
              time: 15000,
            });
          }

          this.changeBinModeToAvailable();
        });
    },
    async resolveAllAction(action) {
      if (['_hardDeleteAllLists', '_hardDeleteAllItems'].includes(action)) {
        const isRejected = !await isConfirmed();

        if (isRejected) {
          return false;
        }
      }

      this.requestHandling.isRequestProcessing = true;

      const request = this[action]();
      
      handleRequestStatuses(request, this.requestHandling, { onlyFinally: true })
        .then(res => {
          if (res?.data?.listsTitlesArray?.length) {
            this.setNotification({
              text: `To see the restored items you need to restore these lists
                - "${res.data.listsTitlesArray.join(', ')}"`,
              time: 20000,
            });
          }
        });
    },
  },
};
</script>

<template>
  <div class="sidebar-bin">
    <div v-if="deletedLists.length || deletedItems.length">
      <div
        class="bin-mode-buttons"
        :class="{ 'left': isSidebarBreakpointReached }"
      >
        <ButtonText
          v-for="type in deletedUnitsTypes"
          :key="type.title"
          :text="`${type.title} (${type.length})`"
          style-type="brick"
          :active="binMode === type.title"
          @click="changeBinMode(type.title)"
        />
      </div>
      <SectionCard v-if="binMode === 'lists'">
        <div class="all-buttons">
          <ButtonText
            text="restore all lists"
            size="small"
            :disabled="requestHandling.isRequestProcessing"
            @click="resolveAllAction('_restoreAllLists')"
          />
          <ButtonText
            text="delete all lists"
            style-type="underline"
            size="small"
            :disabled="requestHandling.isRequestProcessing"
            @click="resolveAllAction('_hardDeleteAllLists')"
          />
        </div>
        <div class="deleted-lists">
          <BinUnit
            v-for="item in deletedLists"
            :key="item.id"
            :unit="item"
            type="list"
            :disabled="requestHandling.isRequestProcessing"
            @delete="resolveAction('_hardDeleteList', item.id)"
            @restore="resolveAction('_restoreList', item.id)"
          />
        </div>
      </SectionCard>
      <SectionCard v-if="binMode === 'items'">
        <div class="all-buttons">
          <ButtonText
            text="restore all items"
            size="small"
            :disabled="requestHandling.isRequestProcessing"
            @click="resolveAllAction('_restoreAllItems')"
          />
          <ButtonText
            text="delete all items"
            style-type="underline"
            size="small"
            :disabled="requestHandling.isRequestProcessing"
            @click="resolveAllAction('_hardDeleteAllItems')"
          />
        </div>
        <div class="deleted-items">
          <BinUnit
            v-for="item in deletedItems"
            :key="item.id"
            :unit="item"
            type="list"
            :disabled="requestHandling.isRequestProcessing"
            @delete="resolveAction('_hardDeleteItem', { itemId: item.id, listId: item.listId })"
            @restore="resolveAction('_restoreItem',{ itemId: item.id, listId: item.listId })"
          />
        </div>
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

<style lang="scss" scoped>
  .sidebar-bin {
    .bin-mode-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      padding-bottom: 10px;

      &.left {
        justify-content: flex-start;
      }
    }

    .all-buttons {
      display: flex;
      justify-content: space-between;
      padding-top: 10px;
    }

    .deleted-items,
    .deleted-lists {
      display: flex;
      flex-direction: column;
      padding-top: 40px;
    }

    .message {
      text-align: center;
    }
  }
</style>
