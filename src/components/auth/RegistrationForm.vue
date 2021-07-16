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
      label="confirm password"
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
      <ErrorMessage
        :message="errorMessage"
        v-if="errorMessage.length"
      />
    </div>
    <ButtonText
      style-type="bordered"
      type="submit"
      text="register"
    />
  </form>
</template>

<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/formElements/ErrorMessage.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    InputCustom,
    ButtonText,
    ErrorMessage,
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
  methods: {
    ...mapActions({
      _register: 'auth/_register',
    }),
    confirmPassword() {
      return this.user.password === this.passwordToCheck;
    },
    register(user) {
      if (this.confirmPassword()) {
        this.clearMessage();
        this._register(user)
          .then(response => { this.responseMessage = response.data.message; })
          .catch(error => { this.errorMessage = error.response.data.message; });
      } else {
        this.errorMessage = 'wrong password';
      }
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

    .response-message {
      width: 100%;
      padding: 8px;
      font-size: 10px;
      background-color: rgb(211, 248, 200);
      color: rgb(58, 136, 51);
    }
  }
</style>
