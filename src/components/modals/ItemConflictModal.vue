<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import ItemConflictForm from '@/components/item/ItemConflictForm.vue';

export default {
  components: {
    ModalBasic,
    ItemConflictForm,
  },
};
</script>

<template>
  <ModalBasic
    class="item-conflict-modal"
    name="itemConflictModal"
  >
    <ItemConflictForm />
  </ModalBasic>
</template>
