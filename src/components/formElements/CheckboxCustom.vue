<script>
export default {
  props: {
    label: String,
    styleType: {
      type: String,
      default: 'custom',
      validator(value) {
        return value
          ? ['custom', 'initial'].includes(value)
          : true;
      },
    },
    size: {
      type: String,
      validator(value) {
        return value
          ? ['small'].includes(value)
          : true;
      },
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
      size,
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
    overflow-wrap: anywhere;
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

    .label {
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    &.custom {
      .label {
        border: 2px solid map-get($colors, 'black');
        border-radius: 25px;
        padding: 5px 10px 6px;
        background-color: map-get($colors, 'white');
        font-size: 14px;
        transition:
          background-color 0.2s,
          color 0.2s,
          border-color 0.2s;

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
            background-color: map-get($colors, 'gray-light');
            border-color: map-get($colors, 'gray-light');
            color: map-get($colors, 'white');
          }
        }

        &:hover {
          border-color: map-get($colors, 'gray-light');
          color: map-get($colors, 'gray-light');
        }
      }
    }

    &.initial {
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

      &.small {
        .label {
          font-size: 11px;
          margin-left: 25px;

          &::before {
            border-width: 1px;
            left: -21px;
            width: 12px;
            height: 12px;
          }

          &::after {
            border-width: 1px;
            left: -17px;
            width: 6px;
            height: 4px;
          }
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
              background-color: map-get($colors, 'gray-dark');
              border-color: map-get($colors, 'gray-dark');
              color: map-get($colors, 'black');
            }
          }

          &:hover {
            border-color: map-get($colors, 'gray-dark');
            color: map-get($colors, 'gray-dark');
          }
        }
      }

      &.initial {
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
