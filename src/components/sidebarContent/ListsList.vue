<template>
  <SidebarCard
    class="lists-list"
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
          style-type="line"
          :text="list.name"
          :active="list.id === currentListId"
          @click="fetchListById(list.id)"
        />
      </div>
      <ButtonSign
        title="new list"
        style-type="plus"
        :disabled="isRequestProcessing"
        @click="openListForm"
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
    }),
    openListForm() {
      this.$modal.show('listForm');
    },
    setListForEditting(list) {
      this._setListForEditting(list);
      this.openListForm();
    },
    fetchListById(id) {
      this.isRequestProcessing = true;
      this._fetchListById(id)
        .finally(() => {
          this.isRequestProcessing = false;
        });
    },
  },
};
</script>

<style lang="scss">
  .lists-list {
    .lists-container {
      margin-bottom: 100px;
    }

    .list {
      display: flex;
      align-items: center;
      width: fit-content;
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
  }
</style>
