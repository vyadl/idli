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
      :disabled="requestStatus === 'processing'"
    />
  </form>
</template>

<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/formElements/ErrorMessage.vue';
import { mapGetters, mapActions } from 'vuex';

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
    errorMessage: '',
  }),
  computed: {
    ...mapGetters({
      requestStatus: 'auth/requestStatus',
    }),
  },
  methods: {
    ...mapActions({
      _register: 'auth/_register',
    }),
    confirmPassword() {
      return this.user.password === this.passwordToCheck;
    },
    clearMessage() {
      this.errorMessage = '';
    },
    register(user) {
      if (this.confirmPassword()) {
        this.clearMessage();
        this._register(user)
          .catch(error => { this.errorMessage = error.response.data.message; });
      } else {
        this.errorMessage = 'wrong password';
      }
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
