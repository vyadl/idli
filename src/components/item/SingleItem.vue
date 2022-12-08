<script>
import { 
  mapActions,
  mapGetters,
  mapMutations,
} from 'vuex';
import CustomLink from '@/components/wrappers/CustomLink.vue';

export default {
  components: {
    CustomLink,
  },
  data() {
    return {
      item: null,
    };
  },
  computed: {
    ...mapGetters('auth', [
      'isLoggedIn',
    ]),
    ...mapGetters('items', [
      'edittingItemIndex',
      'edittingItemObj',
      'currentItemObj',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
      'isListUnderSidebar',
    ]),
    ...mapGetters('sidebar', [
      'isSidebarOpen',
    ]),
  },
  async created() {
    try {
      if (this.isLoggedIn) {
        await this._fetchListsForUser();
      }
      
      this.item = await this._fetchItemById({
        id: this.$route.params.id,
        cancelToken: null,
      });

      this._fetchListById({
        id: this.currentItemObj.listId, 
        cancelToken: null,
      })
        .then(() => {
          this.item = this.currentItemObj;
          this._findAndSetEdittingItemIndex(this.item);

          if (this.isItemFormInSidebar) {
            this._openSidebar('item');
          } else {
            this._toggleItemFormLocation();
            this._openSidebar('item');
          }

          this.$router.push({ query: { sidebar: 'item' } });
        });
    } catch (error) {
      console.log(error);

      this.$router.push({ name: this.isLoggedIn ? 'home' : 'auth' });      
    }
  },
  unmounted() {
    this.setCurrentItemObj(null);
  },
  methods: {
    ...mapMutations('items', [
      'setCurrentItemObj',
    ]),
    ...mapActions('lists', [
      '_fetchListById',
      '_fetchListsForUser',
    ]),
    ...mapActions('items', [
      '_fetchItemById',
      '_findAndSetEdittingItemIndex',
    ]),
    ...mapActions('settings', [
      '_toggleItemFormLocation',
    ]),
    ...mapActions('sidebar', [
      '_openSidebar',
      '_closeSidebar',
    ]),
    setItemForEditting() {
      this._findAndSetEdittingItemIndex(this.item);

      this.isItemFormInSidebar
        ? this._openSidebar('item')
        : this.$vfm.show('itemModal');

      this._fetchItemById({
        id: this.item.id,
        cancelToken: null,
      });
    },
  },
};
</script>

<template>
  <div
    v-if="item"
    class="single-item"
    :class="[
      `${globalTheme}-theme`,
      { active: edittingItemObj?.id === item.id },
    ]"
    @click="_closeSidebar"
  >
    <CustomLink
      :to="{ name: 'list', params: { id: item.listId } }"
      title="Go to the list the item is from"
      class="link-to-parent-list"
    />
    <div
      class="item-container"
      :class="{
        'move-to-left': !isListUnderSidebar && isSidebarOpen,
        parallax: isSidebarOpen,
      }"
    >
      <div 
        class="item-title"
        @click.stop="setItemForEditting"
      >
        {{ item.title }}
      </div>
      <div
        v-if="item.details"
        class="item-details"
      >
        {{ item.details }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .single-item {
    width: 100%;
    min-height: 100vh;
    cursor: pointer;
    transition: transform 0.2s;

    .link-to-parent-list {
      top: 20px;
      padding: 20px;
      font-size: 12px;
    }

    .item-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 60px 0;
      text-align: center;

      &.move-to-left {
        margin-right: 280px;
      }

      &.parallax {
        transform: translateX(-20px);
      }
    }

    .item-title {
      display: inline-block;
      padding: 5px;
      font-size: map-get($text, 'big-title-font-size');
      transition: 0.2s text-shadow;
    }

    .item-details {
      align-self: inherit;
      padding: 5px;
      color: map-get($colors, 'gray-dark');
    }

    &.active {
      .item-title {
        text-shadow:
          0.5px 0 currentColor,
          0.5px 0 1px currentColor;
      }
    }

    &.inverted-theme {
      .item-details {
        color: map-get($colors, 'gray-light');
      }

      &::before {
        background-color: map-get($colors, 'black');
      }
    }
  }
</style>
