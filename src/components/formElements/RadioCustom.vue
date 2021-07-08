<template>
  <label class="radio-custom">
    <input
      type="radio"
      class="input"
      :value="value"
      :checked="isChecked"
      @change="change"
      @click="click"
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
      default: '',
    },
    label: String,
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
