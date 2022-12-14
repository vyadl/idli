<script>
export default {
  props: {
    logoSize: {
      type: String,
      default: 'medium',
      validator(value) {
        return value ? ['big', 'small'].includes(value) : true;
      },
    },
  },
  computed: {
    logoSrc() {
      return this.globalTheme === 'default' 
        ? '/images/black-logo.svg'
        : '/images/white-logo.svg';
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
      alt="logo"
      class="logo"
      :class="logoSize"
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
