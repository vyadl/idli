<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import { mapGetters, mapActions } from 'vuex';
import { logoutOptions } from '@/store/config';

export default {
  components: {
    ButtonText,
    SectionCard,
  },
  computed: {
    ...mapGetters('auth', [
      'user',
      'isLoggedIn',
    ]),
    logoutOptions() {
      return logoutOptions;
    },
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
          class="profile-button"
          text="change password"
          style-type="underline"
          @click="openPasswordChangeModal"
        />
        <SectionCard
          title="logout options"
          size="small"
          text-style="caps"
        >
          <div class="logout-options">
            <ButtonText
              v-for="option in logoutOptions"
              :key="option.mode"
              :text="option.title"
              class="profile-button"
              style-type="underline"
              size="smallest"
              @click="logOut(option.mode)"
            />
          </div>
        </SectionCard>
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

    .profile-button {
      width: fit-content;
    }

    .auth-options {
      margin: 0 auto;
      font-size: 12px;
      text-align: center;
    }

    .logout-options {
      display: grid;
    }

    .info-field {
      padding: 5px 0;
    }
  }
</style>
