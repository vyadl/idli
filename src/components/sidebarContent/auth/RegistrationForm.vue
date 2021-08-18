<template>
  <form
    class="registration-form"
    @submit.prevent="signUp(user)"
  >
    <InputCustom
      label="username"
      v-model="user.username"
      required
      @input="clearMessage"
    />
    <InputCustom
      label="e-mail"
      type="email"
      v-model="user.email"
      required
      @input="clearMessage"
    />
    <InputCustom
      label="password"
      type="password"
      v-model="user.password"
      required
    />
    <InputCustom
      label="confirm password"
      type="password"
      v-model="passwordToCheck"
      required
    />
    <div class="message-container">
      <ErrorMessage
        v-if="errorMessage"
        :message="errorMessage"
      />
    </div>
    <ButtonText
      text="sign up"
      style-type="bordered"
      type="submit"
      :disabled="isRequestProcessing"
    />
  </form>
</template>

<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
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
    isRequestProcessing: false,
    errorMessage: '',
  }),
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
        this.isRequestProcessing = true;
        this._signUp(user)
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
