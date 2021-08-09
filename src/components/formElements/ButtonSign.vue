<template>
  <button
    class="button-sign"
    :class="[styleType, { big }]"
    :type="type"
    :title="title"
    :disabled="disabled"
    @click="click($event)"
  ></button>
</template>

<script>
export default {
  props: {
    styleType: String,
    big: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'button',
    },
    title: {
      type: String,
      default: '',
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

<style lang="scss">
  .button-sign {
    padding: 0;
    cursor: pointer;
    transition: opacity .2s;

    &.arrow {
      width: 20px;
      height: 20px;
      border-left: 3px solid map-get($colors, 'black');
      border-top: 3px solid map-get($colors, 'black');
      transform-origin: center center;
      transform: rotate(-45deg);
    }

    &.dots {
      position: relative;
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
        font-size: 14px;
        font-weight: 100;
        color: map-get($colors, 'gray-light');
        transform: translate(-2px, -9px) rotate(90deg);
        transition: color .2s;
      }
    }

    &.plus,
    &.cross {
      position: relative;

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
    }

    &.plus {
      width: 15px;
      height: 15px;

      &.big {
        width: 22px;
        height: 22px;

        &::before,
        &::after {
          width: 2px;
        }
      }

      &::before {
        transform: translateX(-50%) rotate(90deg);
      }

      &::after {
        transform: translateX(-50%);
      }
    }

    &.cross {
      width: 12px;
      height: 12px;

      &::before {
        transform: translateX(-50%) rotate(45deg);
      }

      &::after {
        transform: translateX(-50%) rotate(-45deg);
      }
    }
  }
</style>
