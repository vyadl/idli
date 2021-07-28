<template>
  <SidebarCard title="your profile">
    <div class="user-profile">
      <div class="username">{{ username }}</div>
      <ButtonText
        style-type="bordered"
        text="sign out"
        @click="_signOut"
      />
    </div>
  </SidebarCard>
</template>

<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    ButtonText,
  },
  computed: {
    ...mapGetters({
      username: 'auth/username',
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

    .username {
      margin-bottom: 20px;
    }
  }
</style>
