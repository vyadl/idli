<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import PasswordField from '@/components/auth/PasswordField.vue';
import { mapActions } from 'vuex';
// eslint-disable-next-line import/no-cycle
import { handleQueryOnLoad } from '@/router/utils';

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
      this.errorMessage = '';
    },
    requestRegistration() {
      this.clearMessage();
      this.isRequestProcessing = true;
      this._requestRegistration({
        email: this.user.email,
        username: this.user.username,
      })
        .catch(error => {
          console.log(error);
          this.errorMessage = error.response.data.message;
        })
        .finally(() => {
          this.isRequestProcessing = false;
        });
    },
    signUp() {
      if (this.user.password === this.passwordToCheck) {
        this.clearMessage();
        this.isRequestProcessing = true;
        this._signUp(this.user)
          .catch(error => {
            console.log(error);
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
  <form
    class="registration-form"
    @submit.prevent="signUp()"
  >
    <InputCustom
      v-model="user.email"
      label="e-mail"
      type="email"
      required
      :disabled="$route.name === 'signUp'"
      @input="clearMessage"
    />
    <InputCustom
      v-model="user.username"
      label="username"
      required
      @input="clearMessage"
    />
    <div v-if="$route.name === 'requestRegistration'">
      <div class="error-container">
        <ErrorMessage
          v-if="errorMessage"
          :message="errorMessage"
        />
      </div>
      <div class="single-button-container">
        <ButtonText
          text="send validation code"
          style-type="bordered"
          :disabled="!user.username || !user.email"
          @click="requestRegistration"
        />
      </div>
    </div>
    <div v-else>
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
          class="resend-code-button"
          text="resend code"
          style-type="underline"
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
          v-if="errorMessage"
          :message="errorMessage"
        />
      </div>
      <div class="single-button-container">
        <ButtonText
          text="sign up"
          style-type="bordered"
          type="submit"
          :disabled="isRequestProcessing"
        />
      </div>
    </div>
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
    margin: 0 auto;
    width: 250px;

    .info-container {
      text-align: center;
    }

    .error-container {
      height: 30px;
      margin-bottom: 10px;
    }

    .resend-code-button {
      font-size: 12px;
      color: map-get($colors, 'gray-light');
    }

    .single-button-container {
      display: flex;
      justify-content: center;
    }

    .validation-code {
      padding-top: 10px;
    }

    .sign-in-option {
      text-align: center;
      padding-top: 50px;
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }
  }
</style>
