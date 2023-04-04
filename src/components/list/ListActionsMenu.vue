<script>
import { mapActions, mapGetters } from 'vuex';
import DropdownMenu from '@/components/functionElements/DropdownMenu.vue';
import { isConfirmed } from '@/settings/confirmationPromise';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    DropdownMenu,
  },
  props: {
    list: {
      type: Object,
      required: true,
    },
    buttonSize: String,
  },
  data() {
    return {
      requestHandling: {
        isRequestProcessing: false,
      },
    };
  },
  computed: {
    ...mapGetters('lists', [
      'lists',
    ]),
    listActions() {
      return [
        {
          name: 'edit list',
          method: this.openModalForEdittingList,
        },
        {
          name: this.list.isPrivate ? 'make public' : 'make private',
          method: this.toggleListPrivateField,
        },
        {
          name: 'open list as public',
          method: this.openListAsPublic,
          isHidden: this.list.isPrivate,
        },
        {
          name: 'copy list link',
          method: this.copyListLink,
          isHidden: this.list.isPrivate,
        },
        {
          name: 'delete list',
          method: this.deleteList,
        },
      ];
    },
    activeActions() {
      return this.listActions.filter(action => !action.isHidden);
    },
  },
  methods: {
    ...mapActions('lists', [
      '_setEdittingListObj',
      '_updateList',
      '_deleteList',
    ]),
    openModalForEdittingList() {
      this._setEdittingListObj(this.list);
      this.$vfm.show('listModal');
    },
    toggleListPrivateField() {
      this.requestHandling.isRequestProcessing = true;

      const request = this._updateList({
        isPrivate: !this.list.isPrivate,
        title: this.list.title,
        tags: this.list.tags,
        categories: this.list.categories,
        id: this.list.id,
      });

      handleRequestStatuses(request, this.requestHandling);
    },
    openListAsPublic() {
      window.open(`${window.location.origin}/list/${this.list.id}?view=public`, '_blank');
    },
    copyListLink() {
      navigator.clipboard.writeText(`${window.location.origin}/list/${this.list.id}`);
    },
    async deleteList() {
      const confirmationText = `are you sure you want to delete list  
        '${this.list.title}' ?`;
      const additionalText = 'this will delete all child lists as well';
      const isListHasChildLists = this.lists
        .filter(list => list.parentListId === this.list.id)
        .length;

      const confirmationModalTitle = isListHasChildLists
        ? `${confirmationText} ${additionalText}`
        : confirmationText;

      const isRejected = !await isConfirmed(confirmationModalTitle);

      if (isRejected) {
        return false;
      }

      this.requestHandling.isRequestProcessing = true;

      const request = this._deleteList(this.list.id);

      handleRequestStatuses(request, this.requestHandling);
    },
  },
};
</script>

<template>
  <div class="list-actions-menu">
    <DropdownMenu
      :options="activeActions"
      :button-size="buttonSize"
    />
  </div>
</template>
