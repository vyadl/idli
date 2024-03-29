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
    const loadItem = async () => {
      try {
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
    };

    loadItem(this.$route.params.id);

    this.$watch(
      () => this.$route.params.id,
      id => {
        if (this.$route.name === 'item') {
          loadItem(id);
        }
      },
    );
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
    ]),
    ...mapActions('settings', [
      '_toggleItemFormLocation',
    ]),
    ...mapActions('sidebar', [
      '_openSidebar',
      '_closeSidebar',
    ]),
    setItemForEditting() {
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
      { active: currentItemObj?.id === item.id },
    ]"
  >
    <CustomLink
      :to="{ name: 'list', params: { id: item.listId } }"
      title="list for this item"
      class="link-to-parent-list"
    />
    <div class="item-container">
      <div 
        class="item-title"
        :class="{ untitled: !item.title }"
        @click.stop="setItemForEditting"
      >
        {{ item.title || 'Untitled' }}
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
    }

    .item-title {
      display: inline-block;
      padding: 5px;
      font-size: map-get($text, 'big-title-font-size');
      transition: 0.2s text-shadow;

      &.untitled {
        opacity: 0.5;
      }
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
