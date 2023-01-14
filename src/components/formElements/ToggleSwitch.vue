<script>
//    TODO:
    
//    1)  redesign component
//        to make it more 
//        ✨ beautiful ✨

export default {
  props: {
    isChecked: {
      type: Boolean,
      default: false,
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
    title: String,
  },
  emits: ['change'],
};
</script>

<template>
  <label
    class="toggle-switch"
    :class="[
      { checked: isChecked },
      `${globalTheme}-theme`
    ]"
    @change="$emit('change')"
  >
    <div class="title"> {{ title }}</div>
    <input
      class="input"
      type="checkbox"
      :stop-propagation="stopPropagation"
      :checked="isChecked"
    >
    <div class="status">
      {{ isChecked ? 'on' : 'off' }}
    </div>
  </label>
</template>

<style lang="scss" scoped>
.toggle-switch {
  display: block;
  position: relative;
  height: 20px;
  color: map-get($colors, 'black');
  background-color: map-get($colors, 'gray-very-light');
  border: 1px solid map-get($colors, 'gray-light');
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border 0.3s;

  &:hover {
    background-color: map-get($colors, 'white');
    border: 1px solid map-get($colors, 'gray-dark');
  }

  .title {
    padding: 0 32px 0 5px;
    white-space: nowrap;
    font-size: 12px;
    font-variant: small-caps;
  }

  .status {
    position: absolute;
    bottom: 2px;
    right: 0;
    padding-right: 5px;
    font-variant: small-caps;
    font-weight: bold;
    color: map-get($colors, 'gray-dark');
    transition:
      color 0.3s,
      content 0.3s;
  }

  .input {
    position: absolute;
    top: 0;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &.checked {
    background-color: map-get($colors, 'black');
    border: 1px solid map-get($colors, 'black');

    .status {
      padding-right: 7px;
      color: map-get($colors, 'white');
    }

    .title {
      color: map-get($colors, 'gray-light');
    }
  }

  &.inverted-theme {
    color: map-get($colors, 'gray-light');
    background-color: map-get($colors, 'black');
    border: 1px solid map-get($colors, 'gray-dark');

    &:hover {
      background-color: map-get($colors, 'gray-dark');
      border: 1px solid map-get($colors, 'gray-light');
    }

    .status {
      color: map-get($colors, 'white');
    }

    .title {
      color: map-get($colors, 'gray-light');
    }

    &.checked {
      background-color: map-get($colors, 'white');
      border: 1px solid map-get($colors, 'white');

      .status {
        color: map-get($colors, 'black');
      }

      .title {
        color: map-get($colors, 'gray-dark');
      }
    }
  }
}
</style>
