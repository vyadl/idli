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
    icon="/icons/loupe.svg"
    :placeholder="'search items'"
    :modelValue="currentSearchValue"
    @input="setCurrentSearchValue"
  />
</div>
</template>
