<script>
import { mapGetters, mapActions } from 'vuex';
import SidebarPage from '@/components/mainPages/SidebarPage.vue';
import { sidebarWidthValues } from '@/store/config';

export default {
  components: {
    SidebarPage,
  },
  data() {
    return {
      remainingSpaceNearSidebar: null,
    };
  },
  computed: {
    ...mapGetters('sidebar', [
      'isSidebarOpen',
    ]),
    ...mapGetters('settings', [
      'isListUnderSidebar',
    ]),
    styles() {
      const styles = {};

      styles.width = !this.isListUnderSidebar && this.isSidebarOpen
        ? `${this.remainingSpaceNearSidebar}px`
        : '100%';
      
      return styles;
    },
  },
  created() {
    this.remainingSpaceNearSidebar = window.innerWidth - sidebarWidthValues.main;
  },
  methods: {
    ...mapActions('sidebar', [
      '_closeSidebar',
    ]),
    adjustWidth(width) {
      this.remainingSpaceNearSidebar = window.innerWidth - width;
    },
  },
};
</script>

<template>
  <div class="with-sidebar">
    <SidebarPage @resize="adjustWidth" />
    <div
      class="main-content"
      :style="styles"
      @click="_closeSidebar"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.with-sidebar {
  width: 100%;
  min-height: 100vh;

  .main-content {
    transition:
      width 0.5s,
      transform 0.5s;
  }
}
</style>
