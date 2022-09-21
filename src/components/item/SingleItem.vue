<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      item: null,
    };
  },
  computed: {
    ...mapGetters('auth', [
      'isLoggedIn',
    ]),
    ...mapGetters([
      'isItemFormInSidebar',
      'isSidebarOpen',
      'isListUnderSidebar',
      'edittingItemObj',
    ]),
  },
  created() {
    this._fetchItemById()
      .then(item => {
        this[this.isLoggedIn 
          ? '_fetchListById' 
          : '_fetchPublicList'
        ]({ id: item.listId, cancelToken: null })
          .then(() => {
            this.item = item;
            this._setEdittingItemIndex(this.item);

            if (this.isItemFormInSidebar) {
              this._openSidebar('item');
            } else {
              this._switchItemFormLocation();
              this._openSidebar('item');
            }

            this.$router.push({
              query: { 
                sidebar: 'item',
                item: item.id,
              },
            });
          })
          .catch(error => {
            console.log(error);
          });
      });

    if (this.isLoggedIn) {
      this._fetchListsForUser();
    }
  },
  methods: {
    ...mapActions([
      '_fetchItemById',
      '_fetchListById',
      '_fetchPublicList',
      '_fetchListsForUser',
      '_openSidebar',
      '_closeSidebar',
      '_setEdittingItemIndex',
      '_switchItemFormLocation',
    ]),
    setItemForEditting() {
      this._setEdittingItemIndex(this.item);

      this.isItemFormInSidebar
        ? this._openSidebar('item')
        : this.$vfm.show('itemModal');
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
    <router-link
      class="router-link"
      :to="{ name: 'list', params: { id: item.listId } }"
    >
      Go to the list the item is from
    </router-link>
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

    .router-link {
      padding: 20px;
      font-size: 12px;
    }

    .item-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 50px 0;
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
      font-size: map-get($text, 'title-font-size');
      transition: .2s text-shadow;
    }

    .item-details {
      align-self: inherit;
      padding: 5px;
      color: map-get($colors, 'gray-dark');
    }

    &.active {
      .item-title {
        text-shadow:
          .5px 0 currentColor,
          .5px 0 1px currentColor;
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
