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
    email: '',
    username: '',
    isRequestProcessing: false,
    errorMessage: '',
  }),
  methods: {
    ...mapActions('auth', [
      '_requestRegistration',
    ]),
    clearMessage() {
      this.errorMessage = '';
    },
    requestRegistration() {
      this.clearMessage();
      this.isRequestProcessing = true;
      this._requestRegistration({
        email: this.email,
        username: this.username,
      })
        .catch(errorMessage => {
          this.errorMessage = errorMessage;
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
    class="request-registration"
    @submit.prevent="requestRegistration()"
  >
    <InputCustom
      v-model="email"
      label="e-mail"
      type="email"
      required
      :disabled="isRequestProcessing"
      @input="clearMessage"
    />
    <InputCustom
      v-model="username"
      label="username"
      required
      :disabled="isRequestProcessing"
      @input="clearMessage"
    />
    <div class="error-container">
      <ErrorMessage
        v-if="errorMessage"
        :message="errorMessage"
      />
    </div>
    <ButtonText
      text="send validation code"
      type="submit"
      style-type="bordered"
      :disabled="isRequestProcessing"
    />
    <div class="sign-in-option">
      have an account?
      <router-link :to="{ name: 'signIn' }">
        sign in
      </router-link>
    </div>
  </form>
</template>

<style lang="scss">
  .request-registration {
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .error-container {
      width: 100%;
      height: 30px;
      margin-bottom: 10px;
    }

    .sign-in-option {
      text-align: center;
      padding-top: 50px;
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }
  }
</style>
