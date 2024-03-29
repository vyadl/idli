<script>
export default {
  props: {
    styleType: {
      type: String,
      validator(value) {
        return value 
          ? [
            'hint',
            'info',
            'dots',
            'cross',
            'arrow',
            'plus',
            'loupe',
          ].includes(value)
          : true;
      },
    },
    size: {
      type: String,
      validator(value) {
        return value
          ? ['big'].includes(value)
          : true;
      },
    },
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'button',
      validator(value) {
        return value
          ? ['button', 'reset', 'submit'].includes(value)
          : true;
      },
    },
    active: {
      type: Boolean,
      default: false,
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
      size,
      { active },
      `${globalTheme}-theme`,
    ]"
    :title="title"
    :type="type"
    :disabled="disabled"
    @click="click($event)"
  />
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
        transition: color 0.2s;
      }

      &.big {
        height: 23px;

        &::before {
          font-size: 18px;
          font-weight: 800;
          transform: translate(-4px, -10px) rotate(90deg);
        }
      }
    }

    &.plus {
      background-image: url('/icons/plus.svg');
      background-size: contain;
      width: 25px;
      height: 25px;
      filter: invert(40%);
      transition: filter 0.2s;

      &:hover,
      &.active {
        filter: invert(0%);
      }

      &.big {
        width: 45px;
        height: 45px;
      }

      &:disabled {
        filter: invert(60%);
      }
    }

    &.cross {
      width: 10px;
      height: 10px;

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
        background-color: map-get($colors, 'gray-light');
        transform-origin: center center;
        transition: color 0.2s;
      }

      &::before {
        transform: translateX(-50%) rotate(45deg);
      }

      &::after {
        transform: translateX(-50%) rotate(-45deg);
      }
    }

    &.info,
    &.hint {
      position: relative;
      border: 1px solid map-get($colors, 'gray-dark');
      border-radius: 50%;
      &::before {
        position: absolute;
        color: map-get($colors, 'gray-dark');
        transform: translate(-50%, -50%);
      }

      &:hover {
        filter: invert(50%);
      }
    }

    &.info {
      width: 20px;
      height: 20px;
      &::before {
        content: 'i';
      }
    }

    &.hint {
      width: 15px;
      height: 15px;
      &::before {
        content: '?';
        font-size: 10px;
      }
    }

    &.loupe {
      background-image: url('/icons/loupe.svg');
      background-size: contain;
      width: 20px;
      height: 20px;
      filter: invert(40%);
      transition: filter 0.2s;

      &:hover,
      &.active {
        filter: invert(0%);
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

      &.plus {
        filter: invert(100%);

        &:hover,
        &:disabled {
          filter: invert(60%);
        }

        &::before,
        &::after {
          background-color: map-get($colors, 'white');
        }
      }

      &.cross {
        &:hover {
          &::before,
          &::after {
            background-color: map-get($colors, 'gray-light');
          }
        }

        &::before,
        &::after {
          background-color: map-get($colors, 'gray-dark');
        }
      }

      &.info,
      &.hint {
        border: 1px solid map-get($colors, 'gray-light');
        
        &::before {
          color: map-get($colors, 'gray-light');
        }
      }

      &.loupe {
        filter: invert(60%);

        &:hover,
        &.active {
          filter: invert(100%);
        }
      }
    }
  }
</style>
