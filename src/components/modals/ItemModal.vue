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
    ]),
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
