<script>
export default {
  computed: {
    logoSrc() {
      return this.globalTheme === 'default' 
        ? '/images/black-logo.svg'
        : '/images/white-logo.svg';
    },
    logoSize() {
      return this.$route.name === 'auth'
        ? 'big'
        : 'small';
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
      :class="logoSize"
      alt="logo"
      :src="logoSrc"
      @click="openEnterScreen"
    >
  </div>
</template>

<style lang="scss">
.app-logo {
  .logo {
    display: block;
    margin: 0 auto 50px;
    cursor: pointer;

    &.big {
      width: 400px;
    }
    
    &.small {
      width: 150px;
    }
  }
}

@media #{breakpoints.$s-media} {
  .app-logo {
    .logo {
      &.big {
        width: 250px;
      }
    }
  }
}
</style>
