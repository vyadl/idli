<script>
import SidebarPage from '@/components/mainPages/SidebarPage.vue';

export default {
  components: {
    SidebarPage,
  },
};
</script>

<template>
  <div class="with-sidebar">
    <SidebarPage />
    <slot />
  </div>
</template>

<style lang="scss">
.with-sidebar {
  width: 100%;
}
</style>
