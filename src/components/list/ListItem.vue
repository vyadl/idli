<template>
  <div
    class="list-item"
    :class="{
    'cloud-mode': isCloudModeOn,
    'stars-mode': isStarsModeOn,
    'invert': isInvert,
  }"
    :style="styles"
  >
    <div
      class="inner"
      :class="{ 'active' : edittingItemObj && edittingItemObj.id === item.id}"
      @click.stop="setItemForEditting"
    >{{ item.text }}</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: ['item'],
  computed: {
    ...mapGetters({
      edittingItemObj: 'edittingItemObj',
      isCloudModeOn: 'isCloudModeOn',
      shuffleTrigger: 'shuffleTrigger',
      isStarsModeOn: 'isStarsModeOn',
      starsSettings: 'starsSettings',
      isInvert: 'isInvert',
    }),
    styles() {
      let styleObj = {};
      this.shuffleTrigger; // eslint-disable-line no-unused-expressions

      if (this.isCloudModeOn || this.isStarsModeOn) {
        const widthWindow = document.documentElement.clientWidth;
        const heightWindow = document.documentElement.clientHeight;
        const scaleStyle = `scale(${Math.floor(Math.random() * (20 - 5) + 5) / 10})`;
        const rotateStyle = `rotate(${Math.floor(Math.random() * 40 - 20)}deg)`;
        const translateStyle = `translate(${Math.floor(Math.random() * (widthWindow - 70 - 5) + 5)}px, ${Math.floor(Math.random() * heightWindow)}px)`;

        styleObj = {
          transform: `${scaleStyle} ${rotateStyle} ${translateStyle}`,
        };
      }

      return this.isCloudModeOn || this.isStarsModeOn ? styleObj : {};
    },
  },
  methods: {
    ...mapActions([
      '_setItemForEditting',
      '_changeChangingListStatus',
    ]),
    setItemForEditting() {
      this._setItemForEditting(this.item);
      this.$modal.show('itemForm');
    },
  },
};
</script>

<style lang="scss">
  .list-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    margin: auto;
    cursor: pointer;
    transition: transform 0.2s;

    &.cloud-mode {
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

      .inner {
        position: relative;
        z-index: 2;
      }
    }

    &.stars-mode {
      position: absolute;
      border-radius: 50%;
      width: 2px;
      height: 2px;
      background-color: #000;

      &:hover {
        .inner {
          opacity: 1;
          transform: scale(1);
          margin: 0;
          padding: 0;
          z-index: 2;
        }
      }

      &::before {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        filter: none;
        background-color: transparent;
      }

      .inner {
        opacity: 0;
        transform: scale(0);
        transition: opacity 0.2s;
      }
    }

    &.invert {
      &::before {
        background-color: #000;
      }

      &.stars-mode {
        background-color: #fff;

        &::before {
          background-color: transparent;
        }
      }
    }

    .inner {
      display: inline-block;
      font-size: 16px;
      margin-bottom: 10px;
      padding: 5px;
      transition: 0.2s box-shadow;

      &.active {
        box-shadow: 0 0 3px 0 rgba(#222, 0.4);
      }
    }
  }
</style>
