<script>
export default {
  props: {
    label: String,
    styleType: {
      type: String,
      default: 'custom',
    },
    title: {
      type: String,
      default: '',
    },
    value: [Number, Boolean],
    modelValue: {
      default: false,
    },
    trueValue: {
      default: true,
    },
    falseValue: {
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    isChecked() {
      if (this.modelValue instanceof Array) {
        return this.modelValue.includes(this.value);
      }

      return this.modelValue === this.trueValue;
    },
  },
  methods: {
    change(event) {
      const isChecked = event.target.checked;

      if (this.modelValue instanceof Array) {
        const newValue = [...this.modelValue];

        if (isChecked) {
          newValue.push(this.value);
        } else {
          newValue.splice(newValue.indexOf(this.value), 1);
        }

        this.$emit('update:modelValue', newValue);
      } else {
        this.$emit('update:modelValue', isChecked ? this.trueValue : this.falseValue);
      }
    },
  },
};
</script>

<template>
  <label
    class="checkbox-custom"
    :class="[
      styleType,
      disabled,
      `${globalTheme}-theme`,
    ]"
  >
    <input
      class="input"
      type="checkbox"
      :value="value"
      :disabled="disabled"
      :checked="isChecked"
      @change="change"
    >
    <div
      class="label"
      :class="{
        disabled: disabled,
        checked: isChecked,
      }"
      :title="title"
    >
      {{ label }}
    </div>
  </label>
</template>

<style lang="scss">
  .checkbox-custom {
    display: block;
    width: fit-content;
    margin-bottom: 10px;
    margin-right: 7px;
    cursor: pointer;

    &.disabled {
      pointer-events: none;
    }

    &:last-of-type {
      margin-right: 0;
    }

    .input {
      display: none;
    }

    &.custom {
      .label {
        border: 2px solid map-get($colors, 'black');
        border-radius: 25px;
        padding: 5px 10px 6px;
        background-color: map-get($colors, 'white');
        font-size: 14px;
        transition:
          background-color 0.3s .05s,
          color 0.2s .05s;

        &.disabled {
          &.checked {
            background-color: map-get($colors, 'gray-light');
          }

          border-color: map-get($colors, 'gray-light');
          background-color: map-get($colors, 'transparent');
          color: map-get($colors, 'gray-light');
        }

        &.checked {
          background-color: map-get($colors, 'black');
          color: map-get($colors, 'white');
          &:hover {
            background-color: map-get($colors, 'gray-dark');
          }
        }
        &:hover {
          background-color: map-get($colors, 'gray-light');
          color: map-get($colors, 'white');
        }
      }
    }

    &.classic {
      .label {
        position: relative;
        margin-left: 30px;
        background-color: transparent;

        &.disabled {
          color: map-get($colors, 'gray-light');

          &::before,
          &::after {
            border-color: map-get($colors, 'gray-light');
          }
        }

        &.checked {
          &::after {
            opacity: 1;
          }
        }

        &::before,
        &::after {
          content: '';
          position: absolute;
          top: 0;
        }

        &::before {
          top: 50%;
          left: -30px;
          width: 18px;
          height: 18px;
          border: 2px solid map-get($colors, 'black');
          border-radius: 2px;
          transform: translateY(-50%);
        }

        &::after {
          top: 50%;
          left: -25px;
          width: 10px;
          height: 7px;
          border-left: 2px solid map-get($colors, 'black');
          border-bottom: 2px solid map-get($colors, 'black');
          opacity: 0;
          transform-origin: center center;
          transform: translateY(-50%) translate(-1px, -1px) rotate(-45deg);
          transition: opacity 0.2s;
        }
      }
    }

    &.inverted-theme {
      &.custom {
        .label {
          border-color: map-get($colors, 'white');
          background-color: map-get($colors, 'black');
          color: map-get($colors, 'white');

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

      &.classic {
        .label {
          color: map-get($colors, 'white');

          &.disabled {
            color: map-get($colors, 'gray-dark');

            &::before,
            &::after {
              border-color: map-get($colors, 'gray-dark');
            }
          }

          &::before,
          &::after {
            border-color: map-get($colors, 'white');
          }
        }
      }
    }
  }
</style>
