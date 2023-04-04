<script>
import PopupBox from '@/components/wrappers/PopupBox.vue';
import ListActionsMenu from '@/components/list/ListActionsMenu.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    PopupBox,
    ListActionsMenu,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    bordered: Boolean,
    listForMenu: Object,
    titleClickMethod: Function,
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
    <div
      v-if="title"
      class="title-section"
    >
      <div
        class="title-with-menu"
        :class="[ position ]"
      >
        <div
          v-if="listForMenu"
          class="menu-button"
        >
          <ListActionsMenu
            :list="listForMenu"
            button-size="big"
          />
        </div>
        <h1
          v-if="title"
          class="title"
          :class="[
            textStyle,
            size, {
              bordered,
              clickable: titleClickMethod,
            }]"
          @click="titleClickMethod"
        >
          {{ title }}
        </h1>
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

    .menu-button {
      position: absolute;
      top: 10px;
      left: -17px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .title-with-menu {
      position: relative;
      display: flex;
      align-items: center;
      gap: 5px;

      &.centered {
        margin: 0 auto 10px;
      }

      &.left {
        text-align: left;
      }

      &:hover {
        .menu-button {
          opacity: 1;
        }
      }
    }

    .title {
      width: fit-content;
      padding: 10px 0 7px;
      font-size: map-get($text, 'big-title-font-size');

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

      &.bordered {
        padding-bottom: 5px;
        border-bottom: 2px solid map-get($colors, 'black');
      }

      &.clickable {
        cursor: pointer;
      }
    }

    &.inverted-theme {
      .title {
        color: map-get($colors, 'white');

        &.bordered {
          padding-bottom: 6px;
          border-bottom: 2px solid map-get($colors, 'white');
        }
      }
    }
  }
</style>
