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
      validator(value) {
        return value 
          ? ['text', 'number', 'password', 'email'].includes(value)
          : true;
      },
    },
    styleType: {
      type: String,
      validator(value) {
        return value 
          ? ['unbordered'].includes(value)
          : true;
      },
    },
    modelValue: String,
    icon: String,
    width: Number,
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
    withAdditionalElement: {
      type: Boolean,
      default: false,
    },
    isFocus: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'input',
    'update:modelValue',
    'blur',
  ],
  mounted() {
    if (this.isFocus) {
      this.$nextTick(() => this.focus());
    }
  },
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
      { disabled, 'with-additional-element': withAdditionalElement },
      styleType,
    ]"
    :style="`width: ${width}px;`"
  >
    <div class="label">
      {{ label }}
    </div>
    <input
      ref="input"
      class="input"
      :type="type"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :placeholder="placeholder"
      @input="input($event.target.value)"
      @blur="$emit('blur')"
    >
    <div
      v-if="icon"
      class="icon-wrapper"
    >
      <img 
        :src="icon"
        alt="icon"
        class="icon"
      >
    </div>
  </label>
</template>

<style lang="scss">
  .input-custom {
    display: block;
    width: 100%;
    max-width: 300px;
    margin-bottom: 15px;

    &.disabled {
      pointer-events: none;

      .input {
        color: map-get($colors, 'gray-light');
      }
    }

    &.unbordered {
      margin-bottom: 0;

      .input {
        padding: 0;
        border: none;
      }
    }

    &.with-additional-element {
      .input {
        padding-right: 45px;
      }
    }

    .label {
      font-size: 12px;
      color: map-get($colors, 'gray-dark');
    }

    .input {
      width: 100%;
      padding: 9px 3px 4px;
      border-bottom: 1px solid map-get($colors, 'gray-light');
      transition: border-color 0.3s;

      &:focus {
        border-color: map-get($colors, 'black');
      }
    }

    .icon-wrapper {
      position: relative;
      width: 100%;
    }

    .icon {
      display: block;
      position: absolute;
      width: 17px;
      top: 50%;
      transform: translate(-20%, -140%);
      right: 0;
    }

    &.inverted-theme {
      .label {
        color: map-get($colors, 'gray-light');
      }

      &.disabled {
        .input {
          color: map-get($colors, 'gray-dark');
        }
      }

      .input {
        border-color: map-get($colors, 'gray-dark');
        color: map-get($colors, 'white');

        &:focus {
          border-color: map-get($colors, 'white');
        }
      }

      .icon {
        filter: invert(100%);
      }
    }
  }
</style>
