<template>
  <modal
    class="modal-basic"
    width="300"
    height="auto"
    :name="name"
    @opened="open"
    @closed="close"
  >
    <header
      class="header"
      v-if="headerText"
    >
      <h1 class="title">
        {{ headerText }}
      </h1>
    </header>
    <main class="main">
      <slot />
    </main>
    <footer class="footer">
      <ButtonText
        style-type="bordered"
        :text="confirmation ? 'yes' : isNewElement ? 'add' : 'change'"
        @click="submit"
      />
      <ButtonText
        style-type="bordered"
        text="cancel"
        @click="cancel"
      />
      <ButtonText
        style-type="bordered"
        text="delete"
        v-if="!isNewElement && !confirmation"
        @click="deleteElement"
      />
    </footer>
  </modal>
</template>

<script>
import ButtonText from '@/components/formElements/ButtonText.vue';

export default {
  components: {
    ButtonText,
  },
  props: {
    name: String,
    headerText: String,
    isNewElement: Boolean,
    confirmation: Boolean,
  },
  methods: {
    open() {
      this.$emit('opened');
    },
    close() {
      this.$emit('closed');
    },
    submit() {
      this.$emit('submit');
    },
    cancel() {
      this.$emit('cancel');
    },
    deleteElement() {
      this.$emit('delete');
    },
  },
};
</script>

<style lang="scss">
  .modal-basic {
    &.vm--container,
    .vm--overlay {
      left: auto;
      right: 0;
      width: 100vw;
    }

    .vm--modal {
      padding: 15px;
    }

    .header,
    .main {
      margin-bottom: 10px;
    }
  }
</style>
