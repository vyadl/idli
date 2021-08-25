<template>
  <ModalBasic
    name="itemModal"
    :header-text="edittingItemObj ? 'edit item' : 'new item'"
    :isFooterShown="false"
  >
    <template v-slot:main>
      <ItemForm />
    </template>
  </ModalBasic>
</template>

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
