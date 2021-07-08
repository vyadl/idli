<template>
  <modal
    class="modal-basic"
    height="auto"
    :width="width"
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
      <slot name="main"/>
    </main>
    <footer>
      <slot name="buttons" />
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
    width: {
      type: Number,
      default: 500,
    }
  },
  methods: {
    open() {
      this.$emit('opened');
    },
    close() {
      this.$emit('closed');
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
