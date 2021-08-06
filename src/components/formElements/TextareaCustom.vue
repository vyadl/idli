<template>
  <label class="textarea-custom">
    <div class="label">
      {{ label }}
    </div>
    <textarea
      class="textarea"
      :value="value"
      @input="input($event)"
    ></textarea>
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
  .textarea-custom {
    display: block;
    width: 100%;
    margin-bottom: 15px;

    .label {
      font-size: 13px;
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
  }
</style>
