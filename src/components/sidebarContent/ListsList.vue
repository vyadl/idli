<template>
  <SidebarCard
    class="lists-list"
    title="lists"
  >
    <ButtonText
      text="new list"
      style-type="solid"
      @click="openListForm"
    />
    <div class="lists-container">
      <div
        class="list"
        v-for="list in lists"
        :key="list.id"
      >
        <ButtonText
          :text="list.name"
          :active="list.id === currentListId"
          @click="_switchList(list.id)"
        />
        <ButtonText
          class="edit-button"
          text="edit"
          @click="setListForEditting(list.id)"
        />
      </div>
    </div>
    <TestData/>
    <ListForm/>
  </SidebarCard>
</template>

<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import TestData from '@/components/sidebarContent/TestData.vue';
import ListForm from '@/components/list/ListForm.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    TestData,
    ListForm,
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
      margin-bottom: 40px;
    }

    .list {
      &:hover {
        .edit-button {
          opacity: 1;
        }
      }
    }

    button.edit-button {
      opacity: 0;
    }
  }
</style>
