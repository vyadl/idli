<script>
import SectionCard from '@/components/wrappers/SectionCard.vue';
import TestData from '@/components/sidebarContent/lists/TestData.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { sortByDate } from '@/utils/sorting';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    SectionCard,
    TestData,
    ButtonSign,
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
    sortedLists() {
      return sortByDate(this.lists, 'updatedAt'); 
    },
    isAddItemPossible() {
      return this.currentListObj 
        && this.isOwnerView
        && this.$route.name === 'list';
    },
  },
  methods: {
    ...mapMutations([
      'decreaseExplicitRequestsNumber',
    ]),
    ...mapActions('items', [
      '_addNewItemPlaceholder',
    ]),
    ...mapActions('lists', [
      '_fetchListById',
      '_setEdittingListObj',
    ]),
    ...mapActions([
      '_resetCustomView',
    ]),

    openModal(name) {
      this.$vfm.show(name);
    },
    setEdittingListObj(list) {
      this._setEdittingListObj(list);
      this.openModal('listModal');
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

      const request = this._fetchListById({ id, cancelToken: source.token });

      handleRequestStatuses(request, this.requestHandling, { onlyFinally: true })
        .finally(() => {
          const index = this.listRequests.findIndex(listRequest => listRequest === source);

          this.listRequests.splice(index, 1);
          this._resetCustomView();
        });
    },
  },
};
</script>

<template>
  <SectionCard
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
        <ButtonSign
          class="edit-button"
          :class="{ active: isMobileScreen || list.id === currentListId }"
          style-type="dots"
          @click="setEdittingListObj(list)"
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
          :disabled="requestHandling.isRequestProcessing"
          @click="openModal('listModal')"
        />
        <ButtonText
          v-if="isAddItemPossible"
          text="add item"
          size="small"
          :disabled="requestHandling.isRequestProcessing"
          @click="_addNewItemPlaceholder"
        />
      </div>
    </div>
    <TestData />
  </SectionCard>
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
      transform: translateX(-16px);

      &:last-of-type {
        margin-bottom: 20px;
      }

      &:hover {
        .edit-button {
          opacity: 1;
        }
      }
    }

    .edit-button {
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
