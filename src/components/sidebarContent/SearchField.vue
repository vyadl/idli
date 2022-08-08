<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import { mapMutations, mapState } from 'vuex';

export default {
  components: {
    InputCustom,
  },
  computed: {
    ...mapState({
      currentSearchValue: 'currentSearchValue',
    }),
  },
  methods: {
    ...mapMutations({
      setCurrentSearchValue: 'setCurrentSearchValue',
    }),
  },
};
</script>

<template>
<div class="search-field">
  <InputCustom 
    padding-right
    :placeholder="'search items'"
    :modelValue="currentSearchValue"
    @input="setCurrentSearchValue"
  />
  <div class="loupe-icon">
    <img 
      alt="loupe" 
      :width="15"
      src="/icons/loupe.svg" 
    />
  </div>
</div>
</template>

<style lang="scss">
.search-field {
  position: relative;
  width: 100%;
  .loupe-icon {
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-40%);
    right: 0;
    opacity: 0.5;
  }
}
</style>
