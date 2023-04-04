<script>
import { mapActions } from 'vuex';
import DropdownMenu from '@/components/functionElements/DropdownMenu.vue';

export default {
  components: {
    DropdownMenu,
  },
  computed: {
    itemActions() {
      return [
        {
          name: 'copy item link',
          method: this._copySingleItemLink,
        },
        {
          name: 'open item in new tab',
          method: this._openSingleItemInNewTab,
        },
      ];
    },
  },
  methods: {
    ...mapActions('items', [
      '_copySingleItemLink',
      '_openSingleItemInNewTab',
    ]),
  },
};
</script>

<template>
  <div class="item-actions-menu">
    <DropdownMenu :options="itemActions" />
  </div>
</template>

<style lang="scss">
  .item-actions-menu {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding-top: 10px;
  }
</style>
