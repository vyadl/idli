<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    InputCustom,
  },
  computed: {
    ...mapState([
      'currentSearchValue',
    ]),
  },
  methods: {
    ...mapActions([
      '_setCurrentSearchValue',
    ]),
  },
};
</script>

<template>
<div class="search-field">
  <InputCustom 
    icon="/icons/loupe.svg"
    :placeholder="'search items'"
    :modelValue="currentSearchValue"
    @input="_setCurrentSearchValue"
  />
</div>
</template>
