<template>
  <label
    class="checkbox-custom"
    :class="[
      styleType,
      { 'invert-theme': isInvert },
    ]"
  >
    <input
      class="input"
      type="checkbox"
      :value="value"
      :checked="isChecked"
      @change="change"
    >
    <div
      class="label"
      :title="title"
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
    styleType: {
      type: String,
      default: 'custom',
    },
    title: {
      type: String,
      default: '',
    },
    value: Number,
    modelValue: {
      default: false,
    },
    trueValue: {
      default: true,
    },
    falseValue: {
      default: false,
    },
  },
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

        this.$emit('change', newValue);
      } else {
        this.$emit('change', isChecked ? this.trueValue : this.falseValue);
      }
    },
  },
};
</script>

<style lang="scss">
  .checkbox-custom {
    display: block;
    width: fit-content;
    margin-bottom: 10px;
    margin-right: 7px;
    cursor: pointer;

    &:last-of-type {
      margin-right: 0;
    }

    .input {
      display: none;
    }

    &.custom {
      .input {
        &:checked {
          &+.label {
            background-color: map-get($colors, 'black');
            color: map-get($colors, 'white');
          }
        }
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

        &:hover {
          background-color: map-get($colors, 'black');
          color: map-get($colors, 'white');
        }
      }
    }

    &.classic {
      .input {
        &:checked {
          &+.label {
            &::after {
              opacity: 1;
            }
          }
        }
      }

      .label {
        position: relative;
        margin-left: 25px;
        background-color: transparent;

        &::before,
        &::after {
          content: '';
          position: absolute;
          top: 0;
        }

        &::before {
          top: 50%;
          left: -25px;
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
          transform: translateY(-50%) translate(4px, -1px) rotate(-45deg);
          transition: opacity .2s;
        }
      }
    }

    &.invert-theme {
      &.custom {
        .input {
          &:checked {
            &+.label {
              background-color: map-get($colors, 'white');
              color: map-get($colors, 'black');
            }
          }
        }

        .label {
          border-color: map-get($colors, 'white');
          background-color: map-get($colors, 'black');
          color: map-get($colors, 'white');

          &:hover {
            background-color: map-get($colors, 'white');
            color: map-get($colors, 'black');
          }
        }
      }

      &.classic {
        .label {
          color: map-get($colors, 'white');

          &::before,
          &::after {
            border-color: map-get($colors, 'white');
          }
        }
      }
    }
  }
</style>
