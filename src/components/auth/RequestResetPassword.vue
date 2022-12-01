<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import InputCustom from '@/components/formElements/InputCustom.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ButtonText,
    ErrorMessage,
    InfoMessage,
    InputCustom,
  },
  data: () => ({
    email: '',
    isRequestProcessing: false,
    errorMessage: '',
  }),
  methods: {
    ...mapActions('auth', [
      '_requestResetPassword',
    ]),
    clearMessage() {
      this.errorMessage = '';
    },
    requestResetPassword() {
      this.isRequestProcessing = true;
      this.clearMessage();
      this._requestResetPassword(this.email)
        .catch(errorMessage => {
          this.errorMessage = errorMessage;
        })
        .finally(() => {
          this.isRequestProcessing = false;
        });
    },
  },
};
</script>

<template>
  <form
    class="request-password-reset"
    @submit.prevent="requestResetPassword()"
  >
    <div class="info-container">
      <InfoMessage
        message="Enter email used for registration"
      />
    </div>
    <InputCustom
      v-model="email"
      label="e-mail"
      type="email"
      required
      :disabled="isRequestProcessing"
      @input="clearMessage"
    />
    <div class="error-container">
      <ErrorMessage
        v-if="errorMessage"
        :message="errorMessage"
      />
    </div>
    <ButtonText
      text="send validation code"
      style-type="bordered"
      type="submit"
      :disabled="isRequestProcessing"
    />
  </form>
</template>

<style lang="scss">
.request-password-reset {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 250px;

  .validation-code {
    padding-top: 10px;
  }

  .info-container,
  .error-container {
    width: 100%;
  }

  .info-container {
    text-align: center;
    padding-bottom: 15px;
  }

  .error-container {
    height: 40px;
  }
}
</style>
