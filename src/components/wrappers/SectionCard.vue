<script>
import PopupBox from '@/components/wrappers/PopupBox.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    PopupBox,
  },
  props: {
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
      validator(value) {
        return value
          ? ['caps'].includes(value)
          : true;
      },
    },
    size: {
      type: String,
      validator(value) {
        return value
          ? ['small', 'big'].includes(value)
          : true;
      },
    },
    position: {
      type: String,
      default: 'centered',
      validator(value) {
        return value
          ? ['centered', 'left'].includes(value)
          : true;
      },
    },
  },
  computed: {
    ...mapGetters('settings', [
      'isItemFormInSidebar',
    ]),
  },
};
</script>

<template>
  <div
    class="section-card"
    :class="`${globalTheme}-theme`"
  >
    <div class="title-section">
      <h1
        v-if="title"
        class="title"
        :class="[ textStyle, size, position ]"
      >
        {{ title }}
      </h1>
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
    <slot />
  </div>
</template>

<style lang="scss" scoped>
  .section-card {
    width: 100%;
    margin-bottom: 15px;

    .title-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .title {
      width: fit-content;
      padding: 10px 0;
      font-size: map-get($text, 'big-title-font-size');

      &.centered {
        margin: 0 auto 10px;
      }

      &.left {
        text-align: left;
      }

      &.small {
        font-size: map-get($text, 'small-title-font-size');
      }

      &.caps {
        font-variant: small-caps;
        letter-spacing: 1.8px;
        margin-bottom: 0;
      }

      &.big {
        font-size: 18px;
        line-height: 1.6;
      }
    }

    &.inverted-theme {
      .title {
        color: map-get($colors, 'white');
      }
    }
  }
</style>
