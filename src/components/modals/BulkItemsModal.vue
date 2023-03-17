<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import BulkItemsForm from '@/components/item/BulkItemsForm.vue';

export default {
  components: {
    ModalBasic,
    BulkItemsForm,
  },
};
</script>

<template>
  <ModalBasic
    class="bulk-items-modal"
    name="bulkItemsModal"
  >
    <BulkItemsForm />
  </ModalBasic>
</template>
