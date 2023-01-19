<script>
import MultiselectExternal from '@vueform/multiselect';

export default {
  components: {
    MultiselectExternal,
  },
  props: {
    value: [Array, String],
    options: Array,
    placeholder: String,
    noOptionsText: String,
    noResultsText: String,
    showOptions: {
      type: Boolean,
      default: true,
    },
    disabled: Boolean,
    smallText: Boolean,
    mode: {
      type: String,
      default: 'single',
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    createOption: {
      type: Boolean,
      default: true,
    },
    canClear: {
      type: Boolean,
      default: true,
    },
    clearSearchTrigger: Boolean,
    appendOption: Boolean,
    newTitle: String,
  },
  emits: [
    'select',
    'deselect',
    'clear',
    'search-change',
    'finish-append-option',
  ],
  watch: {
    clearSearchTrigger(value) {
      if (value) {
        this.$refs.multiselect.clearSearch();
      }
    },
    appendOption(value) {
      if (value) {
        this.$refs.multiselect.select({ value: this.newTitle });
        this.$emit('finish-append-option');
      }
    },
  },
  methods: {
    select(tag) {
      this.$emit('select', tag);
    },
    deselect(tag) {
      this.$emit('deselect', tag);
    },
    clear() {
      this.$emit('clear');
    },
    searchChange(option) {
      this.$emit('search-change', option);
    },
  },
};
</script>

<template>
  <MultiselectExternal
    ref="multiselect"
    :class="[
      `${globalTheme}-theme`,
      { 'small-text': smallText },
      { 'with-hint': !noResultsText }
    ]"
    :value="value"
    :mode="mode"
    :placeholder="placeholder"
    :no-options-text="noOptionsText"
    :no-results-text="noResultsText"
    :options="options"
    :show-options="showOptions"
    :searchable="searchable"
    :create-option="createOption"
    :can-clear="canClear"
    :disabled="disabled"
    :clear-on-blur="false"
    :add-option-on="[false]"
    @select="option => select(option)"
    @deselect="option => deselect(option)"
    @clear="clear"
    @search-change="option => searchChange(option)"
  >
    <template #beforelist>
      <slot name="beforelist" />
    </template>
  </MultiselectExternal>
</template>

<style lang="scss">
@import "../../../node_modules/@vueform/multiselect/themes/default.css";

.multiselect {
  border-color: map-get($colors, 'gray-light');

  &.is-active {
    box-shadow: none;
    border-color: map-get($colors, 'gray-dark');
  }

  &-placeholder {
    font-size: 14px;
    color: map-get($colors, 'gray-light');
  }

  &-single-label {
    font-size: 14px;
  }

  &-tag {
    padding: 2px 2px 2px 6px;
    background: map-get($colors, 'gray-dark');
    color: map-get($colors, 'white');
    font-size: 13px;
    font-weight: normal;
    max-width: 100%;
    white-space: normal;
    overflow-wrap: anywhere;

    &.is-disabled {
      background: map-get($colors, 'gray-light');
    }
  }

  &-tag-remove {
    &:hover {
      background: map-get($colors, 'gray-light'); 
    }
  }

  &-tags-search-wrapper {
    padding-top: 10px;
  }

  &-dropdown {
    border: 1px solid map-get($colors, 'gray-dark');
    border-top: none;
  }

  &-option {
    font-size: 14px;

    &.is-selected {
      background: map-get($colors, 'black');

      &.is-pointed,
      &.is-disabled {
        background: map-get($colors, 'gray-dark');
      }
    }
  }

  &-no-results,
  &-no-options {
    font-size: 12px;
  }

  &.with-hint {
    .multiselect {
      &-no-results,
      &-no-options {
        display: none;
      }
    }
  }

  &.small-text {
    font-size: 12px;

    .multiselect {
      &-option {
        font-size: 12px;
      }
    }
  }

  &.inverted-theme {
    background: map-get($colors, 'black');
    color: map-get($colors, 'white');

    &.multiselect {
      border-color: map-get($colors, 'gray-dark');

      &.is-active {
        border-color: map-get($colors, 'gray-light');
      }
    }

    .multiselect {
      &-tag {
        background: map-get($colors, 'gray-very-light');
        color: map-get($colors, 'black');
      }

      &-tags-search,
      &-dropdown,
      &-search {
        background: map-get($colors, 'black');
        color: map-get($colors, 'white');
      }

      &-dropdown {
        border-color: map-get($colors, 'gray-light');
      }

      &-tag-remove {
        &:hover {
          background: map-get($colors, 'gray-light'); 
        }
      }

      &-clear-icon {
        &:hover {
          background: map-get($colors, 'white');
        }
      }

      &-option {
        &.is-pointed {
          background: map-get($colors, 'gray-dark');
          color: map-get($colors, 'white');
        }

        &.is-selected {
          background: map-get($colors, 'white');
          color: map-get($colors, 'black');

          &.is-pointed,
          &.is-disabled {
            background: map-get($colors, 'gray-light');
          }
        }
      }
    }      
  }
}
</style>
