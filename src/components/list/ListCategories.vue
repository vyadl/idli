<script>
import MultiselectCustom from '@/components/formElements/MultiselectCustom.vue';
import { 
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  components: {
    MultiselectCustom,
  },
  props: {
    disabled: Boolean,
  },
  computed: {
    ...mapGetters('lists', [
      'edittingListObj',
    ]),
    categoriesTitles() {
      return this.edittingListObj.categories.map(category => category.title);
    },
  },
  methods: {
    ...mapMutations('lists', [
      'updateListFieldLocally',
    ]),
    addCategory(categoryTitle) {
      const categories = [
        ...this.edittingListObj.categories,
        {
          title: categoryTitle,
          id: null,
        },
      ];

      this.updateListFieldLocally({ field: 'categories', value: categories });
    },
    deleteCategory(categoryTitle) {
      const categories = this.edittingListObj.categories.filter(
        category => category.title !== categoryTitle,
      );
      
      this.updateListFieldLocally({ field: 'categories', value: categories });
    },
    tag(query) {
      console.log(query);
    },
  },
};
</script>

<template>
  <div class="list-categories">
    <MultiselectCustom
      :value="categoriesTitles"
      :options="categoriesTitles"
      mode="tags"
      placeholder="type and press Enter to add new category"
      :can-clear="false"
      :disabled="disabled"
      @select="addCategory"
      @deselect="deleteCategory"
      @tag="tag"
    />
  </div>
</template>

<style lang="scss">
  
</style>
