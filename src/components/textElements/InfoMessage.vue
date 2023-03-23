<script>
export default {
  props: {
    message: String,
    big: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <div 
    class="info-message"
    :class="[
      { big },
      `${globalTheme}-theme`,
    ]"
  >
    {{ message }}
  </div>
</template>

<style lang="scss">
  .info-message {
    width: 100%;
    padding: 5px 0;
    font-size: 12px;
    color: map-get($colors, 'gray-light');
    
    &.big {
      font-size: 18px;
    }

    .inverted-theme {
      color: map-get($colors, 'gray-dark');
    }
  }
</style>
