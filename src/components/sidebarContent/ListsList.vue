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
          @click="_fetchListById(list.id)"
        />
      </div>
      <ButtonText
        text="new list"
        style-type="bordered"
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
      currentListObj: 'currentListObj',
      edittingListObj: 'edittingListObj',
    }),
  },
  methods: {
    ...mapActions({
      _fetchListById: '_fetchListById',
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
      transform: translateX(-10%);

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
