<script>
import SectionCard from '@/components/wrappers/SectionCard.vue';
import ItemForm from '@/components/item/ItemForm.vue';
import ItemView from '@/components/item/ItemView.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    SectionCard,
    ItemForm,
    ItemView,
    InfoMessage,
    ButtonText,
  },
  props: {
    isSidebarBreakpointReached: Boolean,
  },
  computed: {
    ...mapGetters('lists', [
      'lists',
      'currentListObj',
      'isOwnerView',
    ]),
    ...mapGetters('items', [
      'currentItemObj',
    ]),
    isItemInListWithChildLists() {
      const isListHasChildLists = this.lists
        .filter(list => list.parentListId === this.currentListObj.id)
        .length;
      const isListHasParentList = this.currentListObj.parentListId;

      return isListHasChildLists || isListHasParentList;
    },
  },
  methods: {
    ...mapMutations('items', [
      'setCurrentItemObj',
    ]),
    ...mapActions('items', [
      '_addNewItemPlaceholder',
    ]),
    ...mapActions('sidebar', [
      '_openSidebar',
    ]),
  },
};
</script>

<template>
  <div class="sidebar-item">
    <ButtonText
      v-if="isItemInListWithChildLists"
      text="back to list"
      size="small"
      style-type="underline"
      @click="_openSidebar('lists')"
    />
    <SectionCard v-if="currentItemObj">
      <ItemForm
        v-if="isOwnerView"
        :is-sidebar-breakpoint-reached="isSidebarBreakpointReached"
      />
      <ItemView
        v-else
        :item="currentItemObj"
        @finish-view="setCurrentItemObj(null)"
      />
    </SectionCard>
    <div v-else>
      <InfoMessage message="choose item from the list to see it here" />
      <ButtonText
        v-if="isOwnerView"
        text="or add new one"
        style-type="underline"
        @click="_addNewItemPlaceholder"
      />
    </div>
  </div>
</template>

<style lang="scss">
  .sidebar-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
