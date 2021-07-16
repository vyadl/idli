<template>
  <div class="error-message">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: String,
  },
};
</script>

<style lang="scss">
  .error-message {
    width: 100%;
    padding: 8px;
    font-size: 10px;
    background-color: map-get($colors, 'error-background');
    color: map-get($colors, 'error-text');
  }
</style>
