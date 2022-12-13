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
  data: () => ({
    requestHandling: {
      isRequestProcessing: false,
    },
    listRequests: [],
  }),
  computed: {
    ...mapGetters([
      'isMobileScreen',
    ]),
    ...mapGetters('lists', [
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
    ...mapActions('lists', [
      '_fetchListById',
      '_setListForEditting',
    ]),
    ...mapActions([
      '_resetCustomView',
    ]),
    openListModal() {
      this.$vfm.show('listModal');
    },
    setListForEditting(list) {
      this._setListForEditting(list);
      this.openListModal();
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
        :disabled="requestHandling.isRequestProcessing"
        @click="openListModal"
      />
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
      max-width: 200px;
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
