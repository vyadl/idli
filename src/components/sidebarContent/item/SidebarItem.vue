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
      'isOwnerView',
    ]),
    ...mapGetters('items', [
      'currentItemObj',
    ]),
  },
  methods: {
    ...mapMutations('items', [
      'setCurrentItemObj',
    ]),
    ...mapActions('items', [
      '_addNewItemPlaceholder',
    ]),
  },
};
</script>

<template>
  <SectionCard
    v-if="currentItemObj"
    class="sidebar-item"
  >
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
</template>
