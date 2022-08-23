<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import ListForm from '@/components/list/ListForm.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ModalBasic,
    ListForm,
  },
  computed: {
    ...mapGetters([
      'edittingListObj',
    ]),
  },
};
</script>

<template>
  <ModalBasic
    class="list-modal"
    name="listModal"
    :title="edittingListObj ? 'edit list' : 'new list'"
  >
    <ListForm />
  </ModalBasic>
</template>
