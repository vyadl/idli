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
          style-type="dots"
          class="edit-button"
          @click="setListForEditting(list.id)"
        />
        <ButtonText
          style-type="line"
          :text="list.name"
          :active="list.id === currentListId"
          @click="_switchList(list.id)"
        />
      </div>
      <ButtonText
        text="add"
        title="new list"
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
  computed: {
    ...mapGetters({
      lists: 'lists',
      currentListId: 'currentListId',
      edittingListObj: 'edittingListObj',
    }),
  },
  methods: {
    ...mapActions({
      _switchList: '_switchList',
      _setListForEditting: '_setListForEditting',
    }),
    openListForm() {
      this.$modal.show('listForm');
    },
    setListForEditting(id) {
      this._setListForEditting(id);
      this.openListForm();
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
      transform: translateX(-15px);

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
    }
  }
</style>
