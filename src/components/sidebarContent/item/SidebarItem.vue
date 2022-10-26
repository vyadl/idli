<script>
import SectionCard from '@/components/wrappers/SectionCard.vue';
import ItemForm from '@/components/item/ItemForm.vue';
import ItemView from '@/components/item/ItemView.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    SectionCard,
    ItemForm,
    ItemView,
    InfoMessage,
    ButtonText,
  },
  emits: ['scrollSidebarToTop'],
  computed: {
    ...mapGetters('lists', [
      'isOwnerView',
    ]),
    ...mapGetters('items', [
      'edittingItemObj',
    ]),
  },
  methods: {
    ...mapActions('items', [
      '_addNewItemPlaceholder',
    ]),
    scrollSidebarToTop() {
      this.$emit('scrollSidebarToTop');
    },
  },
};
</script>

<template>
  <SectionCard
    v-if="edittingItemObj"
    class="sidebar-item"
  >
    <ItemForm 
      v-if="isOwnerView"
      @scroll-sidebar-to-top="scrollSidebarToTop"
    />
    <ItemView v-else />
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
