<script>
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import ItemView from '@/components/item/ItemView.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    InfoMessage,
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
          this.setIsItemSavingAllowed(true);
          this.$vfm.hide('itemConflictModal');
          this.setResponseItemObj(null);
        });
    },
    restoreItemFromServer() {
      this.setCurrentItemObj(this.responseItemObj);
      this.saveItemInCache(this.responseItemObj);
      this.setIsItemSavingAllowed(true);
      this.$vfm.hide('itemConflictModal');
      this.setResponseItemObj(null);
    },
  },
};
</script>

<template>
  <div class="item-conflict-form">
    <InfoMessage
      class="message"
      message="There is another version of the item on server. Action required:"
      big
    />
    <div class="items-to-compare">
      <div class="item-version">
        <ButtonText
          text="save current item"
          size="small"
          @click="saveCurrentItem"
        />
        <ItemView
          :item="currentItemObj"
        />
      </div>
      <div class="item-version">
        <ButtonText
          text="restore item from server"
          size="small"
          @click="restoreItemFromServer"
        />
        <ItemView
          :item="responseItemObj"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .item-conflict-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    
    .message {
      text-align: center;
      padding-bottom: 20px;
    }

    .items-to-compare {
      grid-area: c;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
    }

    .item-version {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
</style>
