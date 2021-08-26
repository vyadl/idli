<template>
  <SidebarCard
    class="app-settings"
    title="settings"
  >
    <div class="options-container">
      <CheckboxCustom
        label="create and edit items inside the sidebar"
        style-type="classic"
        :value="false"
        :model-value="settings.isItemFormInSidebar"
        name="isItemFormInSidebar"
        @change="_switchItemFormLocation"
      />
    </div>
    <UserProfile />
  </SidebarCard>
</template>

<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import UserProfile from '@/components/sidebarContent/UserProfile.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    UserProfile,
    CheckboxCustom,
  },
  computed: {
    ...mapGetters({
      settings: 'settings',
    }),
  },
  methods: {
    ...mapActions({
      _switchItemFormLocation: '_switchItemFormLocation',
    }),
  },
};
</script>

<style lang="scss">
  .app-settings {
    .options-container {
      margin-bottom: 100px;
    }
  }
</style>
