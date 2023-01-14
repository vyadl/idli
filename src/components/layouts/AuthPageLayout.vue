<script>
import AppLogo from '@/components/auth/AppLogo.vue';

export default {
  components: {
    AppLogo,
  },
  computed: {
    logoSize() {
      return this.$route.name === 'auth'
        ? 'big'
        : 'small';
    },
  },
};
</script>

<template>
  <div>
    <transition
      name="slide-fade-delayed"
      mode="out-in"
    >
      <AppLogo
        :key="$route.path"
        :logo-size="logoSize"
      /> 
    </transition>
    <slot />
  </div>
</template>
