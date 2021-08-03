<template>
  <button
    class="button-sign"
    :class="[styleType, { active }]"
    :type="type"
    :disabled="disabled"
    @click="click($event)"
  ></button>
</template>

<script>
export default {
  props: {
    styleType: String,
    active: {
      type: Boolean,
      default: false,
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

    &:hover {
      opacity: .7;
    }

    &.active {
      opacity: .85;
    }

    &.arrow {
      width: 20px;
      height: 20px;
      border-left: 3px solid map-get($colors, 'black');
      border-top: 3px solid map-get($colors, 'black');
      transform-origin: center center;
      transform: rotate(-45deg);
    }

    &.plus,
    &.cross {
      position: relative;
      width: 15px;
      height: 15px;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        width: 2px;
        height: 100%;
        background-color: map-get($colors, 'black');
        transform-origin: center center;
        transform: translateX(-50%);
      }
    }

    &.plus {
      &::before {
        transform: rotate(90deg);
      }
    }

    &.cross {
      &::before {
        transform: rotate(45deg);
      }

      &::after {
        transform: rotate(-45deg);
      }
    }
  }
</style>
