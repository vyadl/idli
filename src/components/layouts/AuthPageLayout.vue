<script>
import AppLogo from '@/components/auth/AppLogo.vue';

export default {
  components: {
    AppLogo,
  },
};
</script>

<template>
  <div>
    <transition
      name="slide-fade-delayed"
      mode="out-in"
    >
      <AppLogo :key="$route.path" /> 
    </transition>
    <slot />
  </div>
</template>
