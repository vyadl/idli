<script>
export default {
  props: {
    to: Object,
    title: String,
    target: String,
    withArrow: Boolean,
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
    <router-link
      :to="to"
      :target="target"
    >
      {{ title }} 
    </router-link>
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
  color: map-get($colors, 'black');

  // .external-link {
  //   background-image: url('/icons/external-link.svg');
  //   background-size: contain;
  //   width: 15px;
  //   height: 15px;
  //   margin-left: 8px;
  //   filter: invert(40%);
  //   transition: filter 0.2s;

  //   &:hover,
  //   &.active {
  //     filter: invert(0%);
  //   }
  // }
  
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
      width: 7px;
      height: 7px;
      border-right: 1px solid map-get($colors, 'gray-light');
      border-top: 1px solid map-get($colors, 'gray-light');
      transform: translate(-7px, 7px) rotate(45deg);
    }
  }

  &.small {
    font-size: 13px;
    color: map-get($colors, 'gray-dark');

    .arrow {
      &::after {
        width: 6px;
        height: 6px;
        transform: translate(-5px, 8px) rotate(45deg);
      }
    }
  }

  &:hover {
    .arrow {
      opacity: 1;
    }
  }

  &.inverted-theme {
    color: map-get($colors, 'white');

    &.small {
      color: map-get($colors, 'gray-light');
    }

    .arrow {
      color: map-get($colors, 'gray-dark');

      &::after {
        border-right-color: map-get($colors, 'gray-dark');
        border-top-color: map-get($colors, 'gray-dark');
      }
    }
  }
}
</style>
