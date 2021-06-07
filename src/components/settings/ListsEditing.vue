<template>
  <div class="lists-editting">
    <div class="filters__tags">
      <div 
        v-for="list in lists"
        :key="list.id"
      >
        <input
          type="text"
          v-model="list.name"
        >
        <button
          type="button"
          class="g-button"
          @click.stop.prevent="_removeList(list.id)"
        >
          remove list
        </button>
      </div>
      <input
        type="text"
        v-model="newListName"
      >
      <button 
        type="button"
        class="g-button"
        @click.stop.prevent="addList(newListName)"
      >
        add list
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';


export default {
  name: 'FiltersShowing',
  data: function() {
    return {
      newListName: '',
    }
  },

  computed: {
    ...mapGetters(['lists']),
  },

  watch: {
    lists: {
      handler(value) {
      },
      deep: true,
    }
  },

  methods: {
    ...mapActions(['_removeList', '_addList']),

    addList(name) {
      this._addList({ name });

      this.newListName = '';
    }
  },
}
</script>

<style lang="scss">
  .lists-editting {
    &__inner {
      user-select: none;
    }

    &__count {
      position: absolute;
      top: 5px;
      left: 5px;
      color: #bbb;
      font-size: 11px;
    }

    &__trigger {
      position: fixed;
      top: 60px;
      right: 17px;
      width: 20px;
      height: 20px;
      cursor: pointer;
      z-index: 2;
      transition: .2s opacity;
      opacity: 0.7;
      &:hover {
        opacity: 1;
      }

      &::before {
        content: '...';
        font-size: 16px;
        text-align: center;
      }      
    }

    &__edit {
      position: absolute;
      color: #bbb;
      top: auto;
      left: -35px;
      bottom: 7px;
      transform: rotate(-90deg);
      &--active {
        background-color: #333;
      }
    }

    &__types {
      padding-top: 20px;
    }

    &__input {
      display: none;
    }
  }
</style>