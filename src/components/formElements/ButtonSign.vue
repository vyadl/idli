<script>
export default {
  props: {
    styleType: String,
    big: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'button',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  methods: {
    click(event) {
      if (this.stopPropagation) {
        event.stopPropagation();
      }

      this.$emit('click');
    },
  },
};
</script>

<template>
  <button
    class="button-sign"
    :class="[
      styleType,
      { big },
      `${globalTheme}-theme`,
    ]"
    :title="title"
    :type="type"
    :disabled="disabled"
    @click="click($event)"
  ></button>
</template>

<style lang="scss">
  .button-sign {
    position: relative;
    display: block;
    padding: 0;
    cursor: pointer;

    &:disabled {
      pointer-events: none;
    }

    &.arrow {
      width: 45px;
      height: 45px;

      &::before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border-left: 3px solid map-get($colors, 'black');
        border-top: 3px solid map-get($colors, 'black');
        transform-origin: center center;
        transform: translate(-5px, -10px) rotate(-45deg);
      }
    }

    &.dots {
      width: 17px;
      height: 17px;

      &:hover {
        &::before {
          color: map-get($colors, 'black');
        }
      }

      &::before {
        content: '...';
        position: absolute;
        font-weight: 600;
        letter-spacing: 1px;
        color: map-get($colors, 'gray-dark');
        transform: translate(-5px, -9px) rotate(90deg);
        transition: color .2s;
      }
    }

    &.plus {
      width: 15px;
      height: 15px;

      &.big {
        width: 45px;
        height: 45px;

        &::before,
        &::after {
          width: 2px;
          height: 25px;
        }
      }

      &:hover,
      &:disabled {
        &::before,
        &::after {
          background-color: map-get($colors, 'gray-dark');
        }
      }

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 2px;
        height: 100%;
        background-color: map-get($colors, 'black');
        transform-origin: center center;
        transition: color .2s;
      }

      &::before {
        transform: translate(-50%, -50%) rotate(90deg);
      }

      &::after {
        transform: translate(-50%, -50%);
      }
    }

    &.cross {
      width: 12px;
      height: 12px;

      &:hover {
        &::before,
        &::after {
          background-color: map-get($colors, 'gray-dark');
        }
      }

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        width: 1px;
        height: 100%;
        background-color: map-get($colors, 'black');
        transform-origin: center center;
        transition: color .2s;
      }

      &::before {
        transform: translateX(-50%) rotate(45deg);
      }

      &::after {
        transform: translateX(-50%) rotate(-45deg);
      }
    }

    &.inverted-theme {
      &.arrow {
        &::before {
          border-color: map-get($colors, 'white');
        }
      }

      &.dots {
        &:hover {
          &::before {
            color: map-get($colors, 'white');
          }
        }

        &::before {
          color: map-get($colors, 'gray-light');
        }
      }

      &.plus,
      &.cross {
        &:hover,
        &:disabled {
          &::before,
          &::after {
            background-color: map-get($colors, 'gray-light');
          }
        }

        &::before,
        &::after {
          background-color: map-get($colors, 'white');
        }
      }
    }
  }
</style>
