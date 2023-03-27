<script>
export default {
  props: {
    message: String,
    big: {
      type: Boolean,
      default: false,
    },
    textStyle: {
      type: String,
      validator(value) {
        return value
          ? ['caps'].includes(value)
          : true;
      },
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
      textStyle,
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

    &.caps {
      font-variant: small-caps;
      letter-spacing: 1.8px;
      margin-bottom: 0;
    }

    .inverted-theme {
      color: map-get($colors, 'gray-dark');
    }
  }
</style>
