<template>
  <div :class="`modal-basic ${globalTheme}-theme`">
    <VueFinalModal
      v-model="show"
      :name="name"
      height="auto"
      :z-index="50"
      :esc-to-close="true"
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
    </VueFinalModal>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { VueFinalModal } from 'vue-final-modal';

export default {
  props: {
    name: String,
    title: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    show: false,
  }),
  components: {
    VueFinalModal,
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
    .vfm__container,
    .vfm__overlay {
      left: auto;
      right: 0;
      width: 100vw;
    }

    .vfm__container {
      overflow: auto;
    }

    .vfm__overlay {
      background: rgba(map-get($colors, 'black'), 0.4);
    }

    .vfm__content {
      padding: 28px;
      box-shadow: 0 10px 90px -30px map-get($colors, 'black');
      background-color: map-get($colors, 'white');
      width: 500px;
      position: absolute;
      left: 50%;
      top: 30px;
      transform: translateX(-50%);
    }

    .header {
      margin-bottom: 20px;
      text-align: center;
      font-size: map-get($text, 'title-font-size');
    }

    &.inverted-theme {
      .vfm__overlay {
        background: rgba(map-get($colors, 'black'), 0.7);
      }

      .vfm__content {
        border: 2px solid map-get($colors, 'white');
        background-color: map-get($colors, 'black');
        box-shadow: none;
        color: map-get($colors, 'white');
      }
    }
  }
</style>
