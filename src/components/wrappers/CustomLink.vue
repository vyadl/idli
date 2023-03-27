<script>
export default {
  props: {
    to: Object,
    title: String,
    newTab: Boolean,
    size: {
      type: String,
      validator(value) {
        return value
          ? ['small'].includes(value)
          : true;
      },
    },
    stopPropagation: {
      type: Boolean,
      default: true,
    },
    preventDefault: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['click'],
  methods: {
    click(event) {
      if (this.stopPropagation) {
        event.stopPropagation();
      }

      if (this.preventDefault) {
        event.preventDefault();
      }

      if (this.newTab) {
        window.open(this.generateHref(), '_blank');
      } else {
        this.$router.push(this.to);
      }

      this.$emit('click');
    },
    generateHref() {   
      let href = `${window.location.origin}/list`;

      if (this.to.params) {
        const params = Object.values(this.to.params).join('/');

        href += `/${params}`;
      }

      if (this.to.query) {
        const queryArray = Object.entries(this.to.query).map(entry => `${entry[0]}=${entry[1]}`);

        href += `?${queryArray.join('&')}`;
      }

      return href;
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
      class="link-content"
      @click="click"
      v-html="title"
    />
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
