<script>
import SectionCard from '@/components/wrappers/SectionCard.vue';
import UserProfile from '@/components/sidebarContent/settings/UserProfile.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import AboutModal from '@/components/modals/AboutModal.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SectionCard,
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
    ...mapGetters('lists', [
      'isPublicView',
      'isOwnerView',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
      'isFocusOnList',
      'isListUnderSidebar',
      'isUsingHotkeys',
      'theme',
    ]),
    ...mapGetters('sidebar', [
      'itemPublicView', 
    ]),
    sidebarActionsWithItems() {
      return this.isOwnerView
        ? 'create and edit items inside the sidebar' 
        : 'view items inside the sidebar';
    },
    letterHotkeys() {
      return {
        I: {
          desription: 'I — new item ',
          notAvailable: !this.isOwnerView,
        },
        E: {
          desription: 'E — edit current list',
          notAvailable: !this.isOwnerView,
        },
        L: {
          desription: 'L — new list',
          notAvailable: !this.isLoggedIn,
        },
        R: {
          desription: 'R — randomize list',
          notAvailable: this.itemPublicView,
        },
        F: {
          desription: 'F — switch focus mode',
        },
        S: {
          desription: 'S — show/hide sidebar',
        },
      };
    },
  },
  methods: {
    ...mapActions('settings', [
      '_toggleItemFormLocation',
      '_toggleFocusMode',
      '_toggleSidebarAndListIntersection',
      '_toggleUsingHotkeys',
      '_setTheme',
    ]),
  },
};
</script>

<template>
  <SectionCard
    class="sidebar-settings"
    title="settings"
  >
    <div class="options-container">
      <CheckboxCustom
        :label="sidebarActionsWithItems"
        style-type="initial"
        :value="false"
        :model-value="isItemFormInSidebar"
        name="isItemFormInSidebar"
        @change="_toggleItemFormLocation"
      />
      <CheckboxCustom
        label="focus on list"
        style-type="initial"
        :value="false"
        :model-value="isFocusOnList"
        name="isFocusOnList"
        @change="_toggleFocusMode"
      />
      <CheckboxCustom
        label="sidebar overlaps the list"
        style-type="initial"
        :value="true"
        :model-value="isListUnderSidebar"
        name="isListUnderSidebar"
        @change="_toggleSidebarAndListIntersection"
      />
      <CheckboxCustom
        label="using hotkeys"
        style-type="initial"
        :value="true"
        :model-value="isUsingHotkeys"
        name="isUsingHotkeys"
        @change="_toggleUsingHotkeys"
      />
      <div class="hotkeys-desc">
        ESC - exit focus mode/hide modal <br>
        <template v-if="isUsingHotkeys">
          <div 
            v-for="hotkey in letterHotkeys"
            :key="hotkey"
          >
            {{ hotkey.desription }}
            <span v-show="hotkey.notAvailable">
              (not available now)
            </span>
          </div>
        </template>
      </div>
    </div>
    <SectionCard title="theme">
      <div class="buttons-container">
        <RadioCustom
          v-for="title in themeTitles"
          :key="title"
          class="theme"
          :label="title"
          :value="title"
          :model-value="theme"
          name="theme"
          @change="_setTheme(title)"
        />
      </div>
    </SectionCard>
    <SectionCard
      v-if="!isPublicView"
      title="your profile"
    >
      <UserProfile />
    </SectionCard>
    <div class="about">
      <ButtonText
        text="about idli"
        style-type="underline"
        @click="$vfm.show('aboutModal')"
      />
    </div>
    <AboutModal />
  </SectionCard>
</template>

<style lang="scss">
  .sidebar-settings {
    .options-container {
      margin-bottom: 20px;
    }
    .buttons-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
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
