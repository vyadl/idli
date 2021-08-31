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
        :model-value="isItemFormInSidebar"
        name="isItemFormInSidebar"
        @change="_switchItemFormLocation"
      />
      <CheckboxCustom
        label="focus on list"
        style-type="classic"
        :value="false"
        :model-value="isFocusOnList"
        name="isFocusOnList"
        @change="_switchFocusMode"
      />
      <CheckboxCustom
        label="sidebar overlaps the list"
        style-type="classic"
        :value="true"
        :model-value="isListUnderSidebar"
        name="isListUnderSidebar"
        @change="_switchSidebarAndListIntersection"
      />
    </div>
    <UserProfile />
    <div class="about">
      <ButtonText
        style-type="underline"
        @click="$modal.show('aboutModal')"
        text="about idli"
      />
    </div>
    <AboutModal />
  </SidebarCard>
</template>

<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import UserProfile from '@/components/sidebarContent/UserProfile.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import AboutModal from '@/components/modals/AboutModal.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    UserProfile,
    CheckboxCustom,
    AboutModal,
    ButtonText,
  },
  computed: {
    ...mapGetters({
      isItemFormInSidebar: 'isItemFormInSidebar',
      isFocusOnList: 'isFocusOnList',
      isListUnderSidebar: 'isListUnderSidebar',
    }),
  },
  methods: {
    ...mapActions({
      _switchItemFormLocation: '_switchItemFormLocation',
      _switchFocusMode: '_switchFocusMode',
      _switchSidebarAndListIntersection: '_switchSidebarAndListIntersection',
    }),
  },
};
</script>

<style lang="scss">
  .app-settings {
    .options-container {
      margin-bottom: 100px;
    }
    .about {
      padding-top: 70px;
      text-align: center;
    }
  }
</style>
