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
    item: {
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
  <div class="common-deleted-item">
    <div class="title">
      {{ item.title }}
    </div>
    <div class="deleted-at">
      deleted at {{ getFormattedDate(item.deletedAt) }}
    </div>
    <div class="buttons">
      <ButtonText
        text="restore"
        small
        :disabled="disabled"
        @click="restore"
      />
      <ButtonText
        text="delete"
        style-type="underline"
        small
        :disabled="disabled"
        @click="remove"
      />
    </div>
  </div>
</template>

<style lang="scss">
  .common-deleted-item {
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

    .deleted-at {
      margin-bottom: 10px;
    }

    .buttons {
      display: flex;
      justify-content: space-between;
    }
  }
</style>
