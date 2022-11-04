<script>
export default {
  props: {
    title: String,
    small: Boolean,
    centered: Boolean,
    caps: Boolean,
  },
};
</script>

<template>
  <div
    class="section-card"
    :class="`${globalTheme}-theme`"
  >
    <h1
      v-if="title"
      class="title"
      :class="{ small, centered, caps }"
    >
      {{ title }}
    </h1>
    <slot />
  </div>
</template>

<style lang="scss">
  .section-card {
    width: 100%;
    margin-bottom: 15px;

    &>.title {
      width: fit-content;
      padding: 10px 0;
      font-size: map-get($text, 'big-title-font-size');
      &.centered {
        margin: 0 auto 10px;
      }
      &.small {
        font-size: map-get($text, 'small-title-font-size');
      }
      &.caps {
        font-variant-caps: all-small-caps;
        letter-spacing: 1.8px;
        margin-bottom: 0;
      }
    }

    &.inverted-theme {
      .title {
        color: map-get($colors, 'white');
      }
    }
  }
</style>
