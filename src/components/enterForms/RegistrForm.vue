<template>
  <form>
    <InputCustom
      label="name"
      v-model="name"
    />
    <InputCustom
      type="email"
      label="e-mail"
      v-model="email"
    />
    <InputCustom
      type="password"
      label="password"
      v-model="password"
    />
    <InputCustom
      type="password"
      label="repeat password"
      v-model="passwordToCheck"
      @input="checkPassword"
    />
    <div v-if="!isPasswordConfirmed"> wrong password </div>
    <ButtonText
      style-type="bordered"
      text="registrate"
      :disabled="!isPasswordConfirmed"
    />
  </form>
</template>

<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';

export default {
  components: {
    InputCustom,
    ButtonText,
  },
  data: () => ({
    user: {
      name: null,
      email: null,
      password: null,
      passwordToCheck: null,
    },
  }),
  computed: {
    isPasswordConfirmed() {
      return this.user.password === this.user.passwordToCheck;
    },
  },
};
</script>

<style lang="scss">
</style>
