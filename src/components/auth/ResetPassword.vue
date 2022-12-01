<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import InputCustom from '@/components/formElements/InputCustom.vue';
import PasswordField from '@/components/auth/PasswordField.vue';
import { mapGetters, mapActions } from 'vuex';
// eslint-disable-next-line import/no-cycle
import { handleQueryOnLoad } from '@/router/utils';

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
    isRequestProcessing: false,
    errorMessage: '',
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
  },
  methods: {
    ...mapActions('auth', [
      '_requestResetPassword',
      '_resetPassword',
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
    resetPassword() {
      if (this.newPassword === this.passwordToCheck) {
        this.isRequestProcessing = true;
        this.clearMessage();
        this._resetPassword({
          email: this.email,
          code: this.validationCode,
          password: this.newPassword,
        })
          .catch(errorMessage => {
            this.errorMessage = errorMessage;
          })
          .finally(() => {
            this.isRequestProcessing = false;
          });
      } else {
        this.errorMessage = 'passwords don\'t match';
      }
    },
  },
};
</script>

<template>
  <form
    class="password-reset"
    @submit.prevent="resetPassword()"
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
        v-if="errorMessage"
        :message="errorMessage"
      />
    </div>
    <ButtonText
      text="reset password"
      style-type="bordered"
      type="submit"
      :disabled="isRequestProcessing"
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
