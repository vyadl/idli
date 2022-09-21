<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import ItemForm from '@/components/item/ItemForm.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ModalBasic,
    ItemForm,
  },
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
};
</script>

<template>
  <ModalBasic
    class="item-modal"
    name="itemModal"
    :title="title"
  >
    <ItemForm />
  </ModalBasic>
</template>
