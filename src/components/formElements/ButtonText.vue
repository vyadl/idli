<template>
  <button
    class="button-text"
    :class="[
      styleType,
      {
        active,
        'invert-theme': isInvert,
      }
    ]"
    :type="type"
    :title="title"
    :disabled="disabled"
    @click="click($event)"
  >{{ text }}</button>
</template>

<script>
export default {
  props: {
    styleType: {
      type: String,
      default: 'bordered',
    },
    active: {
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
    text: String,
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
        color .2s .05s;

      &.active,
      &:hover {
        background-color: map-get($colors, 'black');
        color: map-get($colors, 'white');
      }

      &:disabled {
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

      &:hover,
      &:disabled {
        color: map-get($colors, 'gray-light');
      }
    }

    &.line {
      padding: 5px 0;
      color: map-get($colors, 'black');
      transition: color .2s;

      &.active,
      &:hover {
        color: map-get($colors, 'gray-dark');
      }
    }

    &.invert-theme {
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
      }

      &.line {
        color: map-get($colors, 'white');

        &.active,
        &:hover {
          color: map-get($colors, 'gray-light');
        }
      }
    }
  }
</style>
