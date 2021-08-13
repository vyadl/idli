<template>
  <div class="info-message">
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
  .info-message {
    width: 100%;
    padding: 5px 0;
    font-size: 12px;
    color: map-get($colors, 'gray-light');
  }
</style>
