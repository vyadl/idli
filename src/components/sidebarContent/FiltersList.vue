<template>
  <SidebarCard
    class="filters-list"
    :class="{ 'inverted-theme': isInverted }"
    title="filters"
  >
    <template v-if="currentListObj">
      <h1 class="filters-title">tags</h1>
      <InfoMessage
        v-if="tagsInfoMessage"
        :message="tagsInfoMessage"
      />
      <div class="filters-container">
        <CheckboxCustom
          v-for="tag in currentListTags"
          :key="tag.id"
          :label="tag.name"
          :value="tag.id"
          v-model="localCheckedTags"
          @change="filterList"
        />
      </div>
      <h1 class="filters-title">categories</h1>
      <InfoMessage
        v-if="categoriesInfoMessage"
        :message="categoriesInfoMessage"
      />
      <div class="filters-container">
        <CheckboxCustom
          v-for="category in currentListCategories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
          v-model="localCheckedCategories"
          @change="filterList"
        />
      </div>
      <div class="bottom">
        <div class="items-count">selected: {{ filteredListLength }}</div>
        <ButtonText
          v-if="localCheckedTags.length || localCheckedCategories.length"
          text="reset filters"
          style-type="underline"
          @click="resetFilters"
        />
      </div>
    </template>
    <template v-else>
      <InfoMessage message="to manage filters you should create list" />
    </template>
  </SidebarCard>
</template>

<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    CheckboxCustom,
    ButtonText,
    InfoMessage,
  },
  data: () => ({
    localCheckedTags: [],
    localCheckedCategories: [],
  }),
  computed: {
    ...mapGetters({
      currentListObj: 'currentListObj',
      checkedTags: 'checkedTags',
      checkedCategories: 'checkedCategories',
      currentListTags: 'currentListTags',
      currentListCategories: 'currentListCategories',
      filteredListLength: 'filteredListLength',
    }),
    tagsInfoMessage() {
      return !this.currentListTags?.length ? 'no tags in this list' : '';
    },
    categoriesInfoMessage() {
      return !this.currentListCategories?.length ? 'no categories in this list' : '';
    },
  },
  created() {
    this.localCheckedTags = this.checkedTags;
    this.localCheckedCategories = this.checkedCategories;
  },
  methods: {
    ...mapActions({
      _filterList: '_filterList',
      _resetFilters: '_resetFilters',
    }),
    filterList() {
      this._filterList({
        tags: this.localCheckedTags,
        categories: this.localCheckedCategories,
      });
    },
    resetFilters() {
      this.localCheckedTags = [];
      this.localCheckedCategories = [];
      this._resetFilters();
    },
  },
};
</script>

<style lang="scss">
  .filters-list {
    .filters-title {
      margin-bottom: 10px;
    }

    .filters-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 15px;
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-top: 15px;
    }

    .items-count {
      padding: 5px 0;
      line-height: 1.5;
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }

    &.inverted-theme {
      .items-count {
        color: map-get($colors, 'gray-light');
      }
    }
  }
</style>
