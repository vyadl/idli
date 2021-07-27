<template>
  <div class="settings-card">
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
  .settings-card {
    width: 100%;

    .title {
      width: fit-content;
      margin: 0 auto 15px;
      font-size: 14px;
      color: #333;
    }
  }
</style>
