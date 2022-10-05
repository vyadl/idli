<script>
export default {
  props: {
    label: String,
    defaultOption: String,
    defaultOptionSelected: Boolean,
    customOptionSelected: [Number, String],
    options: Array,
    disabled: Boolean,
  },
  emits: ['update:modelValue'],
  watch: {
    options(value) {
      console.log(value);
    },
  },
  methods: {
    change(value) {
      this.$emit('update:modelValue', value);
    },
  },
};
</script>

<template>
  <div class="select-custom">
    <label
      v-if="label"
      for="select"
      class="label"
    >
      {{ label }}
    </label>
    <select
      id="select"
      name="select"
      class="select"
      :disabled="disabled"
      @change="change($event.target.value)"
    >
      <option 
        class="default-option"
        :selected="defaultOptionSelected"
      >
        {{ defaultOption }}
      </option>
      <template v-if="options">
        <option
          v-for="option in options"
          v-show="(typeof option.id) !== 'undefined'"
          :key="option.id"
          :value="option.id"
          :selected="option.id === customOptionSelected"
        >
          {{ option.title }}
        </option>
      </template>
      <slot v-else />
    </select>
  </div>
</template>

<style lang="scss">
  .select-custom {
    .label {
      padding-right: 15px;
    }

    .select {
      width: 120px;
      border: none;
      border-bottom: 1px solid map-get($colors, 'gray-light');
      font-size: 13px;
      font-family: inherit;

      &:focus-visible {
        outline: none;
      }
    }

    .default-option {
      font-style: italic;
      color: map-get($colors, 'gray-light');
    }
  }
</style>
