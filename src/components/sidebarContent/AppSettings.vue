<template>
  <SidebarCard
    class="app-settings"
    title="settings"
  >
    <CheckboxCustom
      label="create and edit items inside the sidebar"
      style-type="classic"
      :value="false"
      :model-value="settings.isItemFormInSidebar"
      name="isItemFormInSidebar"
      @change="_switchItemFormLocation"
    />
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
  data: () => ({
  }),
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
