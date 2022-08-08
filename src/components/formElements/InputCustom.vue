<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    modelValue: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    paddingRight: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    'input',
    'update:modelValue',
  ],

  methods: {
    input(value) {
      this.$emit('input', value);
      this.$emit('update:modelValue', value);
    },
    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>

<template>
  <label
    class="input-custom"
    :class="[
      `${globalTheme}-theme`,
      { disabled },
    ]"
  >
    <div class="label">
      {{ label }}
    </div>
    <input
      class="input"
      :class="{ 'padding-right' : paddingRight }"
      :type="type"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :placeholder="placeholder"
      @input="input($event.target.value)"
      ref="input"
    >
  </label>
</template>

<style lang="scss">
  .input-custom {
    display: block;
    width: 100%;
    margin-bottom: 15px;

    &.disabled {
      pointer-events: none;
    }

    .label {
      font-size: 12px;
      color: map-get($colors, 'gray-dark');
    }

    .input {
      width: 100%;
      padding: 9px 3px 4px;
      border-bottom: 1px solid map-get($colors, 'gray-light');
      transition: border-color .3s;

      &.padding-right {
        padding-right: 20px;
      }

      &:focus {
        border-color: map-get($colors, 'black');
      }
    }

    &.inverted-theme {
      .label {
        color: map-get($colors, 'gray-light');
      }

      .input {
        border-color: map-get($colors, 'gray-dark');
        color: map-get($colors, 'white');

        &:focus {
          border-color: map-get($colors, 'white');
        }
      }
    }
  }
</style>
