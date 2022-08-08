<script>
export default {
  props: {
    message: String,
  },
};
</script>

<template>
  <div class="error-message">
    {{ message }}
  </div>
</template>

<style lang="scss">
  .error-message {
    width: 100%;
    padding: 5px 0;
    font-size: 13px;
    color: map-get($colors, 'error-text');
  }
</style>
