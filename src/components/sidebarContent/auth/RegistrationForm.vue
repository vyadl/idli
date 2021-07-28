<template>
  <form
    class="registration-form"
    @submit.prevent="signUp(user)"
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
      text="sign up"
      :disabled="isRequestProcessing"
    />
  </form>
</template>

<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
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
      isRequestProcessing: 'auth/isRequestProcessing',
    }),
  },
  methods: {
    ...mapActions({
      _signUp: 'auth/_signUp',
    }),
    clearMessage() {
      this.errorMessage = '';
    },
    signUp(user) {
      if (this.user.password === this.passwordToCheck) {
        this.clearMessage();
        this._signUp(user)
          .catch(error => { this.errorMessage = error.response.data.message; });
      } else {
        this.errorMessage = 'passwords don`t match';
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
