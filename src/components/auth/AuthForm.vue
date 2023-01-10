<script>
import { mapActions } from 'vuex';
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import PasswordField from '@/components/auth/PasswordField.vue';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    InputCustom,
    PasswordField,
    ButtonText,
    ErrorMessage,
    CustomLink,
  },
  data: () => ({
    user: '',
    password: '',
    requestHandling: {
      isRequestProcessing: false,
      errorMessage: '',
    },
  }),
  methods: {
    ...mapActions('auth', [
      '_signIn',
    ]),
    clearMessage() {
      this.requestHandling.errorMessage = '';
    },
    signIn() {
      const credentials = {};
      const signInOption = this.user.includes('@') ? 'email' : 'username';

      credentials[signInOption] = this.user;
      credentials.password = this.password;

      this.requestHandling.isRequestProcessing = true;

      const request = this._signIn(credentials);

      handleRequestStatuses(request, this.requestHandling);
    },
  },
};
</script>

<template>
  <form
    class="auth-form"
    @submit.prevent="signIn"
  >
    <InputCustom
      v-model.trim="user"
      label="username or e-mail"
      required
      @input="clearMessage"
    />
    <PasswordField
      v-model="password"
      @input="clearMessage"
    />
    <div class="message-container">
      <ErrorMessage 
        v-if="requestHandling.errorMessage"
        :message="requestHandling.errorMessage" 
      />
    </div>
    <ButtonText
      text="sign in"
      style-type="bordered"
      type="submit"
      :disabled="requestHandling.isRequestProcessing"
    />
    <div class="reset-password-link">
      <CustomLink
        :to="{ name: 'requestResetPassword' }"
        title="Forgot password?"
      />
    </div>
    <div class="sign-up-option">
      new to IDLI?
      <CustomLink
        :to="{ name: 'requestRegistration' }"
        title="sign up"
      />
    </div>
  </form>
</template>

<style lang="scss">
  .auth-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 250px;

    .message-container,
    .reset-password-link {
      width: 100%;
      height: 20px;
      padding-bottom: 35px;
    }

    .reset-password-link {
      display: flex;
      justify-content: center;
      padding-top: 40px;
    }

    .sign-up-option,
    .reset-password-link {
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }
  }
</style>
