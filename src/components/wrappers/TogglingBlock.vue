<script>
import PopupBox from '@/components/wrappers/PopupBox.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    PopupBox,
  },
  props: {
    forceShow: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    hintText: {
      type: String,
      default: '',
    },
    caps: {
      type: Boolean,
      default: false,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isOpened: false,
    };
  },
  computed: {
    ...mapGetters('settings', [
      'isItemFormInSidebar',
    ]),
  },
  mounted() {
    if (this.forceShow) {
      this.isOpened = true;
    }
  },
  methods: {
    toggleBlockVisibility() {
      this.isOpened = !this.isOpened;
    },
  },
};
</script>

<template>
  <div
    class="toggling-block"
    :class="{ bordered }"
  >
    <div
      class="button-area"
      :class="{ opened: isOpened }"
      @click="toggleBlockVisibility"
    >
      <div class="title-section">
        <div
          class="title"
          :class="{ caps }"
        >
          {{ title }}
        </div>
        <div
          v-if="hintText"
          class="hint-area"
        >
          <PopupBox 
            button-style-type="hint"
            stop-propagation
            informational
            :position="isItemFormInSidebar ? 'upper-center' : 'right'"
          >
            {{ hintText }}
          </PopupBox>
        </div>
      </div>
      <div
        class="arrow"
        :class="{ opened: isOpened }"
      />
    </div>
    <div
      v-if="isOpened"
      class="block-content"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
  .toggling-block {
    position: relative;
    width: 100%;
    margin-bottom: 7px;
    padding: 5px;
    box-shadow: 0 3px 3px -3px map-get($colors, 'gray-light');

    &.bordered {
      padding: 5px 12px;
      box-shadow: 0 0 5px map-get($colors, 'gray-light');
      border-radius: 5px;
      transition: box-shadow 0.2s 0.2s;

      &:hover {
        box-shadow: 0 0 10px map-get($colors, 'gray-light');
      }
    }

    .button-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin: 2px;
      cursor: pointer;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .title {
      &.caps {
        font-variant-caps: all-small-caps;
        letter-spacing: 0.8px;
      }
    }

    .arrow {
      position: relative;
      width: 10px;
      height: 10px;
      transition: transform 0.3s;

      &::before,
      &::after {
        content: '';
        position: absolute;
        bottom: 3px;
        width: 10px;
        height: 10px;
        border-bottom: 2px solid map-get($colors, 'gray-light');
      }

      &::before {
        transform: rotate(45deg);
      }

      &::after {
        transform: rotate(-45deg);
      }
      
      &.opened {
        transform: rotate(180deg);
      }
    }

    .hint-area {
      position: relative;
    }

    .block-content {
      margin: 5px;
      padding: 20px 0 10px;
    }
  }
</style>
