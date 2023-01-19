<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    item: Object,
    bordered: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  computed: {
    ...mapGetters([
      'isDraggableMode',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
    ]),
    ...mapGetters('visualization', [
      'mode',
      'shuffleTrigger',
      'listAlign',
      'areItemDetailsShown',
    ]),
    ...mapGetters('items', [
      'edittingItemObj',
    ]),
    isUntitled() {
      return !this.item.title;
    },
    itemName() {
      let name = '';

      if (this.isUntitled) {
        name = 'Untitled';
      } else if (this.item.title) {
        name = this.item.title;
      } else if (this.item.temporaryId) {
        name = 'New item...';
      } 

      return name;
    },
    isItemActive() {
      return this.edittingItemObj?.temporaryId 
        ? this.edittingItemObj.temporaryId === this.item.temporaryId
        : this.edittingItemObj?.id === this.item.id;
    },
    styles() {
      this.shuffleTrigger; // eslint-disable-line no-unused-expressions

      let styles = {};

      if (['cloud', 'stars'].includes(this.mode)) {
        const windowWidth = document.documentElement.clientWidth;
        const windowHeight = document.documentElement.clientHeight;
        
        const translateX = Math.floor(Math.random() * (windowWidth - 20)) + 10;
        const translateY = Math.floor(Math.random() * (windowHeight - 20)) + 10;
        const scaleStyle = `scale(${Math.floor(Math.random() * (20 - 5) + 5) / 10})`;
        const rotateStyle = `rotate(${Math.floor(Math.random() * 40 - 20)}deg)`;
        const translateStyle = `translate(
          calc(${translateX}px - 50%),
          calc(${translateY}px - 50%))`;

        styles = { transform: `${translateStyle} ${scaleStyle} ${rotateStyle}` };
      } else if (this.listAlign === 'random') {
        const alignItemsStyles = ['flex-start', 'center', 'flex-end'];
        const textAlignStyles = ['left', 'center', 'right'];

        styles = { 
          'align-items': `${alignItemsStyles[this.randomNumber(0, 2)]}`,
          'text-align': `${textAlignStyles[this.randomNumber(0, 2)]}`,
        };
      }

      return styles;
    },
  },
  methods: {
    ...mapActions('items', [
      '_findAndSetEdittingItemIndex',
    ]),
    ...mapActions('sidebar', [
      '_openSidebar',
    ]),
    setItemForEditting() {
      if (this.item.id) {
        this.$emit('click', this.item.id);
      }

      this._findAndSetEdittingItemIndex(this.item);

      this.isItemFormInSidebar
        ? this._openSidebar('item')
        : this.$vfm.show('itemModal');
    },
    randomNumber(min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },
  },
};
</script>

<template>
  <div
    class="list-item"
    :class="[
      `${mode}-mode`,
      `${globalTheme}-theme`,
      {
        active: isItemActive,
        draggable: isDraggableMode,
        bordered
      },
    ]"
    :style="styles"
  >
    <div
      class="item-title"
      :class="{ untitled: isUntitled }"
      @click.stop="setItemForEditting"
    >
      {{ itemName }}
    </div>
    <div
      v-if="areItemDetailsShown && item.details && ['list', 'cards'].includes(mode)"
      class="item-details"
      @click.stop="setItemForEditting"
    >
      {{ item?.details }}
    </div>
  </div>
</template>

<style lang="scss">
  .list-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: inherit;
    margin-bottom: 10px;
    width: 100%;
    transition: transform 0.2s;

    &.bordered {
      padding: 5px 15px;
      border: 1px solid map-get($colors, 'black');

      .item {
        &-title {
          font-size: 14px;
        }

        &-details {
          font-size: 12px;
        }
      }
    }

    .item-title {
      display: inline-block;
      padding: 5px;
      font-size: map-get($text, 'big-title-font-size');
      transition: 0.2s text-shadow;
      cursor: pointer;

      &.untitled{
        opacity: 0.5;
      }
    }

    .item-details {
      align-self: inherit;
      padding: 5px;
      color: map-get($colors, 'gray-dark');
      cursor: pointer;
    }

    &.active {
      .item-title {
        text-shadow:
          0.5px 0 currentColor,
          0.5px 0 1px currentColor;
      }
    }

    &.cards-mode {
      margin-bottom: 0;
      padding: 10px 10px;
      border: 2px solid map-get($colors, 'black');
      border-radius: 3px;
      transition: box-shadow 0.1s;

      &.active {
        box-shadow:
          1px 1px 0 0.5px map-get($colors, 'black'),
          1px -1px 0 0.5px map-get($colors, 'black'),
          -1px 1px 0 0.5px map-get($colors, 'black'),
          -1px -1px 0 0.5px map-get($colors, 'black');
      }

      .item-title {
        text-shadow: none;
      }
    }

    &.page-mode,
    &.cloud-mode,
    &.draggable {
      width: fit-content;
    }

    &.cloud-mode {
      position: absolute;

      &::before {
        content: "";
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: map-get($colors, 'white');
        filter: blur(7px);
      }

      .item-title {
        position: relative;
        z-index: 2;
      }
    }

    &.stars-mode {
      position: absolute;
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background-color: map-get($colors, 'black');

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        min-width: 8px;
        min-height: 8px;
        width: 250%;
        height: 250%;
      }

      &:hover {
        .item-title {
          z-index: 2;
          margin: 0;
          padding: 0;
          opacity: 1;
          transform: scale(1);
        }
      }

      &::before {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: transparent;
        filter: none;
      }

      .item-title {
        opacity: 0;
        transition: opacity 0.2s;
        transform: scale(0);
      }
    }

    &.inverted-theme {
      &.bordered {
        border-color: map-get($colors, 'white');
      }

      .item-details {
        color: map-get($colors, 'gray-light');
      }

      &::before {
        background-color: map-get($colors, 'black');
      }

      &.cards-mode {
        border-color: map-get($colors, 'white');

        &.active {
          box-shadow:
            1px 1px 0 1px map-get($colors, 'white'),
            1px -1px 0 1px map-get($colors, 'white'),
            -1px 1px 0 1px map-get($colors, 'white'),
            -1px -1px 0 1px map-get($colors, 'white');
        }
      }

      &.stars-mode {
        background-color: map-get($colors, 'white');

        &::before {
          background-color: transparent;
        }
      }
    }
  }
</style>
