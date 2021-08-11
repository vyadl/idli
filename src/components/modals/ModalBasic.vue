<template>
  <modal
    class="modal-basic"
    height="auto"
    :width="width"
    :name="name"
    @before-open="beforeOpen"
    @before-close="beforeClose($event)"
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
    <footer class="footer">
      <slot name="buttons" />
    </footer>
  </modal>
</template>

<script>

export default {
  props: {
    name: String,
    width: {
      type: Number,
      default: 500,
    },
    headerText: {
      type: String,
      default: '',
    },
  },
  methods: {
    beforeOpen() {
      this.$emit('before-open');
    },
    beforeClose(event) {
      this.$emit('before-close', event);
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
      padding: 25px;
    }

    .header,
    .main {
      margin-bottom: 10px;
    }

    .footer {
      display: flex;
      justify-content: center;
    }
  }
</style>
