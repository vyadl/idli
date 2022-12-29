<script>
export default {
  props: {
    title: String,
    textStyle: {
      type: String,
      validator(value) {
        return value ? ['caps'].includes(value) : true;
      },
    },
    size: {
      type: String,
      validator(value) {
        return value ? ['small', 'big'].includes(value) : true;
      },
    },
    position: {
      type: String,
      default: 'centered',
      validator(value) {
        return value ? ['centered', 'left'].includes(value) : true;
      },
    },
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
      :class="[ textStyle, size, position ]"
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

      &.left {
        text-align: left;
      }

      &.small {
        font-size: map-get($text, 'small-title-font-size');
      }

      &.big {
        font-size: 24px;
        line-height: 1.6;
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
