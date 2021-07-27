<template>
  <form
    class="auth-form"
    @submit.prevent="signIn(signInData)"
  >
    <InputCustom
      label="username"
      required
      v-model="signInData.username"
      @input="clearMessage"
    />
    <InputCustom
      label="password"
      type="password"
      required
      v-model="signInData.password"
      @input="clearMessage"
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
      text="sign in"
      :disabled="isRequestProcessing"
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
    signInData: {
      username: '',
      password: '',
    },
    errorMessage: '',
  }),
  computed: {
    ...mapGetters({
      isRequestProcessing: 'auth/isRequestProcessing',
    }),
  },
  methods: {
    ...mapActions({
      _signIn: 'auth/_signIn',
    }),
    clearMessage() {
      this.errorMessage = '';
    },
    signIn(signInData) {
      this._signIn(signInData)
        .catch(error => { this.errorMessage = error.response.data.message; });
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
