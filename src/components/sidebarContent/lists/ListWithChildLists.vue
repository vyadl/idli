<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { sortByDate } from '@/utils/sorting';

export default {
  components: {
    SectionCard,
    ButtonSign,
    ButtonText,
  },
  props: {
    parentList: Object,
    isRequestProcessing: Boolean,
  },
  emits: [
    'load',
    'edit',
    'addList',
  ],
  computed: {
    ...mapGetters('appearance', [
      'isMobileScreen',
    ]),
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
    lastBreadcrumbIndex() {
      return this.breadcrumbs.length - 1;
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
    editList(list) {
      this.$emit('edit', list);
    },
    addList() {
      this.$emit('addList');
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
          :style-type="index === lastBreadcrumbIndex ? 'line' : 'underline'"
          :size="index === lastBreadcrumbIndex ? 'smallest' : 'small'"
          :disabled="index === lastBreadcrumbIndex"
          @click="loadList(list.id)"
        />
      </div>
    </div>
    <SectionCard
      v-if="!isRequestProcessing"
      class="content-container"
      :title="parentList?.title"
      position="left"
      :menu-button-action="() => editList(parentList)"
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
          <ButtonSign
            style-type="dots"
            @click="editList(childList)"
          />
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
        :disabled="isRequestProcessing"
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
      transform: translateX(-16px);

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
