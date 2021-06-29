<template>
  <button
    type="button"
    class="button-icon"
    @click="$emit('click')"
  ><img
    class="icon"
    :src="`/icons/${iconName}.svg`"
  ></button>
</template>

<script>
export default {
  props: {
    iconName: String,
  },
};
</script>

<style lang="scss">
  .button-icon {
    margin-bottom: 5px;
    padding: 5px;
    font-size: 14px;
    background-color: transparent;
    cursor: pointer;

    &.active {
      background-color: map-get($colors, 'gray-4');
    }

    .icon {
      display: block;
      width: 25px;
    }
  }
</style>
