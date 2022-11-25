<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import PasswordChangeForm from '@/components/sidebarContent/settings/PasswordChangeForm.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ModalBasic,
    PasswordChangeForm,
  },
  computed: {
    ...mapGetters('lists', [
      'edittingListObj',
    ]),
  },
};
</script>

<template>
  <ModalBasic
    class="password-change-modal"
    name="passwordChangeModal"
    title="Change password"
    :width="400"
  >
    <PasswordChangeForm />
  </ModalBasic>
</template>
