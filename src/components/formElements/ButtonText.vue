<template>
  <button
    class="button-text"
    :class="[styleType, { 'active': active }]"
    :type="type"
    :disabled="disabled"
    @click="click"
  >{{ text }}</button>
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
    text: String,
  },
  methods: {
    click() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss">
  .button-text {
    margin: 3px;
    padding: 5px 12px 7px;
    text-align: left;
    vertical-align: middle;
    line-height: 1.3;
    font-size: 12px;
    letter-spacing: .3px;
    cursor: pointer;
    transition: opacity .2s;

    &.active {
      opacity: .85;
    }

    &.solid {
      border-radius: 3px;
      background-color: map-get($colors, 'black');
      color: map-get($colors, 'white');
    }

    &.bordered {
      border: 3px solid map-get($colors, 'gray-2');
    }

    &.underline {
      border-bottom: 1px solid map-get($colors, 'gray-2');
    }

    &:hover {
      opacity: .7;
    }
  }
</style>
