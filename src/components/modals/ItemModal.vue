<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import ItemForm from '@/components/item/ItemForm.vue';
import ItemView from '@/components/item/ItemView.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ModalBasic,
    ItemForm,
    ItemView,
  },
  computed: {
    ...mapGetters('lists', [
      'isOwnerView',
    ]),
  },
};
</script>

<template>
  <ModalBasic
    class="item-modal"
    name="itemModal"
  >
    <ItemForm v-if="isOwnerView" />
    <ItemView v-else />
  </ModalBasic>
</template>
