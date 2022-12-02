<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import InputCustom from '@/components/formElements/InputCustom.vue';
import { mapActions } from 'vuex';
import { handleErrorAndRequestStatus } from '@/utils/misc';

export default {
  components: {
    ButtonText,
    ErrorMessage,
    InfoMessage,
    InputCustom,
  },
  data: () => ({
    email: '',
    requestHandling: {
      isRequestProcessing: false,
      errorMessage: '',
    },
  }),
  methods: {
    ...mapActions('auth', [
      '_requestResetPassword',
    ]),
    clearMessage() {
      this.requestHandling.errorMessage = '';
    },
    requestResetPassword() {
      this.requestHandling.isRequestProcessing = true;
      this.clearMessage();

      const request = this._requestResetPassword(this.email);

      handleErrorAndRequestStatus(request, this.requestHandling);
    },
  },
};
</script>

<template>
  <form
    class="request-reset-password"
    @submit.prevent="requestResetPassword"
  >
    <div class="info-container">
      <InfoMessage message="Enter email used for registration" />
    </div>
    <InputCustom
      v-model="email"
      label="e-mail"
      type="email"
      required
      :disabled="requestHandling.isRequestProcessing"
      @input="clearMessage"
    />
    <div class="error-container">
      <ErrorMessage
        v-if="requestHandling.errorMessage"
        :message="requestHandling.errorMessage"
      />
    </div>
    <ButtonText
      text="send validation code"
      style-type="bordered"
      type="submit"
      :disabled="requestHandling.isRequestProcessing"
    />
  </form>
</template>

<style lang="scss">
.request-reset-password {
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
