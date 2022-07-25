<template>
  <ModalBasic
    class="confirmation-modal"
    name="confirmationModal"
    :title="modalTitle"
    :width="400"
    :top="90"
  >
    <div class="buttons-wrapper">
      <ButtonText
        text="yes"
        @click="confirm"
      >
      </ButtonText>
      <ButtonText
        text="no"
        @click="close"
      >
      </ButtonText>
    </div>
  </ModalBasic>
</template>

<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { confirmationPromise } from '@/settings/confirmationPromise';
import { mapState } from 'vuex';

export default {
  components: {
    ModalBasic,
    ButtonText,
  },

  computed: {
    ...mapState({
      modalTitle: 'modalTitle',
    }),
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
