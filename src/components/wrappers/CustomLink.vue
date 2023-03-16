<script>
export default {
  props: {
    to: Object,
    title: String,
    titleInHtml: Boolean,
    newTab: Boolean,
    size: {
      type: String,
      validator(value) {
        return value
          ? ['small'].includes(value)
          : true;
      },
    },
  },
};
</script>

<template>
  <span
    class="custom-link"
    :class="[ size, `${globalTheme}-theme` ]"
  >
    <a
      v-if="titleInHtml"
      class="link-content"
      @click.stop.prevent="$router.push(to)"
      v-html="title"
    />
    <a
      v-else
      @click.stop.prevent="$router.push(to)"
    >
      {{ title }} 
    </a>
    <div
      v-if="newTab"
      class="new-tab-icon"
    />
  </span>
</template>

<style lang="scss">
.custom-link {
  position: relative;
  color: map-get($colors, 'black');
  cursor: pointer;

  .link-content {
    text-decoration: underline;
  }

  .new-tab-icon {
    position: relative;
    display: inline-block;
    top: 2px;
    left: 7px;
    background-image: url('/icons/external-link.svg');
    background-size: contain;
    width: 15px;
    height: 15px;
    filter: invert(50%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    .new-tab-icon {
      opacity: 1;
    }
  }

  &.small {
    font-size: 13px;
    color: map-get($colors, 'gray-dark');
  }

  &.inverted-theme {
    color: map-get($colors, 'white');

    &.small {
      color: map-get($colors, 'gray-light');
    }
  }
}
</style>
