<template>
  <div class="user-profile">
    <h1 class="profile-title">your profile</h1>
    <div class="user-info">
      <div class="info-field">
        username:  {{ user.username }}
      </div>
      <div class="info-field">
        e-mail:  {{ user.email }}
      </div>
    </div>
    <ButtonText
      text="sign out"
      style-type="underline"
      @click="_signOut"
    />
  </div>
</template>

<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ButtonText,
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
  },
  methods: {
    ...mapActions({
      _signOut: 'auth/_signOut',
    }),
  },
};
</script>

<style lang="scss">
  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .profile-title {
      width: 100%;
      margin-bottom: 15px;
      text-align: center;
    }

    .user-info {
      margin-bottom: 15px;
    }

    .info-field {
      padding: 5px 0;
    }
  }
</style>
