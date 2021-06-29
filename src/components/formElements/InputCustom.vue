<template>
  <label class="input-custom">
    <div class="label">
      {{ label }}
    </div>
    <input
      type="text"
      class="input"
      :value="value"
      @input="input($event)"
    >
  </label>
</template>

<script>
export default {
  props: {
    label: String,
    value: String,
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

    .label {
      margin-bottom: 10px;
    }

    .input {
      width: 100%;
      padding: 5px;
      border-bottom: 1px solid map-get($colors, 'gray-1');
      outline: 6px solid map-get($colors, 'gray-4');
      background-color: map-get($colors, 'gray-4');
      transition:
        outline .2s,
        background-color .2s;

      &:focus {
        outline-color: transparent;
        background-color: transparent;;
      }
    }
  }
</style>
