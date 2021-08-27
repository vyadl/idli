<template>
  <SidebarCard
    class="app-lists"
    title="lists"
  >
    <div class="lists-container">
      <div
        class="list"
        v-for="list in lists"
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

<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import TestData from '@/components/sidebarContent/TestData.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
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
    ...mapGetters({
      lists: 'lists',
      currentListId: 'currentListId',
      edittingListObj: 'edittingListObj',
    }),
  },
  methods: {
    ...mapActions({
      _setListForEditting: '_setListForEditting',
      _fetchListById: '_fetchListById',
      _decreaseRequestsNumber: '_decreaseRequestsNumber',
    }),
    openListModal() {
      this.$modal.show('listModal');
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
        this._decreaseRequestsNumber();
      }

      const source = this.$axios.CancelToken.source();

      this.listRequests.push(source);
      this._fetchListById({ id, cancelToken: source.token })
        .finally(() => {
          const index = this.listRequests.findIndex(request => request === source);

          this.listRequests.splice(index, 1);
          this.isRequestProcessing = false;
        });
    },
  },
};
</script>

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
    }
  }
</style>
