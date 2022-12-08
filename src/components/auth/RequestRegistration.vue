<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import { mapActions } from 'vuex';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    InputCustom,
    ButtonText,
    ErrorMessage,
    CustomLink,
  },
  data: () => ({
    email: '',
    username: '',
    requestHandling: {
      isRequestProcessing: false,
      errorMessage: '',
    },
  }),
  methods: {
    ...mapActions('auth', [
      '_requestRegistration',
    ]),
    clearMessage() {
      this.requestHandling.errorMessage = '';
    },
    requestRegistration() {
      this.clearMessage();
      this.requestHandling.isRequestProcessing = true;

      const request = this._requestRegistration({
        email: this.email,
        username: this.username,
      });

      handleRequestStatuses(request, this.requestHandling);
    },
  },
};
</script>

<template>
  <form
    class="request-registration"
    @submit.prevent="requestRegistration"
  >
    <InputCustom
      v-model.trim="email"
      label="e-mail"
      type="email"
      required
      :disabled="requestHandling.isRequestProcessing"
      @input="clearMessage"
    />
    <InputCustom
      v-model.trim="username"
      label="username"
      required
      :disabled="requestHandling.isRequestProcessing"
      @input="clearMessage"
    />
    <div class="error-container">
      <ErrorMessage
        v-if="requestHandling.errorMessage"
        :message="requestHandling.errorMessage"
      />
    </div>
    <ButtonText
      text="send validation code"
      type="submit"
      style-type="bordered"
      :disabled="requestHandling.isRequestProcessing"
    />
    <div class="sign-in-option">
      have an account?
      <CustomLink
        :to="{ name: 'signIn' }"
        title="sign in"
      />
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
