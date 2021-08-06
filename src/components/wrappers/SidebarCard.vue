<template>
  <div class="sidebar-card">
    <h1 class="title">
      {{ title }}
    </h1>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
};
</script>

<style lang="scss">
  .sidebar-card {
    width: 100%;

    .title {
      width: fit-content;
      margin: 0 auto 15px;
      font-size: map-get($text, 'title-font-size');
      color: map-get($colors, 'black');
    }
  }
</style>
