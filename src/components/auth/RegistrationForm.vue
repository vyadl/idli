<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import PasswordField from '@/components/auth/PasswordField.vue';
import { mapGetters, mapActions } from 'vuex';
import { handleQueryOnLoad } from '@/router/utils';
import { handleErrorAndRequestStatus } from '@/utils/misc';

export default {
  components: {
    InputCustom,
    ButtonText,
    ErrorMessage,
    InfoMessage,
    PasswordField,
  },
  data: () => ({
    user: {
      email: '',
      username: '',
      password: '',
      validationCode: '',
    },
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
      username: {
        callback: username => {
          this.user.username = username;
        },
      },
      email: {
        callback: email => {
          this.user.email = email;
        },
      },
    };
    
    handleQueryOnLoad(queryOptions, this.$route.query);
  },
  methods: {
    ...mapActions('auth', [
      '_requestRegistration',
      '_signUp',
    ]),
    clearMessage() {
      this.requestHandling.errorMessage = '';
    },
    requestRegistration() {
      this.clearMessage();
      this.requestHandling.isRequestProcessing = true;
      
      const request = this._requestRegistration({
        email: this.user.email,
        username: this.user.username,
      });

      handleErrorAndRequestStatus(request, this.requestHandling);
    },
    signUp() {
      if (this.user.password === this.passwordToCheck) {
        this.clearMessage();
        this.requestHandling.isRequestProcessing = true;

        const request = this._signUp(this.user);

        handleErrorAndRequestStatus(request, this.requestHandling);
      } else {
        this.requestHandling.errorMessage = 'passwords don\'t match';
      }
    },
  },
};
</script>

<template>
  <form
    class="registration-form"
    @submit.prevent="signUp"
  >
    <InputCustom
      v-model="user.email"
      label="e-mail"
      type="email"
      required
      disabled
      @input="clearMessage"
    />
    <InputCustom
      v-model="user.username"
      label="username"
      required
      :disabled="requestHandling.isRequestProcessing"
      @input="clearMessage"
    />
    <PasswordField
      v-model="user.password"
      @input="clearMessage"
    />
    <PasswordField
      v-model="passwordToCheck"
      label="confirm password"
      @input="clearMessage"
    />
    <div class="info-container">
      <InfoMessage
        :message="infoMessage"
      />
      <ButtonText
        text="resend code"
        style-type="underline"
        size="smallest"
        @click="requestRegistration"
      />
    </div>
    <InputCustom
      v-model="user.validationCode"
      class="validation-code"
      label="validation code"
      required
      @input="clearMessage"
    />
    <div class="error-container">
      <ErrorMessage
        v-if="requestHandling.errorMessage"
        :message="requestHandling.errorMessage"
      />
    </div>
    <ButtonText
      text="sign up"
      style-type="bordered"
      type="submit"
      :disabled="requestHandling.isRequestProcessing"
    />
    <div class="sign-in-option">
      have an account?
      <router-link :to="{ name: 'signIn' }">
        sign in
      </router-link>
    </div>
  </form>
</template>

<style lang="scss">
  .registration-form {
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .info-container,
    .error-container {
      width: 100%;
    }

    .info-container {
      text-align: center;
    }

    .error-container {
      height: 30px;
      margin-bottom: 10px;
    }

    .validation-code {
      padding-top: 10px;
    }

    .sign-in-option {
      padding-top: 50px;
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }
  }
</style>
