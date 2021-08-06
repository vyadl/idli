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
    padding: 5px 3px;
    font-size: 13px;
    color: map-get($colors, 'error-text');
  }
</style>
