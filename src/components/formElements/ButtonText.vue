<template>
  <button
    type="button"
    class="button-text"
    :class="styleType"
    @click="$emit('click')"
  >{{ text }}</button>
</template>

<script>
export default {
  props: {
    styleType: String,
    text: String,
  },
};
</script>

<style lang="scss">
  .button-text {
    margin: 3px;
    padding: 5px 8px;
    font-size: 12px;
    letter-spacing: .3px;
    cursor: pointer;
    transition: opacity .2s;

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
