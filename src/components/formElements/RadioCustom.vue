<template>
  <label
    class="radio-custom"
    :class="`${globalTheme}-theme`"
  >
    <input
      class="input"
      type="radio"
      :value="value"
      :disabled="disabled"
      :checked="isChecked"
      @change="change"
      @click="click"
    >
    <div
      class="label"
      :class="{
        small,
        disabled,
        checked: isChecked,
      }"
    >
      {{ label }}
    </div>
  </label>
</template>

<script>
export default {
  model: {
    prop: 'modelValue',
    event: 'change',
  },
  props: {
    label: String,
    small: {
      type: Boolean,
      default: false,
    },
    value: [Number, String],
    modelValue: {
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isChecked() {
      return this.modelValue === this.value;
    },
  },
  methods: {
    change() {
      this.$emit('change', this.value);
    },
    click() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss">
  .radio-custom {
    display: block;
    width: fit-content;
    margin-bottom: 10px;
    margin-right: 7px;
    cursor: pointer;

    .input {
      display: none;
    }

    .label {
      border: 2px solid map-get($colors, 'black');
      border-radius: 25px;
      padding: 5px 10px 6px;
      background-color: map-get($colors, 'white');
      font-size: 14px;
      transition:
        background-color .3s .05s,
        color .2s .05s;

      &:last-of-type {
        margin-right: 0;
      }

      &.small {
        padding: 3px 7px 4px;
        font-size: 12px;
      }

      &.disabled {
        &.checked {
          background-color: map-get($colors, 'gray-light');
        }

        border-color: map-get($colors, 'gray-light');
        background-color: map-get($colors, 'transparent');
        color: map-get($colors, 'gray-light');
      }

      &.checked,
      &:hover {
        background-color: map-get($colors, 'black');
        color: map-get($colors, 'white');
      }
    }

    &.inverted-theme {
      .label {
        border-color: map-get($colors, 'white');
        background-color: map-get($colors, 'black');

        &.disabled {
          &.checked {
            background-color: map-get($colors, 'gray-dark');
          }

          border-color: map-get($colors, 'gray-dark');
          background-color: map-get($colors, 'transparent');
          color: map-get($colors, 'gray-dark');
        }

        &.checked,
        &:hover {
          background-color: map-get($colors, 'white');
          color: map-get($colors, 'black');
        }
      }
    }
  }
</style>
