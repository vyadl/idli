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
    ...mapGetters([
      'isItemFormInSidebar',
      'isFocusOnList',
      'isListUnderSidebar',
      'isUsingHotkeys',
    ]),
  },
  methods: {
    ...mapActions([
      '_switchItemFormLocation',
      '_switchFocusMode',
      '_switchSidebarAndListIntersection',
      '_switchUsingHotkeys',
    ]),
  },
};
</script>

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
      <CheckboxCustom
        label="using hotkeys"
        style-type="classic"
        :value="true"
        :model-value="isUsingHotkeys"
        name="isUsingHotkeys"
        @change="_switchUsingHotkeys"
      />

      <div class="hotkeys-desc">
        ESC - exit focus mode/hide modal <br>
        <template v-if="isUsingHotkeys">
        I — new item <br>
        L — new list <br>
        E — edit current list <br>
        R — randomize list <br>
        F — switch focus mode <br>
        S — show/hide sidebar
        </template>
      </div>
    </div>
    <UserProfile />
    <div class="about">
      <ButtonText
        style-type="underline"
        @click="$vfm.show('aboutModal')"
        text="about idli"
      />
    </div>
    <AboutModal />
  </SidebarCard>
</template>

<style lang="scss">
  .app-settings {
    .options-container {
      margin-bottom: 100px;
    }
    .about {
      padding-top: 70px;
      text-align: center;
    }
    .hotkeys-desc {
      font-family: 'Courier';
      padding-left: 30px;
      font-size: 12px;
      color: map-get($colors, 'gray-dark');
    }
  }
</style>
