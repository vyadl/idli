<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import ItemForm from '@/components/item/ItemForm.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    SidebarCard,
    ItemForm,
    InfoMessage,
    ButtonText,
  },
  emits: ['scrollSidebarToTop'],
  computed: {
    ...mapGetters([
      'edittingItemObj',
    ]),
  },
  methods: {
    ...mapActions([
      '_addNewItemPlaceholder',
    ]),
    scrollSidebarToTop() {
      this.$emit('scrollSidebarToTop');
    },
  },
};
</script>

<template>
  <SidebarCard
    v-if="edittingItemObj"
    class="sidebar-item"
    :title="edittingItemObj.id ? 'edit item' : 'new item'"
  >
    <ItemForm @scroll-sidebar-to-top="scrollSidebarToTop" />
  </SidebarCard>
  <div v-else>
    <ButtonText
      text="add new item"
      style-type="underline"
      @click="_addNewItemPlaceholder"
    />
    <InfoMessage message="or choose one from the list" />
  </div>
</template>
