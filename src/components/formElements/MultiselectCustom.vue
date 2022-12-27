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
    createTag: {
      type: Boolean,
      default: true,
    },
    canClear: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'select',
    'deselect',
    'clear',
  ],
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
  },
};
</script>

<template>
  <MultiselectExternal
    :class="[
      `${globalTheme}-theme`,
      { 'small-text': smallText },
    ]"
    :value="value"
    :mode="mode"
    :placeholder="placeholder"
    :no-options-text="noOptionsText"
    :options="options"
    :searchable="searchable"
    :create-tag="createTag"
    :can-clear="canClear"
    :disabled="disabled"
    @select="tag => select(tag)"
    @deselect="tag => deselect(tag)"
    @clear="clear"
  />
</template>

<style lang="scss">
@import "../../../node_modules/@vueform/multiselect/themes/default.css";

.multiselect {
  &.is-active {
    box-shadow: 0 0 3px 2px map-get($colors, 'gray-light');
  }

  &-placeholder {
    font-size: 14px;
    color: map-get($colors, 'gray-light');
  }

  &-search {
    font-size: 14px;
  }

  &-tags {
    padding: 5px;
  }

  &-tag {
    padding: 4px 2px 4px 6px;
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
    padding-top: 15px;
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

      &-tag-remove {
        &:hover {
          background: map-get($colors, 'gray-dark'); 
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
