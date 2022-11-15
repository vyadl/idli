<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import { mapGetters, mapActions } from 'vuex';
import { publicListsForAuthScreen } from '@/store/config';

export default {
  components: {
    ButtonText,
    CustomLink,
  },
  computed: {
    ...mapGetters('sidebar', [
      'isSidebarOpen',
    ]),
    logoSrc() {
      return this.globalTheme === 'default' 
        ? '/images/black-logo.svg' : '/images/white-logo.svg';
    },
    publicListsForAuthScreen() {
      return publicListsForAuthScreen;
    },
  },
  methods: {
    ...mapActions('sidebar', [
      '_openSidebar',
      '_closeSidebar',
    ]),
  },
};
</script>

<template>
  <div
    class="enter-screen"
    :class="{ parallax: isSidebarOpen }"
    @click="_closeSidebar"
  >
    <img
      class="logo"
      alt="logo"
      :src="logoSrc"
    >
    <div class="buttons-container">
      <ButtonText
        text="sign up"
        style-type="bordered"
        size="small"
        stop-propagation
        @click="_openSidebar('sign up')"
      />
      <ButtonText
        text="sign in"
        style-type="bordered"
        size="small"
        stop-propagation
        @click="_openSidebar('sign in')"
      />
    </div>
    <div class="conjunction">
      — or —
    </div>
    <div class="public-lists-container">
      <div class="public-lists-title">
        check some public lists:
      </div>
      <div>
        <div 
          v-for="list in publicListsForAuthScreen"
          :key="list.id"
          class="public-list"
        >
          <CustomLink
            :to="{ name: 'list', params: { id: list.id } }"
            target="_blank"
            :title="list.title"
            with-arrow
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .enter-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    min-height: 100vh;
    transition: transform 0.5s;

      &.parallax {
        transform: translateX(-20px);
      }

    .logo {
      display: block;
      width: 400px;
      margin-bottom: 20px;
    }

    .buttons-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .conjunction {
      font-variant-caps: all-small-caps;
    }

    .public-lists-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: map-get($colors, 'gray-dark');
    }

    .public-lists-title {
      font-variant-caps: all-small-caps;
    }
    
    .public-list {
      margin-bottom: 5px;
      text-align: left;
      font-size: 13px;
    }
  }
</style>
