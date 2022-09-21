<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import UserProfile from '@/components/sidebarContent/settings/UserProfile.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import AboutModal from '@/components/modals/AboutModal.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    UserProfile,
    CheckboxCustom,
    RadioCustom,
    AboutModal,
    ButtonText,
  },
  data() {
    return {
      themeTitles: ['default', 'inverted'],
    };
  },
  computed: {
    ...mapGetters('auth', [
      'isLoggedIn',
    ]),
    ...mapGetters([
      'isItemFormInSidebar',
      'isFocusOnList',
      'isListUnderSidebar',
      'isUsingHotkeys',
      'theme',
      'isUserOwnsCurrentList',
      'isPublicView',
    ]),
    actionsWithItems() {
      return this.isUserOwnsCurrentList && !this.isPublicView 
        ? 'create and edit' 
        : 'view';
    },
  },
  methods: {
    ...mapActions([
      '_switchItemFormLocation',
      '_toggleFocusMode',
      '_switchSidebarAndListIntersection',
      '_switchUsingHotkeys',
      '_setTheme',
    ]),
  },
};
</script>

<template>
  <SidebarCard
    class="sidebar-settings"
    title="settings"
  >
    <div class="options-container">
      <CheckboxCustom
        :label="`${actionsWithItems} items inside the sidebar`"
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
        @change="_toggleFocusMode"
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
        I — new item 
        <span v-if="!isUserOwnsCurrentList || isPublicView">
          (not available now)
        </span> <br>
        E — edit current list 
        <span v-if="!isUserOwnsCurrentList || isPublicView">
          (not available now)
        </span> <br>
        L — new list
        <span v-if="!isLoggedIn">
          (not available now)
        </span> <br>
        R — randomize list
        <span v-if="!isLoggedIn && $route.name === 'item'">
          (not available now)
        </span> <br>
        F — switch focus mode <br>
        S — show/hide sidebar
        </template>
      </div>
    </div>
    <SidebarCard title="theme">
      <div class="buttons-container">
        <RadioCustom
          class="theme"
          v-for="title in themeTitles"
          :key="title"
          :label="title"
          :value="title"
          :model-value="theme"
          name="theme"
          @change="_setTheme(title)"
        />
      </div>
    </SidebarCard>
    <SidebarCard 
      v-if="!isPublicView"
      title="your profile"
    >
      <UserProfile />
    </SidebarCard>
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
  .sidebar-settings {
    .options-container {
      margin-bottom: 20px;
    }
    .buttons-container {
      display: flex;
      justify-content: center;
      margin-bottom: 50px;
    }
    .about {
      padding-top: 50px;
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
