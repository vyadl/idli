<template>
  <label class="input-custom">
    <div class="label">
      {{ label }}
    </div>
    <input
      class="input"
      :type="type"
      :value="value"
      :required="required"
      @input="input($event)"
      ref="input"
    >
  </label>
</template>

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
    value: String,
    required: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    input(event) {
      this.$emit('input', event.target.value);
    },
    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>

<style lang="scss">
  .input-custom {
    display: block;
    width: 100%;
    margin-bottom: 15px;

    .label {
      font-size: 12px;
      color: map-get($colors, 'gray-dark');
    }

    .input {
      width: 100%;
      padding: 9px 3px 4px;
      border-bottom: 1px solid map-get($colors, 'gray-light');
      transition: border-color .3s;

      &:focus {
        border-color: map-get($colors, 'black');
      }
    }
  }
</style>
