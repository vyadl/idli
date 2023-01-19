<script>
export default {
  props: {
    to: Object,
    title: String,
    target: String,
    withArrow: Boolean,
    withExternalLink: Boolean,
  },
};
</script>

<template>
  <span class="custom-link">
    <router-link
      :to="to"
      :target="target"
    >
      {{ title }} 
    </router-link>
    <router-link
      v-if="withExternalLink"
      class="external-link"
      :to="to"
      target="_blank"
    />
    <!-- <ButtonSign
        style-type="external-link"
      /> -->
    <div
      v-if="withArrow"
      class="arrow"
    >
      —
    </div>
  </span>
</template>

<style lang="scss">
.custom-link {
  position: relative;
  // display: flex;

  .external-link {
    background-image: url('/icons/external-link.svg');
    background-size: contain;
    width: 15px;
    height: 15px;
    margin-left: 8px;
    filter: invert(40%);
    transition: filter 0.2s;

    &:hover,
    &.active {
      filter: invert(0%);
    }
  }
  
  .arrow {
    position: relative;
    display: inline;
    padding-left: 3px;
    width: 10px;
    height: 10px;
    color: map-get($colors, 'gray-light');
    opacity: 0;
    transition: opacity 0.2s;

    &::after {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      border-right: 1px solid map-get($colors, 'gray-light');
      border-top: 1px solid map-get($colors, 'gray-light');
      transform: translate(-7px, 6px) rotate(45deg);
    }
  }

  &:hover {
    .arrow {
      opacity: 1;
    }
  }
}
</style>
