<template>
  <label
    class="radio-custom"
    :class="{ 'invert-theme': isInvert }"
  >
    <input
      class="input"
      type="radio"
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
    label: String,
    value: [Number, String],
    modelValue: {
      default: '',
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

    &.invert-theme {
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
  }
</style>
