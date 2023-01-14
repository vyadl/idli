<script>
import InputCustom from '@/components/formElements/InputCustom.vue';

export default {
  components: {
    InputCustom,
  },
  props: {
    modelValue: String,
    label: {
      type: String,
      default: 'password',
    },
  },
  emits: [
    'input',
    'update:modelValue',
  ],
  data() {
    return {
      isPasswordShown: true,
      inputType: 'password',
    };
  },

  methods: {
    togglePassword() {
      this.isPasswordShown = !this.isPasswordShown;
      this.inputType = this.isPasswordShown ? 'password' : 'text';
    },
    input(value) {
      this.$emit('input', value);
      this.$emit('update:modelValue', value);
    },
  },
};
</script>

<template>
  <div class="password-field">
    <InputCustom
      padding-right
      :label="label"
      :type="inputType"
      :model-value="modelValue"
      required
      with-additional-element
      @input="input"
    />
    <div class="eye-button">
      <img 
        alt="show password"
        :width="20"
        :src="isPasswordShown ? '/icons/eye-closed.svg' : '/icons/eye-open.svg'" 
        @click="togglePassword"
      >
    </div>
  </div>
</template>

<style lang="scss">
.password-field {
  position: relative;
  width: 100%;
  
  .eye-button {
    display: block;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(-25%, -50%);
    cursor: pointer;
  }
}
</style>
