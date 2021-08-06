<template>
  <label
    class="checkbox-custom"
    :class="styleType"
  >
    <input
      type="checkbox"
      class="input"
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
    value: Number,
    modelValue: {
      default: false,
    },
    label: String,
    trueValue: {
      default: true,
    },
    falseValue: {
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    styleType: {
      type: String,
      default: 'custom',
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
        padding: 3px 7px 5px;
        background-color: map-get($colors, 'white');
        font-size: 13px;
        transition: background-color .3s;

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
        margin-left: 22px;
        background-color: transparent;

        &::before,
        &::after {
          content: '';
          position: absolute;
          top: 0;
        }

        &::before {
          top: 50%;
          left: -22px;
          width: 14px;
          height: 14px;
          border: 2px solid map-get($colors, 'gray-light');
          border-radius: 3px;
          transform: translateY(-50%) translateY(1px);
        }

        &::after {
          top: 50%;
          left: -22px;
          width: 19px;
          height: 15px;
          border-left: 2px solid map-get($colors, 'black');
          border-bottom: 2px solid map-get($colors, 'black');
          opacity: 0;
          transform: translateY(-50%) translate(-1px, -8px) rotate(-45deg);
          transition: opacity .2s;
        }
      }
    }
  }
</style>
