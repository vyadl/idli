<template>
  <modal
    class="modal-basic"
    :class="`${globalTheme}-theme`"
    :name="name"
    height="auto"
    :width="width"
    scrollable
    transition="modal"
    @closed="_setModalNameToShow('')"
  >
    <header
      class="header"
      v-if="title"
    >
      <h1 class="title">
        {{ title }}
      </h1>
    </header>
    <main class="main">
      <slot />
    </main>
  </modal>
</template>

<script>

import { mapActions } from 'vuex';

export default {
  props: {
    name: String,
    width: {
      type: Number,
      default: 500,
    },
    title: {
      type: String,
      default: '',
    },
    isFooterShown: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    ...mapActions({
      _setModalNameToShow: '_setModalNameToShow',
    }),
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

    &.inverted-theme {
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
