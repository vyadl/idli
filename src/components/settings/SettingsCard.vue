<template>
  <div class="settings-card">
    <div class="title">
      {{ title }}
    </div>
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
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      margin-bottom: 10px;
      font-size: 14px;
      color: #333;
    }
  }
</style>
