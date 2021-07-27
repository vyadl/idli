<template>
  <SettingsCard title="your profile">
    <div class="user-profile">
      <div class="username">{{ username }}</div>
      <ButtonText
        style-type="bordered"
        text="sign out"
        @click="_logOut"
      />
    </div>
  </SettingsCard>
</template>

<script>
import SettingsCard from '@/components/settings/SettingsCard.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SettingsCard,
    ButtonText,
  },
  computed: {
    ...mapGetters({
      username: 'auth/username',
    }),
  },
  methods: {
    ...mapActions({
      _logOut: 'auth/_logOut',
    }),
  },
};
</script>

<style lang="scss">
  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .username {
      margin-bottom: 20px;
    }
  }
</style>
