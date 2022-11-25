<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import InputCustom from '@/components/formElements/InputCustom.vue';
import PasswordField from '@/components/auth/PasswordField.vue';
import { mapActions } from 'vuex';
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
    infoMessage() {
      return `Validation code has been sent to the email.
          It will be valid for 10 minutes`;
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
      console.log(this.isRequestProcessing);
      this.clearMessage();
      this._requestResetPassword(this.email)
        .catch(error => {
          this.errorMessage = error.response.data.message;
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
          .catch(error => {
            this.errorMessage = error.response.data.message;
          })
          .finally(() => {
            this.isRequestProcessing = false;
          });
      } else {
        this.errorMessage = 'passwords don`t match';
      }
    },
  },
};
</script>

<template>
  <div class="password-reset">
    <InputCustom
      v-model="email"
      label="e-mail"
      type="email"
      required
      :disabled="$route.name === 'resetPassword'"
      @input="clearMessage"
    />
    <div
      v-if="$route.name === 'requestResetPassword'"
      class="input-form"
    >
      <div class="message-container">
        <InfoMessage
          message="Enter email used for registration"
        />
      </div>
      <div class="message-container">
        <ErrorMessage
          v-if="errorMessage"
          :message="errorMessage"
        />
      </div>
      <ButtonText
        text="send validation code"
        style-type="bordered"
        :disabled="isRequestProcessing"
        @click="requestResetPassword"
      />
    </div>
    <div
      v-else
      class="input-form"
    >
      <div class="message-container">
        <InfoMessage
          :message="infoMessage"
        />
      </div>
      <ButtonText
        class="resend-code-button"
        text="resend code"
        style-type="underline"
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
      <div class="message-container">
        <ErrorMessage
          v-if="errorMessage"
          :message="errorMessage"
        />
      </div>
      <ButtonText
        text="reset password"
        style-type="bordered"
        :disabled="isRequestProcessing"
        @click="resetPassword"
      />
    </div>
  </div>
</template>

<style lang="scss">
.password-reset {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 250px;

  .input-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .resend-code-button {
    font-size: 12px;
    color: map-get($colors, 'gray-light');
  }

  .validation-code {
    padding-top: 10px;
  }

  .message-container {
    width: 100%;
    height: 30px;
    text-align: center;
  }
}
</style>
