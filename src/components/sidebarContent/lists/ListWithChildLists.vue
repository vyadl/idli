<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import ListActionsMenu from '@/components/list/ListActionsMenu.vue';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { sortByDate } from '@/utils/sorting';

export default {
  components: {
    ListActionsMenu,
    SectionCard,
    ButtonText,
  },
  props: {
    parentList: Object,
  },
  emits: [
    'load',
    'addList',
  ],
  computed: {
    ...mapGetters('lists', [
      'lists',
      'currentListId',
      'currentListObj',
      'isOwnerView',
    ]),
    childLists() {
      const childLists = this.lists.filter(list => list.parentListId === this.parentList.id); 

      return childLists.length ? childLists : null;
    },
    sortedChildLists() {
      return sortByDate(this.childLists, 'updatedAt');
    },
    breadcrumbs() {
      return this.populateBreadcrumbs(this.parentList);
    },
  },
  methods: {
    ...mapMutations('lists', [
      'setCurrentListId',
      'setCurrentListObj',
      'setParentListIdForNewList',
    ]),
    ...mapActions('items', [
      '_addNewItemPlaceholder',
    ]),
    isBreadcrumbClickable(index) {
      const lastBreadcrumbIndex = this.breadcrumbs.length - 1;
      const isCurrentIndexLast = index === lastBreadcrumbIndex;
      const isLastBreadcrumbOpen = this.breadcrumbs[lastBreadcrumbIndex].id === this.currentListId;

      return !isCurrentIndexLast || (isCurrentIndexLast && !isLastBreadcrumbOpen);
    },
    populateBreadcrumbs(list) {
      const breadcrumbs = [];

      const findParentAndAddToBreadcrumbs = targetList => {
        breadcrumbs.unshift({
          title: targetList.title,
          id: targetList.id,
        });

        if (targetList.parentListId) {
          const parentList = this.lists.find(
            localList => localList.id === targetList.parentListId,
          );

          if (parentList) {
            findParentAndAddToBreadcrumbs(parentList);
          }
        }
      };

      findParentAndAddToBreadcrumbs(list);

      return breadcrumbs;
    },
    loadList(id) {
      this.$emit('load', id);
    },
    addList() {
      this.$emit('addList');
    },
    handleTitleClick() {
      if (this.currentListId !== this.parentList.id) {
        return this.loadList.bind(this, this.parentList.id);
      }
    },
    returnHome() {
      this.setCurrentListId(null);
      this.setCurrentListObj(null);
      this.setParentListIdForNewList(null);
      this.$router.push({ name: 'home', query: { sidebar: 'lists' } });
    },
  },
};
</script>

<template>
  <div class="list-with-child-lists">
    <div class="breadcrumbs-container">
      <ButtonText
        text="lists"
        style-type="underline"
        size="small"
        @click="returnHome"
      />
      <div
        v-for="(list, index) in breadcrumbs"
        :key="list.id"
        class="breadcrumb"
      >
        <div class="breadcrumbs-divider">
          / 
        </div>
        <ButtonText
          :text="list.title"
          :style-type="isBreadcrumbClickable(index) ? 'underline' : 'line'"
          :size="isBreadcrumbClickable(index) ? 'small' : 'smallest'"
          :disabled="!isBreadcrumbClickable(index)"
          @click="loadList(list.id)"
        />
      </div>
    </div>
    <SectionCard
      class="content-container"
      :title="parentList?.title"
      position="left"
      :list-for-menu="parentList"
      :bordered="parentList.id === currentListId"
      :title-click-method="handleTitleClick()"
    >
      <SectionCard
        v-if="childLists"
        title="lists"
        size="small"
        text-style="caps"
        position="left"
      >
        <div
          v-for="childList in sortedChildLists"
          :key="childList.id"
          class="child-list"
        >
          <ListActionsMenu :list="childList" />
          <ButtonText
            class="list-title"
            :text="childList.title"
            :active="childList.id === currentListId"
            style-type="line"
            @click="loadList(childList.id)"
          />
        </div>
      </SectionCard>
      <ButtonText
        text="add list"
        size="small"
        with-plus-icon
        @click="addList"
      />
    </SectionCard>
  </div>
</template>

<style lang="scss" scodep>
  .list-with-child-lists {
    margin-bottom: 100px;
  
    .breadcrumbs-container {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
    }

    .breadcrumb {
      display: flex;
      align-items: baseline;
    }

    .breadcrumbs-divider {
      padding: 0 3px;
      font-size: 10px;
    }

    .child-list {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      width: fit-content;
      margin-bottom: 5px;
      margin-left: -16px;

      &:last-of-type {
        margin-bottom: 30px;
      }
    }

    .list-title {
      width: fit-content;
      border-bottom: 2px solid map-get($colors, 'white');
      transition: border-color 0.2s;

      &.active {
        border-color: map-get($colors, 'black');
      }
    }

    &.inverted-theme {
      .list-title {
        border-color: map-get($colors, 'black');
      }
    }
  }
</style>
