<template>
  <div>
    <div class="filters__tags">
      <label 
        class="g-label"
        :class="{'g-label--active': list.id == currentListId}"
        v-for="list in lists"
        :key="list.id"
      >
        {{ list.name }}
        <input 
          type="radio"
          class="filters__input"
          :true-value="1"
          :false-value="0"
          name="list-id"
          :value="list.id"
          @change="_switchList(list.id)"
        >
      </label>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';


export default {
  name: 'FiltersShowing',

  computed: {
    ...mapGetters(['lists', 'currentListId']),
  },

  methods: {
    ...mapActions(['_switchList']),
  },
}
</script>

<style lang="scss">
.filters {
  &__inner {
    user-select: none;
    min-height: 100px;
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