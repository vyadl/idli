<script>
export default {
  props: {
    label: String,
    small: {
      type: Boolean,
      default: false,
    },
    styleType: {
      type: String,
      default: 'custom',
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
  emits: ['update:modelValue', 'click'],
  computed: {
    isChecked() {
      return this.modelValue === this.value;
    },
  },
  methods: {
    change() {
      this.$emit('update:modelValue', this.value);
    },
    click() {
      this.$emit('click');
    },
  },
};
</script>

<template>
  <label
    class="radio-custom"
    :class="[
      styleType,
      `${globalTheme}-theme`,
      { disabled },
    ]"
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
    <span
      class="title"
      :class="{
        small,
        disabled,
        checked: isChecked,
      }"
    >
      {{ label }}
    </span>
  </label>
</template>

<style lang="scss">
  .radio-custom {
    cursor: pointer;

    &.disabled {
      pointer-events: none;
    }

    .title {
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    &.initial {
      display: flex;

      .title {
        padding-left: 5px;
      }

      .small {
        font-size: 13px;
      }
    }

    &.custom {
      display: block;
      padding-bottom: 20px;
      margin-right: 7px;

      &:last-of-type {
        margin-right: 0;
      }

      .title {
        border: 2px solid map-get($colors, 'black');
        border-radius: 25px;
        padding: 5px 10px 6px;
        background-color: map-get($colors, 'white');
        font-size: 14px;
        transition:
          background-color 0.2s,
          color 0.2s,
          border-color 0.2s;

        &:last-of-type {
          margin-right: 0;
        }

        &.small {
          padding: 3px 7px 4px;
          font-size: 12px;
        }

        &.disabled {
          border-color: map-get($colors, 'gray-light');
          background-color: map-get($colors, 'transparent');
          color: map-get($colors, 'gray-light');

          &.checked {
            background-color: map-get($colors, 'gray-light');
          }
        }

        &.checked {
          background-color: map-get($colors, 'black');
          border-color: map-get($colors, 'black');
          color: map-get($colors, 'white');

          &:hover {
            background-color: map-get($colors, 'gray-dark');
            border-color: map-get($colors, 'gray-dark');
            color: map-get($colors, 'white');
          }
        }

        &:hover {
          border-color: map-get($colors, 'gray-light');
          color: map-get($colors, 'gray-light');
        }
      }

      .input {
        display: none;
      }
    }

    &.inverted-theme {
      &.custom {
        .title {
          border-color: map-get($colors, 'white');
          background-color: map-get($colors, 'black');

          &.disabled {
            border-color: map-get($colors, 'gray-dark');
            background-color: map-get($colors, 'transparent');
            color: map-get($colors, 'gray-dark');

            &.checked {
              background-color: map-get($colors, 'gray-dark');
            }
          }

          &.checked {
            background-color: map-get($colors, 'white');
            color: map-get($colors, 'black');

            &:hover {
              background-color: map-get($colors, 'gray-light');
              border-color: map-get($colors, 'gray-light');
              color: map-get($colors, 'black');
            }
          }

          &:hover {
            border-color: map-get($colors, 'gray-dark');
            color: map-get($colors, 'gray-dark');
          }
        }
      }
    }
  }
</style>
