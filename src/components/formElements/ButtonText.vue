<template>
  <button
    class="button-text"
    :class="[
      styleType,
      { small, active },
      `${globalTheme}-theme`,
    ]"
    :title="title"
    :type="type"
    :disabled="disabled"
    @click="click($event)"
  >{{ text }}</button>
</template>

<script>
export default {
  props: {
    text: String,
    styleType: {
      type: String,
      default: 'bordered',
    },
    small: {
      type: Boolean,
      default: false,
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
  .button-text {
    padding: 7px 14px;
    text-align: left;
    vertical-align: middle;
    line-height: 1.5;
    letter-spacing: .3px;
    cursor: pointer;

    &.bordered {
      border: 2px solid map-get($colors, 'black');
      border-radius: 3px;
      background-color: map-get($colors, 'white');
      transition:
        background-color .3s .05s,
        color .2s .05s,
        border-color .2s .05s;

      &.small {
        padding: 3px 10px 4px;
        font-size: 13px;
      }

      &.active,
      &:hover {
        background-color: map-get($colors, 'black');
        color: map-get($colors, 'white');
      }

      &:disabled {
        pointer-events: none;
        border-color: map-get($colors, 'gray-light');
        color: map-get($colors, 'gray-light');

        &:hover {
          background-color: transparent;
        }
      }
    }

    &.underline {
      padding: 5px 0;
      font-size: 13px;
      text-decoration: underline;
      color: map-get($colors, 'gray-dark');
      transition: color .2s;

      &.small {
        padding: 3px 0;
        font-size: 11px;
      }

      &:hover,
      &:disabled {
        color: map-get($colors, 'gray-light');
      }

      &:disabled {
        pointer-events: none;
      }
    }

    &.line {
      padding: 5px 0;
      line-height: 1.3;
      color: map-get($colors, 'gray-dark');
      transition: color .2s;

      &.active,
      &:hover {
        color: map-get($colors, 'black');
      }
    }

    &.inverted-theme {
      &.bordered {
        border-color: map-get($colors, 'white');
        background-color: map-get($colors, 'black');
        color: map-get($colors, 'white');

        &.active,
        &:hover {
          background-color: map-get($colors, 'white');
          color: map-get($colors, 'black');
        }

        &:disabled {
          pointer-events: none;
          border-color: map-get($colors, 'gray-dark');
          color: map-get($colors, 'gray-dark');
        }
      }

      &.underline {
        color: map-get($colors, 'gray-light');

        &:hover,
        &:disabled {
          color: map-get($colors, 'gray-dark');
        }

        &:disabled {
          pointer-events: none;
        }
      }

      &.line {
        color: map-get($colors, 'gray-light');

        &.active,
        &:hover {
          color: map-get($colors, 'white');
        }
      }
    }
  }
</style>
