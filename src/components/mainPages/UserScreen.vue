<template>
  <div class="user-screen">
    <div
        class="list-title"
        v-if="currentListName"
      >
        {{ currentListName }}
      </div>
      <div
        class="main-content"
        :class="{ parallax: isSidebarOpen }"
      >
        <MainList />
      </div>
      <transition name="fade">
        <SaveItem v-if="isChangingActive" />
      </transition>
  </div>
</template>

<script>
import MainList from '@/components/list/MainList.vue';
import SaveItem from '@/components/list/SaveItem.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    MainList,
    SaveItem,
  },
  computed: {
    ...mapGetters({
      isChangingActive: 'isChangingActive',
      currentListObj: 'currentListObj',
      isSidebarOpen: 'isSidebarOpen',
    }),
    currentListName() {
      return this.currentListObj?.name;
    },
  },
};
</script>

<style lang="scss">
  .user-screen {
    .list-title {
      color: #bbb;
      font-size: 14px;
      padding: 10px;
    }

    .main-content {
      transition: transform .5s;

      &.parallax {
        transform: translateX(-20px);
      }
    }
  }
</style>
