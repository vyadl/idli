<script>
export default {
  props: {
    label: String,
    modelValue: String,
    placeholder: String,
    rows: Number,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    input(event) {
      this.$emit('update:modelValue', event.target.value);
    },
  },
};
</script>

<template>
  <label
    class="textarea-custom"
    :class="[
      `${globalTheme}-theme`,
      { disabled },
    ]"
  >
    <div class="label">
      {{ label }}
    </div>
    <textarea
      class="textarea"
      :rows="rows"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="input($event)"
    />
  </label>
</template>

<style lang="scss">
  .textarea-custom {
    display: block;
    width: 100%;
    margin-bottom: 15px;

    .label {
      font-size: 12px;
      color: map-get($colors, 'gray-dark');
    }

    .textarea {
      resize: vertical;
      width: 100%;
      padding: 5px;
      border-bottom: 1px solid map-get($colors, 'gray-light');
      transition: border-color 0.3s;

      &:focus {
        border-color: map-get($colors, 'black');
      }
    }

    &.inverted-theme {
      .label {
        color: map-get($colors, 'gray-light');
      }

      .textarea {
        border-color: map-get($colors, 'gray-dark');
        color: map-get($colors, 'white');

        &:focus {
          border-color: map-get($colors, 'white');
        }
      }
    }
  }
</style>
