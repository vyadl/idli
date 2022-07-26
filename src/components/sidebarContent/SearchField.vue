<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import { mapMutations, mapState } from 'vuex';

export default {
  components: {
    InputCustom,
  },
  data() {
    return {
      value: '',
    };
  },
  computed: {
    ...mapState({
      currentSearchValue: 'currentSearchValue',
    }),
  },
  watch: {
    currentSearchValue(value) {
      if (!value) {
        this.value = '';
      }
    },
  },
  methods: {
    ...mapMutations({
      setCurrentSearchValue: 'setCurrentSearchValue',
    }),
  },
};

</script>

<template>
  <InputCustom 
    :placeholder="'search items'"
    v-model="value"
    @input="setCurrentSearchValue(value)"
  />
</template>
