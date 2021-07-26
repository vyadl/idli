<template>
  <form
    class="registration-form"
    @submit.prevent="register(user)"
  >
    <InputCustom
      label="username"
      required
      v-model="user.username"
      @input="clearMessage"
    />
    <InputCustom
      label="e-mail"
      type="email"
      required
      v-model="user.email"
      @input="clearMessage"
    />
    <InputCustom
      label="password"
      type="password"
      required
      v-model="user.password"
    />
    <InputCustom
      label="confirm password"
      type="password"
      required
      v-model="passwordToCheck"
    />
    <div class="message-container">
      <ErrorMessage
        :message="errorMessage"
        v-if="errorMessage.length"
      />
    </div>
    <ButtonText
      style-type="bordered"
      type="submit"
      text="register"
      :disabled="isButtonDisabled"
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
    isButtonDisabled: false,
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
        this.isButtonDisabled = true;
        this.clearMessage();
        this._register(user)
          .then()
          .catch(error => { this.errorMessage = error.response.data.message; })
          .finally(() => { this.isButtonDisabled = false; });
      } else {
        this.errorMessage = 'wrong password';
      }
    },
    clearMessage() {
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
  }
</style>
