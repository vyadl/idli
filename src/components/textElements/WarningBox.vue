<script>
export default {
  props: {
    message: String,
  },
};
</script>

<template>
  <div
    class="warning-box"
    :class="`${globalTheme}-theme`"
  >
    {{ message }}
  </div>
</template>

<style lang="scss">
  .warning-box {
    padding: 15px;
    margin: 10px;
    border: 1px solid map-get($colors, 'gray-dark');
    box-shadow: 4px 4px map-get($colors, 'gray-dark');

    &.inverted-theme {
      border-color: map-get($colors, 'gray-light');
      box-shadow: 4px 4px map-get($colors, 'gray-light');
    }
  }
</style>
