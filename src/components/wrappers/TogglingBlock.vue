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
    textStyle: {
      type: String,
      default: 'caps',
      validator(value) {
        return value ? ['caps'].includes(value) : true;
      },
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
  <div class="toggling-block">
    <div
      class="button-area"
      :class="{ opened: isOpened }"
      @click="toggleBlockVisibility"
    >
      <div class="title-section">
        <div
          class="title"
          :class="[ textStyle ]"
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
    padding-top: 15px;

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
      padding: 20px 0 10px;
    }
  }
</style>
