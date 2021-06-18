<template>
  <button
    class="button-icon"
    @click="$emit('click')"
  ><img
    class="icon"
    :src="icon" width="25px"
  ></button>
</template>

<script>
export default {
  props: {
    icon: String,
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

    .icon {
      display: block;
    }
  }
</style>
