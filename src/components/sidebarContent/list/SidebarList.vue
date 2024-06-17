<script>
import { mapGetters } from 'vuex';

import SectionCard from '@/components/wrappers/SectionCard.vue';
import ListForm from '@/components/list/ListForm.vue';

export default {
  components: {
    SectionCard,
    ListForm,
  },
  computed: {
    ...mapGetters('lists', [
      'edittingListObj',
    ]),
  },
};
</script>

<template>
  <SectionCard>
    <ListForm />
  </SectionCard>
</template>
