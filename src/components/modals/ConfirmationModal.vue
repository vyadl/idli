<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { confirmationPromise } from '@/settings/confirmationPromise';
import { mapGetters } from 'vuex';

export default {
  components: {
    ModalBasic,
    ButtonText,
  },

  computed: {
    ...mapGetters([
      'confirmationModalTitle',
    ]),
  },

  methods: {
    confirm() {
      confirmationPromise.resolve();
      this.$vfm.hide('confirmationModal');
    },

    close() {
      confirmationPromise.reject();
      this.$vfm.hide('confirmationModal');
    },
  },
};
</script>

<template>
  <ModalBasic
    class="confirmation-modal"
    name="confirmationModal"
    :title="confirmationModalTitle"
    :width="400"
    :top="90"
  >
    <div class="buttons-wrapper">
      <ButtonText
        text="yes"
        @click="confirm"
      />
      <ButtonText
        text="no"
        @click="close"
      />
    </div>
  </ModalBasic>
</template>

<style lang="scss">
.confirmation-modal {
  .buttons-wrapper {
    display: flex;
    justify-content: center;
    gap: 40px;
    padding-top: 20px;
  }
}
</style>
