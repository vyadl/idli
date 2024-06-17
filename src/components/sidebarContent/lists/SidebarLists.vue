<script>
import SectionCard from '@/components/wrappers/SectionCard.vue';
import ListActionsMenu from '@/components/list/ListActionsMenu.vue';
import ListWithChildLists from '@/components/sidebarContent/lists/ListWithChildLists.vue';
import TestData from '@/components/sidebarContent/lists/TestData.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { sortByDate } from '@/utils/sorting';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    SectionCard,
    ListActionsMenu,
    ListWithChildLists,
    TestData,
    ButtonText,
  },
  props: {
    isSidebarBreakpointReached: Boolean,
  },
  data: () => ({
    requestHandling: {
      isRequestProcessing: false,
    },
    listRequests: [],
  }),
  computed: {
    ...mapGetters('appearance', [
      'isMobileScreen',
    ]),
    ...mapGetters('lists', [
      'lists',
      'currentListId',
      'edittingListObj',
      'currentListObj',
      'isOwnerView',
    ]),
    rootLists() {
      return this.lists.filter(list => !list.parentListId);
    },
    isRootListsMode() {
      return !this.childListsForCurrentList
        && !this.currentListObj?.parentListId;
    },
    childListsForCurrentList() {
      let childLists = [];

      if (this.currentListObj) {
        childLists = this.lists.filter(list => list.parentListId === this.currentListObj.id);
      }

      return childLists.length ? childLists : null;
    },
    parentList() {
      const value = this.currentListObj.lists?.length
        ? this.currentListObj
        : this.lists.find(list => list.id === this.currentListObj.parentListId);

      return value;
    },
    sortedLists() {
      return sortByDate(this.rootLists, 'updatedAt');
    },
  },
  methods: {
    ...mapMutations([
      'decreaseExplicitRequestsNumber',
    ]),
    ...mapMutations('lists', [
      'setParentListIdForNewList',
    ]),
    ...mapActions('items', [
      '_addNewItemPlaceholder',
    ]),
    ...mapActions('lists', [
      '_fetchListById',
    ]),
    ...mapActions([
      '_resetCustomView',
    ]),
    openModal(name, parentListId) {
      if (parentListId) {
        this.setParentListIdForNewList(parentListId);
      }

      this.$vfm.show(name);
    },
    fetchListById(id) {
      this.requestHandling.isRequestProcessing = true;

      if (this.listRequests.length) {
        this.listRequests.forEach(request => {
          request.cancel();
        });
      }

      if (this.$route.name !== 'list') {
        this.$router.push({ name: 'list', params: { id } });
      }

      const source = this.$config.axios.CancelToken.source();

      this.listRequests.push(source);
      this._resetCustomView();

      const request = this._fetchListById({ id, cancelToken: source.token });

      handleRequestStatuses(request, this.requestHandling, { onlyFinally: true })
        .finally(() => {
          const index = this.listRequests.findIndex(listRequest => listRequest === source);

          this.listRequests.splice(index, 1);
        });
    },
  },
};
</script>

<template>
  <SectionCard
    v-if="isRootListsMode"
    class="sidebar-lists"
    :class="`${globalTheme}-theme`"
    title="lists"
    :position="isSidebarBreakpointReached ? 'left' : 'centered'"
  >
    <div class="lists-container">
      <div
        v-for="list in sortedLists"
        :key="list.id"
        class="list"
      >
        <ListActionsMenu
          :list="list"
          :class="{ active: isMobileScreen || list.id === currentListId }"
        />
        <ButtonText
          class="list-title"
          :text="list.title"
          style-type="line"
          :active="list.id === currentListId"
          @click="fetchListById(list.id)"
        />
      </div>
      <div class="buttons-container">
        <ButtonText
          text="add list"
          size="small"
          with-plus-icon
          :disabled="requestHandling.isRequestProcessing"
          @click="openModal('listModal')"
        />
      </div>
    </div>
    <TestData />
  </SectionCard>
  <div v-else>
    <ListWithChildLists
      v-if="parentList"
      :parent-list="parentList"
      @load="fetchListById"
      @add-list="openModal('listModal', parentList.id)"
    />
  </div>
</template>

<style lang="scss">
  .sidebar-lists {
    .lists-container {
      margin-bottom: 100px;
    }

    .list {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      width: fit-content;
      margin-bottom: 5px;
      margin-left: -16px;

      &:last-of-type {
        margin-bottom: 20px;
      }

      &:hover {
        .list-actions-menu {
          opacity: 1;
        }
      }
    }

    .list-actions-menu {
      opacity: 0;

      &.active {
        opacity: 1;
      }
    }

    .list-title {
      width: fit-content;
      border-bottom: 2px solid map-get($colors, 'white');
      transition: border-color 0.2s;

      &.active {
        border-color: map-get($colors, 'black');
      }
    }

    .buttons-container {
      display: flex;
      gap: 10px;
      padding-top: 30px;
    }

    &.inverted-theme {
      .list-title {
        border-color: map-get($colors, 'black');

        &.active {
          border-color: map-get($colors, 'white');
        }
      }
    }
  }
</style>
