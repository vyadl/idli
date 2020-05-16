<template>
  <div 
    class="settings"
    :class="{'settings--invert': isInvert}"
  >
    <div 
      class="settings__menu"
      :class="{'settings__menu--active': isSettingActive}"
    >
      <div 
        class="settings__menu-item settings__menu-item--add"
        @click="_startCreatingItem"
      ></div>
      <div 
        class="settings__menu-item settings__menu-item--filters"
        :class="{'settings__menu-item--active': settingsStatuses.filters}"
        @click="_switchSettingStatus('filters')"
      ></div>
      <div 
        class="settings__menu-item settings__menu-item--visualization"
        :class="{'settings__menu-item--active': settingsStatuses.visualization}"
        @click="_switchSettingStatus('visualization')"
      ></div>
      <div 
        class="settings__menu-item settings__menu-item--tests"
        :class="{'settings__menu-item--active': settingsStatuses.tests}"
        @click="_switchSettingStatus('tests')"
      >t</div>
      <div 
        class="settings__menu-item settings__menu-item--lists"
        :class="{'settings__menu-item--active': settingsStatuses.lists}"
        @click="_switchSettingStatus('lists')"
      >l</div>
    </div>
    <transition name="fade">
      <div
        class="settings__body"
        v-if="isSettingActive"
      >
        <filters
          v-if="settingsStatuses.filters" 
          key="filters"></filters>
        <visualization 
          v-if="settingsStatuses.visualization"
          key="visualization"
        ></visualization>
        <tests 
          v-if="settingsStatuses.tests"
          key="tests"
        ></tests>
        <lists 
          v-if="settingsStatuses.lists"
          key="lists"
        ></lists>
      </div>
    </transition>
  </div>
</template>

<script>
import Filters from './Filters.vue';
import Visualization from './Visualization.vue';
import Tests from './Tests.vue';
import Lists from './Lists.vue';
import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'Settings',
    components: {
      Filters,
      Visualization,
      Tests,
      Lists,
    },

    computed: {
      ...mapGetters(['activeItem', 'isChangingActive', 'isSettingActive', 'settingsStatuses', 'isInvert']),
    },

    methods: {
      ...mapActions(['_startCreatingItem', '_setSettingsStatus', '_switchSettingStatus'])
    },
  }
</script>

<style lang="scss">
.settings {
  position: relative;
  z-index: 100;
  color: #000;
  &--invert {
    .settings {
      &__menu {
        color: #fff;
        &::before {
          background-color: #000;
        }
      }
    }
  }

  &__body {
    user-select: none;
    padding: 10px;
    position: fixed;
    z-index: 2;
    width: 170px;
    right: -10px;
    top: 90px;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(#666, .4);
    border-radius: 3px; 
    transition: .2s transform ease-in-out;
  }
  &__menu {
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    z-index: 2;
    padding: 15px;
    opacity: .8;
    transition: .2s opacity;
    &--active {
      opacity: 1;
    }
    &:hover {
      opacity: 1;
    }

    &::before {
      content: '';
      z-index: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #fff;
      filter: blur(7px);
    }
  }

  &__menu-item {
    cursor: pointer;
    position: relative;
    transition: .2s opacity, .2s box-shadow;
    opacity: .7;
    margin: 0 8px;
    padding: 8px;
    line-height: 0;
    border: 2px solid transparent;
    &--active {
      opacity: 1;
      box-shadow: 0 0 3px rgba(#666, .4);
    }
    &:hover {
      opacity: 1;
    }
    
    &::after,
    &::before {
      content: '';
      position: absolute;
      background-color: #333;
    }
    &--add {
      &::before {
        width: 2px;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &::after {
        width: 100%;
        height: 2px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &--filters {
      &::before {
        content: '...';
        font-size: 14px;
        text-align: center;
        position: absolute;
        top: 40%;
        left: 50%;
        line-height: 0;
        transform: translate(-50%, -50%);
        background-color: transparent;
      }   
    }
    &--tests {
      &::before {
        content: '';
        font-size: 12px;
        text-align: center;
        position: absolute;
        top: 40%;
        left: 50%;
        line-height: 0;
        transform: translate(-50%, -50%);
        background-color: transparent;
      }   
    }
    &--visualization {
      &::before,
      &::after {
        position: absolute;
        border-radius: 50%;
      }

      &::before {
        width: 3px;
        height: 3px;
        bottom: 10%;
        left: 10%;
      }

      &::after {
        width: 5px;
        height: 5px;
        top: 20%;
        right: 10%;
      }
    }
  }
}
</style>