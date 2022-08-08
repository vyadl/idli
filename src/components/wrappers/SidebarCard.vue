<script>
export default {
  props: {
    title: String,
  },
};
</script>

<template>
  <div
    class="sidebar-card"
    :class="`${globalTheme}-theme`"
  >
    <h1 class="title">
      {{ title }}
    </h1>
    <slot />
  </div>
</template>

<style lang="scss">
  .sidebar-card {
    width: 100%;
    margin-bottom: 25px;

    &>.title {
      width: fit-content;
      margin: 0 auto 20px;
      font-size: map-get($text, 'title-font-size');
    }

    &.inverted-theme {
      .title {
        color: map-get($colors, 'white');
      }
    }
  }
</style>
