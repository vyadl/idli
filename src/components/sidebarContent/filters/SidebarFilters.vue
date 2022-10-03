<script>
import SearchField from '@/components/sidebarContent/filters/SearchField.vue';
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SearchField,
    SidebarCard,
    CheckboxCustom,
    ButtonText,
    InfoMessage,
  },
  computed: {
    ...mapGetters([
      'currentListObj',
      'currentListTags',
      'currentListCategories',
      'checkedTags',
      'checkedCategories',
      'currentSearchValue',
      'filteredListLength',
    ]),
    tagsInfoMessage() {
      return !this.currentListTags?.length ? 'no tags in this list' : '';
    },
    categoriesInfoMessage() {
      return !this.currentListCategories?.length ? 'no categories in this list' : '';
    },
  },
  methods: {
    ...mapActions([
      '_resetFilters',
      '_setCategories',
      '_setTags',
    ]),
  },
};
</script>

<template>
<div class="sidebar-filters">
  <div v-if="currentListObj">
    <SidebarCard title="search in list">
      <SearchField />
    </SidebarCard>
    <SidebarCard
      :class="`${globalTheme}-theme`"
      title="filters"
    >
      <h1 class="filters-title">tags</h1>
      <InfoMessage
        v-if="tagsInfoMessage"
        :message="tagsInfoMessage"
      />
      <div class="filters-container">
        <CheckboxCustom
          v-for="tag in currentListTags"
          :key="tag.id"
          :label="tag.title"
          :value="tag.id"
          :model-value="checkedTags"
          @update:model-value="newValue => _setTags(newValue)"
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
          :label="category.title"
          :value="category.id"
          :model-value="checkedCategories"
          @update:model-value="newValue => _setCategories(newValue)"
        />
      </div>
      <footer class="footer">
        <div class="items-count">selected: {{ filteredListLength }}</div>
        <ButtonText
          v-if="checkedTags.length || checkedCategories.length || currentSearchValue"
          text="reset filters"
          style-type="underline"
          @click="_resetFilters"
        />
      </footer>
    </SidebarCard>
  </div>
  <div v-else>
    <InfoMessage message="to manage filters you should choose or create list" />
  </div>
</div>
</template>

<style lang="scss">
  .sidebar-filters {
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

    .footer {
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
