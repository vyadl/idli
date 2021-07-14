<template>
  <form
    class="registration-form"
    @submit.prevent="register(user)"
  >
    <InputCustom
      label="username"
      v-model="user.username"
      :required="true"
      @input="clearMessage"
    />
    <InputCustom
      label="e-mail"
      type="email"
      v-model="user.email"
      :required="true"
      @input="clearMessage"
    />
    <InputCustom
      label="password"
      type="password"
      v-model="user.password"
      :required="true"
    />
    <InputCustom
      label="repeat password"
      type="password"
      v-model="passwordToCheck"
      :required="true"
    />
    <div class="message-container">
      <div
        class="response-message"
        v-if="responseMessage.length"
      >
        {{ responseMessage }}
      </div>
      <div
        class="error-message"
        v-if="errorMessage.length"
      >
        {{ errorMessage }}
      </div>
      <div
        class="error-message"
        v-if="arePasswordsEntered && !isPasswordConfirmed"
      >
        wrong password
      </div>
    </div>
    <ButtonText
      style-type="bordered"
      type="submit"
      text="register"
      :disabled="arePasswordsEntered && !isPasswordConfirmed"
    />
  </form>
</template>

<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    InputCustom,
    ButtonText,
  },
  data: () => ({
    user: {
      username: '',
      email: '',
      password: '',
    },
    passwordToCheck: '',
    responseMessage: '',
    errorMessage: '',
  }),
  computed: {
    arePasswordsEntered() {
      return Boolean(this.user.password.length && this.passwordToCheck.length);
    },
    isPasswordConfirmed() {
      return this.user.password === this.passwordToCheck;
    },
  },
  methods: {
    ...mapActions({
      _register: 'auth/_register',
    }),
    register(user) {
      this.clearMessage();
      this._register(user)
        .then(response => { this.responseMessage = response.data.message; })
        .catch(error => { this.errorMessage = error.response.data.message; });
    },
    clearMessage() {
      this.responseMessage = '';
      this.errorMessage = '';
    },
  },
};
</script>

<style lang="scss">
  .registration-form {
    display: flex;
    flex-direction: column;
    align-items: center;

    .message-container {
      width: 100%;
      height: 30px;
      margin-bottom: 10px;
    }

    .error-message,
    .response-message {
      width: 100%;
      padding: 8px;;
      font-size: 10px;
    }

    .error-message {
      background-color: rgb(236, 204, 204);
      color: rgb(245, 99, 99);
    }

    .response-message {
      background-color: rgb(211, 248, 200);
      color: rgb(58, 136, 51);
    }
  }
</style>
