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
        <ButtonText
          style-type="line"
          class="edit-button"
          text="···"
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
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    TestData,
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
      display: flex;
      align-items: center;
      margin-bottom: 5px;

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
