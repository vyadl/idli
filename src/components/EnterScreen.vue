<template>
  <div class="enter-screen">
    <img
      class="logo"
      src="/icons/logo.svg"
    >
    <div class="buttons-container">
      <ButtonText
        text="sign up"
        stop-propagation
        @click="_openSidebar('sign up')"
      />
      <div>|</div>
      <ButtonText
        text="sign in"
        stop-propagation
        @click="_openSidebar('sign in')"
      />
    </div>
  </div>
</template>

<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    ButtonText,
  },
  methods: {
    ...mapActions({
      _openSidebar: '_openSidebar',
    }),
  },
};
</script>

<style lang="scss">
  .enter-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .logo {
      display: block;
      width: 400px;
      margin-bottom: 20px;
    }

    .buttons-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
