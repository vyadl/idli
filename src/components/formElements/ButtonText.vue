<script>
export default {
  props: {
    text: String,
    size: {
      type: String,
      default: 'medium',
      validator(value) {
        return value ? ['big', 'medium', 'small', 'smallest'].includes(value) : true;
      },
    },
    styleType: {
      type: String,
      default: 'bordered',
      validator(value) {
        return value ? ['bordered', 'line', 'underline', 'brick'].includes(value) : true;
      },
    },
    active: {
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
      validator(value) {
        return value ? ['button', 'reset', 'submit'].includes(value) : true;
      },
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
    class="button-text"
    :class="[
      styleType,
      [size, { active }],
      `${globalTheme}-theme`,
    ]"
    :title="title"
    :type="type"
    :disabled="disabled"
    @click="click($event)"
  >
    {{ text }}
  </button>
</template>

<style lang="scss">
  .button-text {
    padding: 7px 14px;
    text-align: left;
    vertical-align: middle;
    line-height: 1.5;
    letter-spacing: 0.3px;
    cursor: pointer;

    &:disabled {
      pointer-events: none;
      color: map-get($colors, 'gray-light');
    }

    &.bordered {
      border: 2px solid map-get($colors, 'black');
      border-radius: 3px;
      color: map-get($colors, 'black');
      background-color: map-get($colors, 'white');
      transition:
        background-color 0.3s 0.05s,
        color 0.2s 0.05s,
        border-color 0.2s 0.05s;

      &.small {
        padding: 3px 10px 4px;
        font-size: 13px;
      }

      &.smallest {
        padding: 0 5px;
        font-size: 11px;
        border-width: 1px;
      }

      &.active {
        background-color: map-get($colors, 'black');
        color: map-get($colors, 'white');
        border-color: map-get($colors, 'black');

        &:hover {
          background-color: map-get($colors, 'gray-dark');
          border-color: map-get($colors, 'gray-dark');
          color: map-get($colors, 'white');
        }
      }

      &:hover {
        background-color: map-get($colors, 'white');
        border-color: map-get($colors, 'gray-light');
        color: map-get($colors, 'gray-light');
      }

      &:disabled {
        color: map-get($colors, 'gray-light');
        border-color: map-get($colors, 'gray-light');
      }
    }

    &.underline {
      padding: 5px 0;
      font-size: 13px;
      text-decoration: underline;
      color: map-get($colors, 'gray-dark');
      transition: color 0.2s;

      &.small {
        padding: 3px 0;
        font-size: 11px;
      }

      &.smallest {
        padding: 3px 0;
        font-size: 11px;
        color: map-get($colors, 'gray-light');

        &:hover {
          color: map-get($colors, 'gray-dark');
        }
      }

      &.big {
        font-size: 15px;
      }

      &:hover {
        color: map-get($colors, 'gray-light');
      }
    }

    &.line {
      padding: 5px 0;
      line-height: 1.3;
      color: map-get($colors, 'gray-dark');
      transition: color 0.2s;

      &.small {
        font-size: 13px;
      }

      &.smallest {
        font-size: 11px;
      }

      &.active,
      &:hover {
        color: map-get($colors, 'black');
      }
    }

    &.brick {
      line-height: 1.3;
      padding: 7px 12px;
      color: map-get($colors, 'gray-dark');
      transition:
        color 0.2s,
        background-color 0.2s;

      &.small {
        padding: 5px 10px;
        font-size: 13px;
      }

      &.active {
        &,
        &:hover {
          color: map-get($colors, 'gray-very-light');
          background-color: map-get($colors, 'black');
        }
      }

      &:hover {
        color: map-get($colors, 'black');
        background-color: map-get($colors, 'gray-very-light');
      }
    }

    &.inverted-theme {
      &:disabled {
        color: map-get($colors, 'gray-dark');
      }

      &.bordered {
        border-color: map-get($colors, 'white');
        background-color: map-get($colors, 'black');
        color: map-get($colors, 'white');

        &.active {
          background-color: map-get($colors, 'white');
          color: map-get($colors, 'black');
          border-color: map-get($colors, 'white');

          &:hover {
            background-color: map-get($colors, 'gray-light');
            border-color: map-get($colors, 'gray-light');
            color: map-get($colors, 'black');
          }
        }

        &:hover {
          background-color: map-get($colors, 'black');
          border-color: map-get($colors, 'gray-dark');
          color: map-get($colors, 'gray-dark');
        }

        &:disabled {
          border-color: map-get($colors, 'gray-dark');
          color: map-get($colors, 'gray-dark');
        }
      }

      &.underline {
        color: map-get($colors, 'gray-light');

        &.smallest {
          color: map-get($colors, 'gray-dark');
        }

        &:hover {
          color: map-get($colors, 'gray-dark');
        }
      }

      &.line {
        color: map-get($colors, 'gray-light');

        &.active,
        &:hover {
          color: map-get($colors, 'white');
        }
      }

      &.brick {
        color: map-get($colors, 'gray-light');

        &.active {
          &,
          &:hover {
            color: map-get($colors, 'black');
            background-color: map-get($colors, 'white');
          }
        }

        &:hover {
          color: map-get($colors, 'gray-very-light');
          background-color: map-get($colors, 'gray-dark');
        }
      }
    }
  }
</style>
