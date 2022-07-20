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

<script>
import ButtonText from '@/components/formElements/ButtonText.vue';

export default {
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
  components: {
    ButtonText,
  },
  emits: ['restore', 'delete'],
  methods: {
    restore() {
      this.$emit('restore');
    },
    remove() {
      this.$emit('delete');
    },
    getFormattedDate(val) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      };

      return new Intl.DateTimeFormat('en', options).format(new Date(val));
    },
  },
};
</script>

<style lang="scss">
  .common-deleted-item {
    font-size: 12px;
    margin-bottom: 15px;
    opacity: .8;
    transition: opacity .2s;

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
