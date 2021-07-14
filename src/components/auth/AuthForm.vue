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
      v-model="logInData.username"
      :required="true"
      @input="clearMessage"
    />
    <InputCustom
      label="password"
      type="password"
      v-model="logInData.password"
      :required="true"
      @input="clearMessage"
    />
    <div class="message-container">
      <div
        class="message"
        v-if="errorMessage.length"
      >
        {{ errorMessage }}
      </div>
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
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    InputCustom,
    ButtonText,
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

    .message {
      width: 100%;
      padding: 8px;
      background-color: rgb(236, 204, 204);
      color: rgb(245, 99, 99);
      font-size: 10px;
    }
  }
</style>
