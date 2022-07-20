<template>
  <div
    class="main-list"
    :class="`${globalTheme}-theme`"
    @click="_closeSidebar"
  >
    <div
      class="header"
      :class="{ hidden: isFocusOnList }"
    >
      <div
        class="list-title"
        v-if="currentListObj"
      >
        {{ currentListObj.title }}
      </div>
      <div class="button-container">
        <ButtonText
          v-if="sorting === 'shuffled'"
          text="randomize!"
          style-type="underline"
          @click="_switchShuffleTrigger"
        />
      </div>
    </div>
    <div
      class="items-container"
      :class="[
        `${mode}-mode`,
        {
          'move-to-left': !isListUnderSidebar && isSidebarOpen,
          parallax: isSidebarOpen,
        },
      ]"
      :style="styles"
    >
      <template v-if="mode === 'cards'">
        <masonry-wall
          :items="finalList"
          :column-width="200"
          :gap="0"
        >
          <template #default="{ item }">
            <ListItem
              :key="item.id"
              :item="item"
            />
          </template>
        </masonry-wall>
      </template>
      <template v-else>
        <ListItem
          v-for="item in finalList"
          :key="item.id"
          :item="item"
        />
      </template>
    </div>
  </div>
</template>

<script>
import ListItem from '@/components/list/ListItem.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { shuffleArray } from '@/utils/utils';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ListItem,
    ButtonText,
  },
  data: () => ({
    finalList: [],
  }),
  computed: {
    ...mapGetters({
      currentListObj: 'currentListObj',
      filteredList: 'filteredList',
      edittingItemObj: 'edittingItemObj',
      sorting: 'sorting',
      mode: 'mode',
      shuffleTrigger: 'shuffleTrigger',
      listAlign: 'listAlign',
      areItemDetailsShown: 'areItemDetailsShown',
      isItemFormInSidebar: 'isItemFormInSidebar',
      isFocusOnList: 'isFocusOnList',
      isListUnderSidebar: 'isListUnderSidebar',
      isSidebarOpen: 'isSidebarOpen',
    }),
    styles() {
      let styles = {};

      if (this.mode === 'list') {
        const alignStyles = {
          left: 'flex-start',
          center: 'center',
          right: 'flex-end',
          random: null,
        };

        styles = { 'align-items': alignStyles[this.listAlign] };
      } else if (this.mode === 'page') {
        const alignStyles = {
          left: 'flex-start',
          center: 'center',
          right: 'flex-end',
          edges: 'space-between',
        };

        styles = { 'justify-content': alignStyles[this.listAlign] };
      }

      return styles;
    },
    shuffledList() {
      this.shuffleTrigger; // eslint-disable-line no-unused-expressions

      return shuffleArray(this.filteredList);
    },
    computedList() {
      return this.sorting === 'shuffled' ? this.shuffledList : this.filteredList;
    },
  },
  watch: {
    computedList: {
      handler: function computedListHandler() {
        this.finalList = [];
        this.finalList = this.computedList;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.setArrowHotkeys();
  },
  methods: {
    ...mapActions({
      _setItemForEditting: '_setItemForEditting',
      _switchShuffleTrigger: '_switchShuffleTrigger',
      _closeSidebar: '_closeSidebar',
    }),
    setShuffledList() {
      this._setShuffledList(shuffleArray(this.filteredList));
    },
    setArrowHotkeys() {
      document.addEventListener('keyup', event => {
        if (!event.target.closest('input[type=text]') && !event.target.closest('textarea')) {
          if ((event.code === 'ArrowUp' || event.code === 'ArrowDown')
            && this.edittingItemObj
            && this.isItemFormInSidebar
            && !['cloud', 'stars'].includes(this.mode)) {
            const currentItemIndex = this.computedList
              .findIndex(item => item === this.edittingItemObj);

            if (event.code === 'ArrowUp' && this.computedList[currentItemIndex - 1]) {
              this._setItemForEditting(this.computedList[currentItemIndex - 1]);
            } else if (event.code === 'ArrowDown' && this.computedList[currentItemIndex + 1]) {
              this._setItemForEditting(this.computedList[currentItemIndex + 1]);
            }
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
  .main-list {
    width: 100%;
    min-height: 100vh;

    .header {
      padding: 10px 10px 0;

      &.hidden {
        opacity: 0;
      }
    }

    .list-title {
      font-size: map-get($text, 'title-font-size');
      color: map-get($colors, 'gray-light');
    }

    .button-container {
      position: relative;
      z-index: 100;
      height: 30px;
    }

    .items-container {
      padding: 30px 50px 50px;
      transition:
        margin .5s,
        transform .5s;

      &.list-mode {
        display: flex;
        flex-direction: column;
      }

      &.page-mode {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      }

      &.cloud-mode,
      &.stars-mode {
        position: fixed;
        overflow: hidden;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 100vh;
        padding: 0;
      }

      &.move-to-left {
        margin-right: 280px;
      }

      &.parallax {
        transform: translateX(-20px);
      }
    }

    &.inverted-theme {
      .list-title {
        color: map-get($colors, 'gray-dark');
      }
    }
  }
</style>
