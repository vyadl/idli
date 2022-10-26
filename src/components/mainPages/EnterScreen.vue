<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ButtonText,
  },
  computed: {
    ...mapGetters('sidebar', [
      'isSidebarOpen',
    ]),
    logoSrc() {
      return this.globalTheme === 'default' 
        ? '/images/black-logo.svg' : '/images/white-logo.svg';
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
        style-type="line"
        stop-propagation
        @click="_openSidebar('sign up')"
      />
      <span class="divider">|</span>
      <ButtonText
        text="sign in"
        style-type="line"
        stop-propagation
        @click="_openSidebar('sign in')"
      />
    </div>
  </div>
</template>

<style lang="scss">
  .enter-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    }

    .divider {
      padding: 0 5px;
    }
  }
</style>
