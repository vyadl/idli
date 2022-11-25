<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ButtonText,
  },
  computed: {
    ...mapGetters('auth', [
      'user',
      'isLoggedIn',
    ]),
  },
  methods: {
    ...mapActions('auth', [
      '_logOut',
    ]),
    openPasswordChangeModal() {
      this.$vfm.show('passwordChangeModal');
    },
    logOut(mode) {
      this._logOut({ mode });
    },
  },
};
</script>

<template>
  <div class="user-profile">
    <div v-if="isLoggedIn">
      <div class="info-field">
        username:  {{ user.username }}
      </div>
      <div class="info-field">
        e-mail:  {{ user.email }}
      </div>
      <div class="profile-options">
        <ButtonText
          text="change password"
          style-type="underline"
          @click="openPasswordChangeModal"
        />
        <ButtonText
          text="log out"
          style-type="underline"
          @click="logOut('current')"
        />
        <ButtonText
          text="log out from all devices"
          style-type="underline"
          @click="logOut('all')"
        />
        <ButtonText
          text="log out from all devices except current"
          style-type="underline"
          @click="logOut('allExceptCurrent')"
        />
      </div>
    </div>
    <div 
      v-else
      class="auth-options"
    >
      <span>you are not authorized.</span>
      <div>
        <router-link
          :to="{ name: 'signUp' }"
          target="_blank"
        >
          sign up
        </router-link>
        or
        <router-link
          :to="{ name: 'signIn' }"
          target="_blank"
        >
          sign in
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .user-profile {
    .profile-options {
      display: flex;
      flex-direction: column;
    }

    .auth-options {
      margin: 0 auto;
      font-size: 12px;
      text-align: center;
    }

    .info-field {
      padding: 5px 0;
    }
  }
</style>
