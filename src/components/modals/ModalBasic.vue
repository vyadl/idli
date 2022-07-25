<template>
  <div 
    :class="`modal-basic ${globalTheme}-theme`"
    :style="`
        --modalWidth: ${width}px;
        --modalTop: ${top}px;
      `"
  >
    <VueFinalModal
      v-model="show"
      :name="name"
      height="auto"
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
