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
      'isUserOwnsCurrentList',
      'isPublicView',
    ]),
    title() {
      let title = '';

      if (this.isUserOwnsCurrentList && !this.isPublicView) {
        title = this.edittingItemObj?.id ? 'edit item' : 'new item';
      } else {
        title = 'item info';
      }

      return title;
    },
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
    :title="title"
  >
    <ItemForm @scroll-sidebar-to-top="scrollSidebarToTop" />
  </SidebarCard>
  <div v-else>
    <InfoMessage message="choose item from the list to see it here" />
    <ButtonText
      v-if="isUserOwnsCurrentList && !isPublicView"
      text="or add new one"
      style-type="underline"
      @click="_addNewItemPlaceholder"
    />
  </div>
</template>
