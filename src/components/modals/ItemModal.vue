<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import ItemForm from '@/components/list/ItemForm.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ModalBasic,
    ItemForm,
  },
  computed: {
    ...mapGetters({
      edittingItemObj: 'edittingItemObj',
    }),
  },
};
</script>

<template>
  <ModalBasic
    class="item-modal"
    name="itemModal"
    :title="edittingItemObj ? 'edit item' : 'new item'"
  >
    <ItemForm />
  </ModalBasic>
</template>
