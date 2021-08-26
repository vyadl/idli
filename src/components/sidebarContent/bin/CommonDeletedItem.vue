<template>
  <div class="common-deleted-item">
    <div class="title">
      {{ item.title }}
    </div>
    <div class="deleted-at">
      {{ item.deletedAt | getFormattedDate }}
    </div>
    <div class="buttons">
      <ButtonText
        text="restore"
        small
        @click="restore"
      />
      <ButtonText
        text="delete"
        style-type="underline"
        small
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
  },
  filters: {
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
  components: {
    ButtonText,
  },
  methods: {
    restore() {
      this.$emit('restore');
    },
    remove() {
      this.$emit('delete');
    },
  },
};
</script>

<style lang="scss">
  .common-deleted-item {
    font-size: 12px;
    margin-bottom: 15px;

    .title {
      margin-bottom: 10px;
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
