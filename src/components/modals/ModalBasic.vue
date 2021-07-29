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
    <footer class="footer">
      <slot name="buttons" />
    </footer>
  </modal>
</template>

<script>

export default {
  props: {
    name: String,
    headerText: String,
    width: {
      type: Number,
      default: 500,
    },
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