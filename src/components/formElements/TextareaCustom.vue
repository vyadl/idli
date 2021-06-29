<template>
  <label class="textarea-custom">
    <div class="label">
      {{ label }}
    </div>
    <textarea
      class="textarea"
      :value="value"
      @input="change($event)"
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
    change(event) {
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
      margin-bottom: 10px;
    }

    .textarea {
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
