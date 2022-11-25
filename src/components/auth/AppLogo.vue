<script>
export default {
  computed: {
    logoSrc() {
      return this.globalTheme === 'default' 
        ? '/images/black-logo.svg' : '/images/white-logo.svg';
    },
    width() {
      return this.$route.name === 'auth' ? '400px' : '150px';
    },
  },
  methods: {
    openEnterScreen() {
      this.$router.push({ name: 'auth' });
    },
  },
};
</script>

<template>
  <div class="app-logo">
    <img
      class="logo"
      alt="logo"
      :src="logoSrc"
      :style="{ width }"
      @click="openEnterScreen"
    >
  </div>
</template>

<style lang="scss">
.app-logo {
  .logo {
    display: block;
    margin: 0 auto 60px;
    cursor: pointer;
  }
}
</style>
