<template>
  <div v-if="username">
    <div>
      {{ username }}
    </div>
    <ButtonText
      text="log out"
      @click="logOut"
    />
  </div>
  <form
    v-else
    class="auth-form"
    @submit.prevent="logIn(logInData)"
  >
    <InputCustom
      label="username"
      required
      v-model="logInData.username"
      @input="clearMessage"
    />
    <InputCustom
      label="password"
      type="password"
      required
      v-model="logInData.password"
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
      text="log in"
    />
  </form>
</template>

<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/formElements/ErrorMessage.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    InputCustom,
    ButtonText,
    ErrorMessage,
  },
  data: () => ({
    logInData: {
      username: '',
      password: '',
    },
    user: '',
    errorMessage: '',
  }),
  computed: {
    ...mapGetters({
      username: 'auth/username',
    }),
  },
  methods: {
    ...mapActions({
      _logIn: 'auth/_logIn',
      _logOut: 'auth/_logOut',
    }),
    logIn(logInData) {
      this._logIn(logInData)
        .then(response => {
          this.user = response.data;
        })
        .catch(error => { this.errorMessage = error.response.data.message; });
    },
    logOut() {
      this._logOut();
      this.user = '';
    },
    clearMessage() {
      this.errorMessage = '';
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
