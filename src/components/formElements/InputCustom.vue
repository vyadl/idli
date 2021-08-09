<template>
  <label class="input-custom second">
    <div class="label">
      {{ label }}
    </div>
    <input
      class="input"
      :type="type"
      :value="value"
      :required="required"
      @input="input($event)"
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
  },
};
</script>

<style lang="scss">
  .input-custom {
    display: block;
    width: 100%;
    margin-bottom: 15px;

    &.first {
      .label {
        margin-bottom: 15px;
      }

      .input {
        width: 100%;
        padding: 5px;
        border-bottom: 1px solid map-get($colors, 'gray-1');
        outline: 8px solid transparent;
        background-color: transparent;
        transition:
          outline .2s,
          background-color .2s;

        &:focus {
          outline-color: map-get($colors, 'gray-4');
          background-color: map-get($colors, 'gray-4');
        }
      }
    }

    &.second {
      .label {
        font-size: 13px;
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
  }
</style>
