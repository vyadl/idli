<template>
  <div
    class="list-item"
    :class="{
      'cloud-mode': mode === 'cloud',
      'stars-mode': mode === 'stars',
      'invert-theme': isInvert,
    }"
    :style="styles"
  >
    <div
      class="inner"
      :class="{ active : edittingItemObj && edittingItemObj.id === item.id }"
      @click.stop="setItemForEditting"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: ['item'],
  computed: {
    ...mapGetters({
      mode: 'mode',
      shuffleTrigger: 'shuffleTrigger',
      edittingItemObj: 'edittingItemObj',
    }),
    styles() {
      this.shuffleTrigger; // eslint-disable-line no-unused-expressions
      let styleObj = {};

      if (this.mode === 'cloud' || this.mode === 'stars') {
        const widthWindow = document.documentElement.clientWidth;
        const heightWindow = document.documentElement.clientHeight;
        const scaleStyle = `scale(${Math.floor(Math.random() * (20 - 5) + 5) / 10})`;
        const rotateStyle = `rotate(${Math.floor(Math.random() * 40 - 20)}deg)`;
        const translateStyle = `translate(
          ${Math.floor(Math.random() * (widthWindow - 70 - 5) + 5)}px, 
          ${Math.floor(Math.random() * heightWindow)}px)`;

        styleObj = {
          transform: `${scaleStyle} ${rotateStyle} ${translateStyle}`,
        };
      }

      return this.mode === 'cloud' || this.mode === 'stars' ? styleObj : {};
    },
  },
  methods: {
    ...mapActions({
      _setItemForEditting: '_setItemForEditting',
    }),
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

    .inner {
      display: inline-block;
      font-size: map-get($text, 'title-font-size');
      margin-bottom: 10px;
      padding: 5px;
      transition: .2s text-shadow;

      &.active {
        text-shadow:
          .5px 0 currentColor,
          .5px 0 1px currentColor;
      }
    }

    &.cloud-mode {
      position: absolute;

      &::before {
        content: "";
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: map-get($colors, 'white');
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
      background-color: map-get($colors, 'black');

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
        transition: opacity .2s;
      }
    }

    &.invert-theme {
      &::before {
        background-color: map-get($colors, 'black');
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
