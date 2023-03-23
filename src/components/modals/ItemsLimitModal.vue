<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import WarningBox from '@/components/textElements/WarningBox.vue';

export default {
  components: {
    ModalBasic,
    ButtonText,
    WarningBox,
  },
  methods: {
    closeModal() {
      this.$vfm.hide('itemsLimitModal');
    },
  },
};
</script>

<template>
  <ModalBasic
    class="items-limit-modal"
    name="itemsLimitModal"
    title="Items limit exceeded"
    :width="400"
  >
    <div class="modal-content">
      <WarningBox message="Please delete items to add new one, or choose another list" />
      <ButtonText
        text="OK"
        @click="closeModal"
      />
    </div>
  </ModalBasic>
</template>

<style lang="scss" scoped>
.items-limit-modal {
  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
  }
}
</style>
