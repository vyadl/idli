<script>
import { mapActions } from 'vuex';
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import PasswordField from '@/components/sidebarContent/auth/PasswordField.vue';

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
    signIn(signInData) {
      this.isRequestProcessing = true;
      this._signIn(signInData)
        .catch(error => {
          this.errorMessage = error.response.data.message;
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
  </form>
</template>

<style lang="scss">
  .auth-form {
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
