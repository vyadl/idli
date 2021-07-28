<template>
  <div class="lists">
    <div class="inner">
      <div class="g-setting-title main">lists</div>
      <ListsEditing v-if="isEditing" />
      <ListsShowing v-else />
      <label class="g-label edit" :class="{ 'active': isEditing }">
        edit
        <input type="checkbox" class="g-hidden" v-model="isEditing" />
      </label>
      <ButtonText
        text="new list"
        style-type="solid"
        @click="$modal.show('listForm')"
      />
    </div>
    <TestData />
    <ListForm />
  </div>
</template>

<script>
import ListsShowing from '@/components/sidebarContent/ListsShowing.vue';
import ListsEditing from '@/components/sidebarContent/ListsEditing.vue';
import TestData from '@/components/sidebarContent/TestData.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ListForm from '@/components/list/ListForm.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ListsShowing,
    ListsEditing,
    TestData,
    ButtonText,
    ListForm,
  },
  data: () => ({
    isEditing: false,
    localFilters: {
      categories: [],
    },
  }),
  computed: {
    ...mapGetters(['currentListFilters']),
  },
  created() {
    this.localFilters = this.currentListFilters;
  },
  methods: {
    ...mapActions(['_filterList']),
    changeFilter() {
      this._filterList(this.localFilters);
    },
    switchEditing() {
      this.isEditing = !this.isEditing;
    },
  },
};
</script>

<style lang="scss">
  .lists {
    .inner {
      margin-bottom: 50px;
      user-select: none;
    }

    .edit {
      color: #333;

      &.active {
        background-color: #333;
      }
    }
  }
</style>
