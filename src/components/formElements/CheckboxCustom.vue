<template>
  <label class="checkbox-custom">
    <input
      type="checkbox"
      class="input"
      :value="value"
      :checked="isChecked"
      @change="change"
    >
    <div class="label">
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
      default: true
    },
    falseValue: {
      default: false
    }
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
    cursor: pointer;

    .input {
      display: none;

      &:checked {
        &+.label {
          background-color: map-get($colors, 'gray-1');
        }
      }
    }

    .label {
      padding: 5px;
      background-color: map-get($colors, 'gray-3');
    }
  }
</style>
