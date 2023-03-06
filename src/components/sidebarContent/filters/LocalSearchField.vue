<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    InputCustom,
  },
  computed: {
    ...mapGetters('filters', [
      'currentSearchValue',
    ]),
  },
  methods: {
    ...mapActions('filters', [
      '_setCurrentSearchValue',
    ]),
  },
};
</script>

<template>
  <div class="local-search-field">
    <InputCustom 
      icon="/icons/loupe.svg"
      with-additional-element
      placeholder="minimum 3 symbols"
      :model-value="currentSearchValue"
      @input="_setCurrentSearchValue"
    />
  </div>
</template>
