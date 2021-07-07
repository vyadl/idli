<template>
  <ModalBasic
    name="confirm"
    :headerText="headerText"
  >
    <template v-slot:mait>
      some text
    </template>
    <template v-slot:buttons>
      <ButtonText
        style-type="bordered"
        text="confirm"
        @click="submit"
      />
      <ButtonText
        style-type="bordered"
        text="cancel"
        @click="cancel"
      />
    </template>
  </ModalBasic>
</template>

<script>
import ModalBasic from '@/components/formElements/ModalBasic.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ModalBasic,
    ButtonText,
  },
  props: {
    headerText: String,
  },
  computed: {
    ...mapGetters(['isConfirmationModalShown']),
  },
  watch: {
    isConfirmationModalShown() {
      this.isConfirmationModalShown ? this.$modal.show('confirm') : this.$modal.hide('confirm');
    },
  },
  methods: {
    submit() {
      this.$emit('submit');
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
