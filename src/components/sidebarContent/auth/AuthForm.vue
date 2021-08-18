<template>
  <form
    class="auth-form"
    @submit.prevent="signIn(signInData)"
  >
    <InputCustom
      label="username"
      v-model="signInData.username"
      required
      @input="clearMessage"
    />
    <InputCustom
      label="password"
      type="password"
      v-model="signInData.password"
      required
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
    signInData: {
      username: '',
      password: '',
    },
    isRequestProcessing: false,
    errorMessage: '',
  }),
  methods: {
    ...mapActions({
      _signIn: 'auth/_signIn',
    }),
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
