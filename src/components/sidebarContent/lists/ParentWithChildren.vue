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
    breadCrumbs() {
      return this.populateBreadCrumbs(this.parentList);
    },
    lastBreadCrumbIndex() {
      return this.breadCrumbs.length - 1;
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
    populateBreadCrumbs(list) {
      const breadCrumbs = [];

      const findParentAndAddToBreadCrumbs = targetList => {
        breadCrumbs.unshift({
          title: targetList.title,
          id: targetList.id,
        });

        if (targetList.parentListId) {
          const parentList = this.lists.find(
            localList => localList.id === targetList.parentListId,
          );

          if (parentList) {
            findParentAndAddToBreadCrumbs(parentList);
          }
        }
      };

      findParentAndAddToBreadCrumbs(list);

      return breadCrumbs;
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
  <div class="parent-with-children">
    <div class="bread-crumbs-container">
      <ButtonText
        text="lists"
        style-type="underline"
        size="small"
        @click="returnHome"
      />
      <div
        v-for="(list, index) in breadCrumbs"
        :key="list.id"
        class="bread-crumb"
      >
        <div class="bread-crumbs-divider">
          / 
        </div>
        <ButtonText
          :text="list.title"
          :style-type="index === lastBreadCrumbIndex ? 'line' : 'underline'"
          :size="index === lastBreadCrumbIndex? 'smallest' : 'small'"
          :disabled="index === lastBreadCrumbIndex"
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
  .parent-with-children {
    margin-bottom: 100px;
  
    .bread-crumbs-container {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
    }

    .bread-crumb {
      display: flex;
      align-items: baseline;
    }

    .bread-crumbs-divider {
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
