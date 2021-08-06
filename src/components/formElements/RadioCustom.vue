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
    margin-right: 7px;
    cursor: pointer;

    &:last-of-type {
      margin-right: 0;
    }

    .input {
      display: none;

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
</style>
