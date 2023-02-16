<script>
import ItemView from '@/components/item/ItemView.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    ItemView,
    ButtonText,
  },
  computed: {
    ...mapGetters('items', [
      'currentItemObj',
      'responseItemObj',
    ]),
  },
  methods: {
    ...mapMutations('items', [
      'setIsItemSavingAllowed',
      'setCurrentItemObj',
      'setResponseItemObj',
      'saveItemInCache',
    ]),
    ...mapActions('items', [
      '_updateItemOnServer',
    ]),
    saveCurrentItem() {
      this._updateItemOnServer({
        item: this.currentItemObj,
        cancelToken: null,
      })
        .then(() => {
          this.finishConflictResolve();
        });
    },
    restoreItemFromServer() {
      this.setCurrentItemObj(this.responseItemObj);
      this.saveItemInCache(this.responseItemObj);
      this.finishConflictResolve();
    },
    finishConflictResolve() {
      this.setIsItemSavingAllowed(true);
      this.$vfm.hide('itemConflictModal');
      this.setResponseItemObj(null);
    },
  },
};
</script>

<template>
  <div class="item-conflict-form">
    <div class="message">
      There is another version of the item on server. 
      <br> Action required:
    </div>
    <div class="items-to-compare">
      <ItemView
        v-for="item in [currentItemObj, responseItemObj]"
        :key="item?.updatedAt"
        :item="item"
        :is-query-need-deleting="false"
      />
    </div>
    <div class="buttons-container">
      <ButtonText
        text="save current item"
        size="small"
        @click="saveCurrentItem"
      />
      <ButtonText
        text="restore from server"
        size="small"
        @click="restoreItemFromServer"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .item-conflict-form {
    display: flex;
    flex-direction: column;
    gap: 30px;
    
    .message {
      padding: 15px;
      margin: 10px;
      border: 1px solid map-get($colors, 'gray-dark');
      box-shadow: 4px 4px map-get($colors, 'gray-dark');
    }

    .items-to-compare {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
    }

    .buttons-container {
      display: flex;
      justify-content: space-around;
    }
  }
</style>
