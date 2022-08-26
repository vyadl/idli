<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import TestData from '@/components/sidebarContent/TestData.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { sortByDate } from '@/utils/sorting';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    TestData,
    ButtonSign,
    ButtonText,
  },
  data: () => ({
    isRequestProcessing: false,
    listRequests: [],
  }),
  computed: {
    ...mapGetters([
      'lists',
      'currentListId',
      'edittingListObj',
    ]),
    sortedLists() {
      return sortByDate(this.lists, 'updatedAt'); 
    },
  },
  methods: {
    ...mapActions([
      '_fetchListById',
      '_setListForEditting',
      '_decreaseExplicitRequestsNumber',
      '_setModalNameToShow',
      '_resetFilters',
    ]),
    openListModal() {
      this._setModalNameToShow('listModal');
    },
    setListForEditting(list) {
      this._setListForEditting(list);
      this.openListModal();
    },
    fetchListById(id) {
      this.isRequestProcessing = true;

      if (this.listRequests.length) {
        this.listRequests.forEach(request => {
          request.cancel();
        });
        this._decreaseExplicitRequestsNumber();
      }

      const source = this.$config.axios.CancelToken.source();

      this.listRequests.push(source);
      this._fetchListById({ id, cancelToken: source.token })
        .finally(() => {
          const index = this.listRequests.findIndex(request => request === source);

          this.listRequests.splice(index, 1);
          this._resetFilters();
          this.isRequestProcessing = false;
        });
    },
  },
};
</script>

<template>
  <SidebarCard
    class="app-lists"
    :class="`${globalTheme}-theme`"
    title="lists"
  >
    <div class="lists-container">
      <div
        class="list"
        v-for="list in sortedLists"
        :key="list.id"
      >
        <ButtonSign
          class="edit-button"
          :class="{ active:  list.id === currentListId }"
          style-type="dots"
          @click="setListForEditting(list)"
        />
        <ButtonText
          class="list-title"
          :text="list.title"
          style-type="line"
          :active="list.id === currentListId"
          @click="fetchListById(list.id)"
        />
      </div>
      <ButtonSign
        style-type="plus"
        title="new list"
        :disabled="isRequestProcessing"
        @click="openListModal"
      />
    </div>
    <TestData/>
  </SidebarCard>
</template>

<style lang="scss">
  .app-lists {
    .lists-container {
      margin-bottom: 100px;
    }

    .list {
      display: flex;
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
      max-width: 220px;
      border-bottom: 2px solid map-get($colors, 'white');
      transition: border-color .2s;

      &.active {
        border-color: map-get($colors, 'black');
      }
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
