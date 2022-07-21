<template>
  <label
    class="textarea-custom"
    :class="`${globalTheme}-theme`"
  >
    <div class="label">
      {{ label }}
    </div>
    <textarea
      class="textarea"
      rows="4"
      :value="modelValue"
      :disabled="disabled"
      @input="input($event)"
    ></textarea>
  </label>
</template>

<script>
export default {
  props: {
    label: String,
    modelValue: String,
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
      width: 100%;
      padding: 5px;
      border-bottom: 1px solid map-get($colors, 'gray-light');
      transition: border-color .3s;

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
