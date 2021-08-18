<template>
  <modal
    class="modal-basic"
    :class="{ 'invert-theme': isInvert }"
    :name="name"
    height="auto"
    :width="width"
    :scrollable="true"
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

    .vm--overlay {
      background: rgba(map-get($colors, 'black'), 0.4);
    }

    .vm--modal {
      padding: 28px;
      box-shadow: 0 10px 90px -30px map-get($colors, 'black');
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

    &.invert-theme {
      .vm--overlay {
        background: rgba(map-get($colors, 'black'), 0.7);
      }

      .vm--modal {
        border: 2px solid map-get($colors, 'white');
        background-color: map-get($colors, 'black');
        box-shadow: none;
        color: map-get($colors, 'white');
      }
    }
  }
</style>
