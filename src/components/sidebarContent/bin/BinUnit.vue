<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import { getFormattedDate } from '@/utils/misc';

export default {
  components: {
    ButtonText,
  },
  props: {
    type: {
      type: String,
      default: null,
    },
    unit: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'restore',
    'delete',
  ],
  computed: {
    unitTitle() {
      return this.unit.title || 'Untitled';
    },
  },
  methods: {
    restore() {
      this.$emit('restore');
    },
    remove() {
      this.$emit('delete');
    },
    getFormattedDate(val) {
      return getFormattedDate(val);
    },
  },
};
</script>

<template>
  <div
    class="bin-unit"
    :class="`${globalTheme}-theme`"
  >
    <div
      class="title"
      :class="{ untitled: !unit.title }"
    >
      {{ unitTitle }}
    </div>
    <div class="deleted-at">
      deleted at {{ getFormattedDate(unit.deletedAt) }}
    </div>
    <div class="buttons">
      <ButtonText
        text="restore"
        size="small"
        :disabled="disabled"
        @click="restore"
      />
      <ButtonText
        text="delete"
        style-type="underline"
        size="small"
        :disabled="disabled"
        @click="remove"
      />
    </div>
    <br><hr>
  </div>
</template>

<style lang="scss">
  .bin-unit {
    font-size: 12px;
    margin-bottom: 15px;
    opacity: 0.8;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }

    .title {
      margin-bottom: 10px;
      font-weight: bold;
    }

    .untitled {
      color: map-get($colors, 'gray-light');
    }

    .deleted-at {
      margin-bottom: 10px;
    }

    .buttons {
      display: flex;
      justify-content: space-between;
    }

    &.inverted-theme {
      .untitled {
        color: map-get($colors, 'gray-dark');
      }
    }
  }
</style>
