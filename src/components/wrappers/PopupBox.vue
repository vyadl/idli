<script>
import ButtonSign from '@/components/formElements/ButtonSign.vue';

export default {
  components: {
    ButtonSign,
  },
  props: {
    stopPropagation: {
      type: Boolean,
      default: false,
    },
    popupStyleType: {
      type: String,
      default: 'bordered',
      validator(value) {
        return value
          ? ['bordered'].includes(value)
          : true;
      },
    },
    buttonStyleType: {
      type: String,
      default: 'hint',
      validator(value) {
        return value
          ? ['hint', 'info', 'plus', 'loupe'].includes(value)
          : true;
      },
    },
    contentType: {
      type: String,
      default: 'informational',
      validator(value) {
        return value
          ? ['informational', 'functional'].includes(value)
          : true;
      },
    },
    position: {
      type: String,
      default: 'right',
      validator(value) {
        return value
          ? ['right',
            'left',
            'lower-left',
            'upper-right',
            'upper-center',
            'lower-center']
            .includes(value)
          : true;
      },
    },
  },
  emits: ['close'],
  data() {
    return {
      isShown: false,
    };
  },
  beforeUnmount() {
    document.removeEventListener('click', this.validatePopUpClosing);
  },
  methods: {
    validatePopUpClosing(event) {
      const target = document.querySelector('.popup-content');

      if (
        (event.target !== target && !target.contains(event.target))
        || this.contentType === 'functional'
      ) {
        this.closePopUp();
      }
    },
    openPopUp() {
      this.isShown = true;
      document.addEventListener('click', this.validatePopUpClosing);
    },
    closePopUp() {
      this.isShown = false;
      document.removeEventListener('click', this.validatePopUpClosing);
    },
    togglePopUp() {
      this[this.isShown ? 'closePopUp' : 'openPopUp']();
    },
  },
};
</script>

<template>
  <div class="popup">
    <ButtonSign
      class="toggling-button"
      :style-type="buttonStyleType"
      :active="isShown"
      :stop-propagation="stopPropagation"
      @click="togglePopUp"
    />
    <Transition>
      <div
        v-if="isShown"
        class="popup-content"
        :class="[
          popupStyleType,
          contentType,
          position,
          `${globalTheme}-theme`,
        ]"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  position: relative;

  .popup-content {
    position: absolute;
    z-index: 15;
    width: 200px;
    background-color: map-get($colors, 'white');
    border: 1px solid map-get($colors, 'gray-light');

    &.bordered {
      padding: 7px 10px;
    }

    &.right {
      top: 0;
      left: 30px;
    }

    &.left {
      top: -5px;
      right: 130%;
    }

    &.lower-left {
      top: 25px;
      right: 0;
    }

    &.lower-center {
      right: -100px;
      top: 25px;
    }

    &.upper-right {
      bottom: -10px;
      left: 30px;
    }

    &.upper-center {
      left: -100px;
      bottom: 25px;
    }

    &.informational {
      overflow-wrap: break-word;
      color: map-get($colors, 'gray-dark');
      font-size: 12px;
    }

    &.functional {
      display: flex;
      flex-direction: column;
      width: fit-content;
      white-space: nowrap;
    }

    &.inverted-theme {
      background-color: map-get($colors, 'black');

      &.informational {
        color: map-get($colors, 'gray-light');
        font-size: 12px;
      }
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
