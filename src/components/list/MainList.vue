<template>
  <div
    class="main-list"
    @click="_closeSidebar"
  >
    <div
      class="list-title"
      v-if="currentListName"
    >
      {{ currentListName }}
    </div>
    <template v-if="isCloudModeOn && !isStarsModeOn">
      <ListItem
        v-for="item in finalList"
        :key="item.id"
        :item="item"
      />
    </template>
    <template v-else>
      <div
        class="items-container"
        :class="{ parallax: isSidebarOpen }"
      >
        <transition name="fade">
          <div v-if="isListShown">
            <ListItem
              v-for="item in finalList"
              :key="item.id"
              :item="item"
            />
          </div>
        </transition>
      </div>
    </template>
  </div>
</template>

<script>
import ListItem from '@/components/list/ListItem.vue';
import Utils from '@/utils/utils';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ListItem,
  },
  data: () => ({
    isListShown: false,
    finalList: [],
  }),
  computed: {
    ...mapGetters({
      currentListObj: 'currentListObj',
      filteredList: 'filteredList',
      shuffleTrigger: 'shuffleTrigger',
      isShuffled: 'isShuffled',
      isCloudModeOn: 'isCloudModeOn',
      isStarsModeOn: 'isStarsModeOn',
      isSidebarOpen: 'isSidebarOpen',
    }),
    currentListName() {
      return this.currentListObj?.name;
    },
    shuffledList() {
      this.shuffleTrigger; // eslint-disable-line no-unused-expressions

      return Utils.shuffleArray(this.filteredList);
    },
    computedList() {
      return this.isShuffled ? this.shuffledList : this.filteredList;
    },
  },
  watch: {
    computedList: {
      handler: function computedListHanler() {
        this.isListShown = false;

        setTimeout(() => {
          this.finalList = [];
          this.finalList = this.computedList;
          this.isListShown = true;
        }, 200);
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      _closeSidebar: '_closeSidebar',
    }),
  },
};
</script>

<style lang="scss">
  .main-list {
    height: 100vh;

    .list-title {
      margin-bottom: 40px;
      padding: 10px;
      font-size: 14px;
      color: #bbb;
    }

    .items-container {
      display: flex;
      flex-direction: column;
      transition: transform .5s;

      &.parallax {
        transform: translateX(-20px);
      }
    }
  }
</style>
