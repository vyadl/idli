<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import TestData from '@/components/sidebarContent/lists/TestData.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { sortByDate } from '@/utils/sorting';
import { mapGetters, mapActions, mapMutations } from 'vuex';

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
    ...mapMutations([
      'decreaseExplicitRequestsNumber',
    ]),
    ...mapActions([
      '_fetchListById',
      '_setListForEditting',
      '_setModalNameToShow',
      '_resetCustomView',
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
      }

      const source = this.$config.axios.CancelToken.source();

      this.listRequests.push(source);

      if (this.$route.name !== 'list') {
        this.$router.push({ name: 'list', params: { id } });
      } else {
        this._fetchListById({ id, cancelToken: source.token })
          .finally(() => {
            const index = this.listRequests.findIndex(request => request === source);

            this.listRequests.splice(index, 1);
            this.isRequestProcessing = false;
            this._resetCustomView();
          });
      }
    },
  },
};
</script>

<template>
  <SidebarCard
    class="sidebar-lists"
    :class="`${globalTheme}-theme`"
    title="lists"
  >
    <div class="lists-container">
      <div
        v-for="list in sortedLists"
        :key="list.id"
        class="list"
      >
        <ButtonSign
          class="edit-button"
          :class="{ active: list.id === currentListId }"
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
    <TestData />
  </SidebarCard>
</template>

<style lang="scss">
  .sidebar-lists {
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
      transition: border-color 0.2s;

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
