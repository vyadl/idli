<script>
import { mapMutations } from 'vuex';
import { VueFinalModal } from 'vue-final-modal';

export default {
  components: {
    VueFinalModal,
  },
  props: {
    name: String,
    title: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 500,
    },
    top: {
      type: Number,
      default: 30,
    },
  },
  data: () => ({
    showModal: false,
    showInner: false,
  }),
  methods: {
    ...mapMutations([
      'setModalNameToShow',
    ]),
    open() {
      this.showInner = true;
    },
    close() {
      this.setModalNameToShow('');
      setTimeout(() => {
        this.showInner = false;
      }, 300);
    },
  },
};
</script>

<template>
  <div
    :class="`modal-basic ${globalTheme}-theme`"
    :style="`
        --modalWidth: ${width}px;
        --modalTop: ${top}px;
      `"
  >
    <VueFinalModal
      v-model="showModal"
      :name="name"
      :z-index="50"
      :esc-to-close="true"
      :lock-scroll="false"
      :focus-retain="false"
      transition="modal"
      @before-open="open"
      @closed="close"
    >
      <header
        v-if="title"
        class="header"
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
      width: var(--modalWidth);
      position: absolute;
      left: 50%;
      top: var(--modalTop);
      transform: translateX(-50%);
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 100%;
        width: 100%;
      }
    }

    .header {
      margin-bottom: 20px;
      text-align: center;
      font-size: map-get($text, 'big-title-font-size');
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

  @media #{breakpoints.$s-media} {
    .modal-basic {
      .vfm__content {
        width: 300px;
      }
    }
  }
</style>
