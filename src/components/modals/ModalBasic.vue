<template>
  <div :class="`modal-basic ${globalTheme}-theme`">
    <VueFinalModal
      v-model="showModal"
      :name="name"
      :z-index="50"
      :esc-to-close="true"
      transition="modal"
      @before-open="open"
      @closed="close"
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
        <Transition name="fade">
          <template v-if="showInner">
            <slot />
          </template>
        </Transition>
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
    showModal: false,
    showInner: false,
  }),
  components: {
    VueFinalModal,
  },
  methods: {
    ...mapActions({
      _setModalNameToShow: '_setModalNameToShow',
    }),
    open() {
      this.showInner = true;
    },
    close() {
      this._setModalNameToShow('');
      setTimeout(() => {
        this.showInner = false;
      }, 300);
    },
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
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 100%;
        width: 100%;
        height: 100px;
      }
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
