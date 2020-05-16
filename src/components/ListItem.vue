<template>
  <div
    class="item"
    :class="{
    'item--cloud-mode': isCloudModeOn,
    'item--stars-mode': isStarsModeOn,
    'item--invert': isInvert,
  }"
    :style="styles"
  >
    <div
      class="item__body"
      :class="{ 'item__body--active' : activeItem && activeItem.id == item.id}"
      @click.stop="_setActiveItem(item)"
    >{{ item.text }}</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ListItem',
  props: ['item'],

  beforeMount() {

  },

  mounted() {
    if (this.listChanging) {
      this._changeChangingListStatus(false);
    }
  },

  computed: {
    ...mapGetters([
      'list',
      'activeItem',
      'isChangingActive',
      'isCloudModeOn',
      'shuffleTrigger',
      'isStarsModeOn',
      'starsSettings',
      'isInvert',
      'ListChanging'
    ]),

    styles() {
      let styleObj = {};
      this.shuffleTrigger;

      if (this.isCloudModeOn || this.isStarsModeOn) {

        const widthWindow = document.documentElement.clientWidth;
        const heightWindow = document.documentElement.clientHeight;
        const scaleStyle = `scale(${Math.floor(Math.random() * (20 - 5) + 5) / 10})`;
        const rotateStyle = `rotate(${Math.floor(Math.random() * 40 - 20)}deg)`;
        const translateStyle = `translate(${Math.floor(Math.random() * (widthWindow - 70 - 5) + 5)}px, ${Math.floor(Math.random() * heightWindow)}px)`;

        styleObj = {
          transform: `${scaleStyle} ${rotateStyle} ${translateStyle}`,
        }
      }


      return this.isCloudModeOn || this.isStarsModeOn ? styleObj : {};
    }
  },

  methods: {
    ...mapActions(['_setActiveItem', '_deleteItem', '_setChangingStatus', '_changeChangingListStatus']),

    setactiveItem() {
      this._setActiveItem(JSON.stringify(JSON.parse(this.item)));
    },
  },
}
</script>

<style scoped lang="scss">
.item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
  &--cloud-mode {
    position: absolute;

    &::before {
      content: "";
      z-index: 1;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #fff;
      filter: blur(7px);
    }

    .item {
      &__body {
        position: relative;
        z-index: 2;
      }
    }
  }
  &--stars-mode {
    position: absolute;
    border-radius: 50%;
    width: 2px;
    height: 2px;
    background-color: #000;
    &:hover {
      .item {
        &__body {
          opacity: 1;
          transform: scale(1);
          margin: 0;
          padding: 0;
          z-index: 2;
        }
      }
    }

    &::before {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      filter: none;
      background-color: transparent;
    }

    .item {
      &__body {
        opacity: 0;
        transform: scale(0);
        transition: opacity 0.2s;
      }
    }
  }
  &--invert {
    &::before {
      background-color: #000;
    }
    &.item--stars-mode {
      background-color: #fff;

      &::before {
        background-color: transparent;
      }
    }
  }
  &:hover {
    .item {
      &__delete {
        opacity: 1;
        transform: none;
        pointer-events: all;
      }
    }
  }

  &__body {
    display: inline-block;
    font-size: 16px;
    margin-bottom: 10px;
    padding: 5px;
    transition: 0.2s box-shadow;
    &--active {
      box-shadow: 0 0 3px 0 rgba(#222, 0.4);
    }
  }

  &__delete {
    position: relative;
    transition: 0.2s opacity, 0.2s transform;
    opacity: 0;
    transform: translateX(-20px);
    pointer-events: none;
    height: 15px;
    width: 15px;

    &::after,
    &::before {
      content: "";
      position: absolute;
      width: 2px;
      height: 100%;
      transform: rotate(-45deg);
      background-color: #333;
    }

    &::after {
      transform: rotate(45deg);
    }
  }
}
</style>