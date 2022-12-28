<script>
import { mapGetters, mapActions } from 'vuex';
import SidebarPage from '@/components/mainPages/SidebarPage.vue';

export default {
  components: {
    SidebarPage,
  },
  computed: {
    ...mapGetters('sidebar', [
      'isSidebarOpen',
    ]),
    ...mapGetters('settings', [
      'isListUnderSidebar',
    ]),
  },
  methods: {
    ...mapActions('sidebar', [
      '_closeSidebar',
    ]),
  },
};
</script>

<template>
  <div class="with-sidebar">
    <SidebarPage />
    <div
      class="main-content"
      :class="{
        'move-to-left': !isListUnderSidebar && isSidebarOpen,
      }"
      @click="_closeSidebar"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.with-sidebar {
  width: 100%;
  height: 100vh;

  .main-content {
    transition:
      margin 0.5s,
      transform 0.5s;
    
    &.move-to-left {
      margin-right: 280px;
    }
  }
}
</style>
