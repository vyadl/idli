<script>
import { mapActions } from 'vuex';
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import PasswordField from '@/components/auth/PasswordField.vue';

export default {
  components: {
    InputCustom,
    PasswordField,
    ButtonText,
    ErrorMessage,
  },
  data: () => ({
    signInData: {
      username: '',
      password: '',
    },
    isRequestProcessing: false,
    errorMessage: '',
  }),
  methods: {
    ...mapActions('auth', [
      '_signIn',
    ]),
    clearMessage() {
      this.errorMessage = '';
    },
    signIn() {
      this.isRequestProcessing = true;
      this._signIn({
        username: this.signInData.username,
        password: this.signInData.password,
      })
        .catch(error => {
          this.errorMessage = error.response?.data?.message;
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
    class="auth-form"
    @submit.prevent="signIn(signInData)"
  >
    <div class="input-fields">
      <InputCustom
        v-model="signInData.username"
        label="username"
        required
        @input="clearMessage"
      />
      <PasswordField
        v-model="signInData.password"
        @input="clearMessage"
      />
    </div>
    <div class="message-container">
      <ErrorMessage 
        v-if="errorMessage"
        :message="errorMessage" 
      />
    </div>
    <ButtonText
      text="sign in"
      style-type="bordered"
      type="submit"
      :disabled="isRequestProcessing"
    />
    <div class="reset-password-link">
      <div v-if="errorMessage">
        <router-link :to="{ name: 'requestResetPassword' }">
          Forgot password?
        </router-link>
      </div>
    </div>
    <div class="sign-up-option">
      new to IDLI?
      <router-link :to="{ name: 'requestRegistration' }">
        sign up
      </router-link>
    </div>
  </form>
</template>

<style lang="scss">
  .auth-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    width: 250px;

    .input-fields {
      width: 100%;
    }

    .message-container,
    .reset-password-link {
      width: 100%;
      height: 20px;
      padding-bottom: 40px;
    }

    .reset-password-link {
      display: flex;
      justify-content: center;
      padding-top: 20px;
    }

    .sign-up-option,
    .reset-password-link {
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }
  }
</style>
