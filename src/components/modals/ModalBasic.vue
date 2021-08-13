<template>
  <modal
    class="modal-basic"
    height="auto"
    :width="width"
    :scrollable="true"
    :name="name"
    @before-open="beforeOpen"
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
      padding: 28px;
    }

    .header {
      margin-bottom: 20px;
      text-align: center;
      font-size: map-get($text, 'title-font-size');
    }

    .main {
      margin-bottom: 25px;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
  }
</style>
