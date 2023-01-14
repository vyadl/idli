<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import InputCustom from '@/components/formElements/InputCustom.vue';
import PasswordField from '@/components/auth/PasswordField.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { handleQueryOnLoad } from '@/router/utils';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    ButtonText,
    ErrorMessage,
    InfoMessage,
    InputCustom,
    PasswordField,
  },
  data: () => ({
    email: '',
    validationCode: '',
    newPassword: '',
    passwordToCheck: '',
    requestHandling: {
      isRequestProcessing: false,
      errorMessage: '',
    },
  }),
  computed: {
    ...mapGetters('auth', [
      'codeLifetimeInMinutes',
    ]),
    infoMessage() {
      return `Validation code has been sent to the email.
          It will be valid for ${this.codeLifetimeInMinutes} minutes`;
    },
  },
  created() {
    const queryOptions = {
      email: {
        callback: email => {
          this.email = email;
        },
      },
    };
    
    handleQueryOnLoad(queryOptions, this.$route.query);

    if (!this.codeLifetimeInMinutes) {
      const minutes = sessionStorage.getItem('codeLifetimeInMinutes');

      this.setCodeLifetimeInMinutes(minutes);
    }
  },
  methods: {
    ...mapMutations('auth', [
      'setCodeLifetimeInMinutes',
    ]),
    ...mapActions('auth', [
      '_requestResetPassword',
      '_resetPassword',
    ]),
    clearMessage() {
      this.requestHandling.errorMessage = '';
    },
    requestResetPassword() {
      this.requestHandling.isRequestProcessing = true;
      this.clearMessage();

      const request = this._requestResetPassword(this.email);
      
      handleRequestStatuses(request, this.requestHandling);
    },
    resetPassword() {
      if (this.newPassword === this.passwordToCheck) {
        this.requestHandling.isRequestProcessing = true;
        this.clearMessage();

        const request = this._resetPassword({
          email: this.email,
          code: this.validationCode,
          password: this.newPassword,
        });

        handleRequestStatuses(request, this.requestHandling);
      } else {
        this.requestHandling.errorMessage = 'passwords don\'t match';
      }
    },
  },
};
</script>

<template>
  <form
    class="password-reset"
    @submit.prevent="resetPassword"
  >
    <InputCustom
      v-model="email"
      label="e-mail"
      type="email"
      required
      disabled
      @input="clearMessage"
    />
    <div class="info-container">
      <InfoMessage
        :message="infoMessage"
      />
    </div>
    <ButtonText
      text="resend code"
      style-type="underline"
      size="smallest"
      @click="requestResetPassword"
    />
    <InputCustom
      v-model="validationCode"
      class="validation-code"
      label="validation code"
      required
      @input="clearMessage"
    />
    <PasswordField
      v-model="newPassword"
      label="new password"
      @input="clearMessage"
    />
    <PasswordField
      v-model="passwordToCheck"
      label="confirm password"
      @input="clearMessage"
    />
    <div class="error-container">
      <ErrorMessage
        v-if="requestHandling.errorMessage"
        :message="requestHandling.errorMessage"
      />
    </div>
    <ButtonText
      text="reset password"
      style-type="bordered"
      type="submit"
      :disabled="requestHandling.isRequestProcessing"
    />
  </form>
</template>

<style lang="scss">
.password-reset {
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
  }

  .error-container {
    height: 40px;
  }
}
</style>
