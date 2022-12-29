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
    tagsTitles() {
      return this.edittingListObj?.tags.map(tag => tag.title);
    },
  },
  methods: {
    ...mapMutations('lists', [
      'updateListFieldLocally',
    ]),
    addTag(tagTitle) {
      const tags = [
        ...this.edittingListObj.tags,
        {
          title: tagTitle,
          id: null,
        },
      ];

      this.updateListFieldLocally({ field: 'tags', value: tags });
    },
    deleteTag(tagTitle) {
      const tags = this.edittingListObj.tags.filter(
        tag => tag.title !== tagTitle,
      );
      
      this.updateListFieldLocally({ field: 'tags', value: tags });
    },
    tag(query) {
      console.log(query);
    },
  },
};
</script>

<template>
  <div class="list-tags">
    <MultiselectCustom
      :value="tagsTitles"
      :options="tagsTitles"
      mode="tags"
      placeholder="type and press Enter to add new tag"
      :can-clear="false"
      :disabled="disabled"
      @select="addTag"
      @deselect="deleteTag"
      @tag="tag"
      @search-change="tag"
    />
  </div>
</template>

<style lang="scss">
  
</style>
