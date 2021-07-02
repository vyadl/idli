<template>
  <ModalBasic
    name="confirm"
    :confirmation="true"
    @submit="$emit('submit')"
    @cancel="$emit('cancel')"
  >
    sure?
  </ModalBasic>
</template>

<script>
import ModalBasic from '@/components/formElements/ModalBasic.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ModalBasic,
  },
  computed: {
    ...mapGetters(['isConfirmationModalShown']),
  },
  watch: {
    isConfirmationModalShown() {
      if (this.isConfirmationModalShown === true) {
        this.$modal.show('confirm');
      } else {
        this.$modal.hide('confirm');
      }
    },
  },
};
</script>
